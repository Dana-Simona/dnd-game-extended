package game;

import game.cell.Cell;
import game.cell.Floor;
import game.cell.Position;
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

    public LevelParser(Player player, MessageCallback callback) {
        this.callback = callback;
        this.chosenPlayer = player;
        this.cellFactory = Map.ofEntries(
                entry('#', p -> new Wall()),
                entry('.', p -> new Floor()),
                entry('@', p -> {
                    player.setPosition(p.getX(), p.getY());
                    MovementManager movementManager = new MovementManager(boardOutcome, player);
                    player.setMovementManager(movementManager);
                    return new Floor(player);
                }),
                monster('s', "Gold Cloak", 80, 8, 3, 3, 25),
                monster('k', "Knight", 200, 14, 8, 4, 50),
                monster('q', "Queen's Guard", 400, 20, 15, 5, 100),
                monster('z', "Wright", 600, 30, 15, 3, 100),
                monster('b', "Bear", 1000, 75, 30, 4, 250),
                monster('g', "Giant", 1500, 100, 40, 5, 500),
                monster('w', "White Walker", 2000, 150, 50, 6, 1000),
                boss('M', "The Mountain", 1000, 60, 25, 6, 500, 5),
                boss('C', "Queen Cersei", 100, 10, 10, 1, 1000, 8),
                boss('K', "Night's King", 5000, 300, 150, 8, 5000, 3),
                trap('B', "Bonus Trap", 1, 1, 1, 250, 1, 5),
                trap('Q', "Queen's Trap", 250, 50, 10, 100, 3, 7),
                trap('D', "Death Trap", 500, 100, 20, 250, 1, 10)
        );
    }

    private Map.Entry<Character, Function<Position, Cell>> monster(char character, String name, int health, int attack,
            int defense, int vision, int xp) {
        return entry(character, (p) -> {
            Unit activeUnit = new Monster(character, name, health, attack, defense, vision, xp, p, this.callback, this.boardCallback);
            MovementManager movementManager = new MovementManager(this.boardOutcome, activeUnit);
            activeUnit.setMovementManager(movementManager);
            return new Floor(activeUnit);
        });
    }

    private Map.Entry<Character, Function<Position, Cell>> boss(char character, String name, int health, int attack, int defense,
            int vision, int xp, int freq) {
        return entry(character, (p) -> {
            Unit activeUnit = new Boss(character, name, health, attack, defense, vision, xp, freq, p, this.callback, this.boardCallback);
            MovementManager movementManager = new MovementManager(this.boardOutcome, activeUnit);
            activeUnit.setMovementManager(movementManager);
            return new Floor(activeUnit);
        });
    }

    private Map.Entry<Character, Function<Position, Cell>> trap(char character, String name, int health, int attack,
            int defense, int xp, int visibilityTime, int invisibilityTime) {
        return entry(character, (p) -> {
            Unit activeUnit = new Trap(character, name, health, attack, defense, xp, visibilityTime, invisibilityTime, p, this.callback, this.boardCallback);
            MovementManager movementManager = new MovementManager(this.boardOutcome, activeUnit);
            activeUnit.setMovementManager(movementManager);
            return new Floor(activeUnit);
        });
    }

    public GameBoard parseLevel(File levelFile) {
        try {
            List<String> lines = Files.readAllLines(levelFile.toPath());
            return parseLinesToBoard(lines);
        } catch (IOException e) {
            throw new RuntimeException("couldn't read file: " + levelFile.getName(), e);
        }
    }

    private GameBoard parseLinesToBoard(List<String> lines) {
        int boardWidth = lines.getFirst().length();
        int boardHeight = lines.size();

        boardOutcome = new GameBoard(boardWidth, boardHeight);

        this.boardCallback = new BoardManager(boardOutcome);
        chosenPlayer.setBoardCallback(this.boardCallback);

        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            for (int j = 0; j < line.length(); j++) {
                char character = line.charAt(j);

                Position currentPosition = new Position(j, i);

                Cell cell = parseCharacterToCell(character, currentPosition);
                boardOutcome.setCell(currentPosition, cell);
            }
        }

        return boardOutcome;
    }

    private Cell parseCharacterToCell(char character, Position position) {
        Function<Position, Cell> cellBuilder = cellFactory.get(character);
        if (cellBuilder == null) {
            throw new IllegalArgumentException("the character " + character + " doesn't exist in the game");
        }
        Cell cell = cellBuilder.apply(position);
        cell.setPosition(position);
        return cell;
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
            throw new RuntimeException("Couldn't read level resource: " + resourcePath, e);
        }
    }
}
