package game;

import game.cell.Cell;
import game.cell.Floor;
import game.cell.Position;
import game.cell.StairCase;
import game.cell.StairDirection;
import game.cell.Wall;
import game.occupant.unit.Unit;
import game.occupant.unit.enemy.Trap;
import game.occupant.unit.enemy.monster.Boss;
import game.occupant.unit.enemy.monster.Monster;
import game.occupant.unit.player.Player;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import static java.util.Map.entry;
import java.util.function.Function;

public class LevelParser {

    private MessageCallback callback;
    private GameBoard boardOutcome;
    private BoardCallback boardCallback;
    private Player chosenPlayer;
    private final Map<Character, Function<Position, Cell>> cellFactory;
    private StepCounter stepCounter;
    private Boss detectedBoss;

    public LevelParser(Player player, MessageCallback callback, StepCounter stepCounter) {
        this.callback = callback;
        this.stepCounter = stepCounter;
        this.chosenPlayer = player;
        this.cellFactory = Map.ofEntries(
                entry('#', p -> new Wall()),
                entry('^', p -> new StairCase(StairDirection.UP)),
                entry('>', p -> new StairCase(StairDirection.RIGHT)),
                entry('<', p -> new StairCase(StairDirection.LEFT)),
                entry('.', p -> new Floor()),
                entry('@', p -> {
                    player.setPosition(p.getX(), p.getY());
                    player.setMovementManager(new MovementManager(boardOutcome, player, callback));
                    return new Floor(player);
                }),
                monster('s', "Bone Ratchet", 40, 8, 1, 3, 25),
                monster('k', "Hell Hound", 70, 12, 2, 4, 50),
                monster('q', "Abyssal Sentinel", 120, 18, 4, 5, 100),
                monster('z', "Soul-Eater", 180, 25, 6, 3, 150),
                monster('b', "Void Monarch", 300, 35, 8, 4, 250),
                boss('M', "Malakor the Unbroken", 1500, 80, 20, 6, 2000, 5),
                trap('B', "Bonus Trap", 1, 1, 1, 250, 1, 5),
                trap('Q', "Queens Trap", 250, 50, 10, 100, 3, 7), 
                trap('D', "Death Trap", 500, 100, 20, 250, 1, 10) 
        );
    }

    private Map.Entry<Character, Function<Position, Cell>> monster(char character, String name, int health, int attack,
            int defense, int vision, int xp) {
        return entry(character, (p) -> {
            Unit activeUnit = new Monster(character, name, health, attack, defense, vision, xp, p, this.callback, this.boardCallback, stepCounter);
            MovementManager movementManager = new MovementManager(this.boardOutcome, activeUnit, callback);
            activeUnit.setMovementManager(movementManager);
            return new Floor(activeUnit);
        });
    }

    private Map.Entry<Character, Function<Position, Cell>> boss(char character, String name, int health, int attack, int defense,
            int vision, int xp, int freq) {
        return entry(character, (p) -> {
            Boss activeUnit = new Boss(character, name, health, attack, defense, vision, xp, freq, p, this.callback, this.boardCallback, stepCounter);
            MovementManager movementManager = new MovementManager(this.boardOutcome, activeUnit, callback);
            activeUnit.setMovementManager(movementManager);
            this.detectedBoss = activeUnit;
            return new Floor(activeUnit);
        });
    }

    private Map.Entry<Character, Function<Position, Cell>> trap(char character, String name, int health, int attack,
            int defense, int xp, int visibilityTime, int invisibilityTime) {
        return entry(character, (p) -> {
            Unit activeUnit = new Trap(character, name, health, attack, defense, xp, visibilityTime, invisibilityTime, p, this.callback, this.boardCallback, stepCounter);
            MovementManager movementManager = new MovementManager(this.boardOutcome, activeUnit, callback);
            activeUnit.setMovementManager(movementManager);
            return new Floor(activeUnit);
        });
    }

    public GameBoard parseLevel(File levelFile) {
        try {
            List<String> lines = Files.readAllLines(levelFile.toPath());
            return parseLinesToBoard(lines);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read level file: " + levelFile.getName(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing level file '" + levelFile.getName() + "': " + e.getMessage(), e);
        }
    }

    public GameBoard parseLevelFromResource(String resourcePath) {
        try (InputStream is = getClass().getResourceAsStream(resourcePath)) {
            if (is == null) {
                throw new IllegalArgumentException("Resource not found on classpath: " + resourcePath);
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                List<String> lines = reader.lines().toList();
                return parseLinesToBoard(lines);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read level resource: " + resourcePath, e);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing level resource '" + resourcePath + "': " + e.getMessage(), e);
        }
    }

    private GameBoard parseLinesToBoard(List<String> lines) {
        validateLines(lines);

        int boardWidth = lines.getFirst().length();
        int boardHeight = lines.size();

        boardOutcome = new GameBoard(boardWidth, boardHeight);
        detectedBoss = null;
        this.boardCallback = new BoardManager(boardOutcome);
        chosenPlayer.setBoardCallback(this.boardCallback);

        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            validateLineLength(line, boardWidth, i);

            for (int j = 0; j < line.length(); j++) {
                char character = line.charAt(j);
                Position currentPosition = new Position(j, i);

                Cell cell = parseCharacterToCell(character, currentPosition, i, j);
                boardOutcome.setCell(currentPosition, cell);
            }
        }

        try {
        } catch (Exception e) {
            throw new IllegalStateException("Failed during staircase configuration: " + e.getMessage(), e);
        }

        if (detectedBoss != null) {
            announceBoss(detectedBoss);
        }

        return boardOutcome;
    }

    private void announceBoss(Boss boss) {
        boardOutcome.setBoss(boss);
        callback.send(boss.getName() + " awakens!");
        callback.sendEvent(new GameEvent(
                stepCounter.nextStep(),
                ActionType.BOSS_LEVEL,
                boss.getId(),
                chosenPlayer.getId(),
                null
        ));
    }

    private Cell parseCharacterToCell(char character, Position position, int lineIndex, int colIndex) {
        Function<Position, Cell> cellBuilder = cellFactory.get(character);
        if (cellBuilder == null) {
            throw new IllegalArgumentException(
                    String.format("Unknown level character '%c' at [Row %d, Col %d] (x=%d, y=%d)",
                            character, lineIndex + 1, colIndex + 1, colIndex, lineIndex)
            );
        }
        try {
            Cell cell = cellBuilder.apply(position);
            cell.setPosition(position);
            return cell;
        } catch (Exception e) {
            throw new IllegalStateException(
                    String.format("Failed to instantiate cell for character '%c' at [Row %d, Col %d]: %s",
                            character, lineIndex + 1, colIndex + 1, e.getMessage()), e
            );
        }
    }

    private void validateLines(List<String> lines) {
        if (lines == null || lines.isEmpty()) {
            throw new IllegalArgumentException("Level map cannot be empty or null.");
        }
    }

    private void validateLineLength(String line, int expectedWidth, int lineIndex) {
        if (line.length() != expectedWidth) {
            throw new IllegalArgumentException(
                    String.format("Inconsistent map width on line %d. Expected %d characters, but found %d.",
                            lineIndex + 1, expectedWidth, line.length())
            );
        }
    }
}
