package game;

import game.cell.Position;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.*;
import java.util.*;

public final class Game {

    private Player chosenPlayer;
    private List<String> levels;
    private Integer currentLevelIndex;
    private GameBoard currentGameBoard;
    private final MessageCallback messageCallback;
    private final StepCounter stepCounter;

    public Game(MessageCallback callback) {
        this.messageCallback = callback;
        this.stepCounter = new StepCounter();
        loadAllFiles();
        this.currentLevelIndex = 0;
        selectPlayer(0);
    }

    public Integer getCurrentLevel() {
        return this.currentLevelIndex + 1;
    }

    private void loadAllFiles() {
        this.levels = new ArrayList<>();

        int levelNumber = 1;
        while (true) {
            String resourcePath = "/game/levels_dir/level" + levelNumber + ".txt";
            if (getClass().getResource(resourcePath) != null) {
                this.levels.add(resourcePath);
                levelNumber++;
            } else {
                break;
            }
        }

        if (this.levels.isEmpty()) {
            System.err.println("WARNING: no level files found on the classpath at /game/levels_dir/level1.txt. "
                    + "Make sure the level .txt files are copied into the build output / jar.");
        }
    }

    private void requireBoard() {
        if (currentGameBoard == null) {
            throw new IllegalStateException("No level is loaded (" + levels.size()
                    + " level files found on the classpath; expected /game/levels_dir/level1.txt). "
                    + "The level .txt files are probably missing from the build output.");
        }
    }

    public List<Player> getAvailablePlayers() {
        List<Player> availablePlayers = new ArrayList<>();

        availablePlayers.add(new Mage("Aurora", 120, 20, 2, new Position(0, 0), messageCallback, 90, 30, 30, 4, 5, null, stepCounter));
        availablePlayers.add(new Mage("Kaeleen", 130, 25, 4, new Position(0, 0), messageCallback, 100, 25, 22, 5, 4, null, stepCounter));
        availablePlayers.add(new Mage("Astria", 150, 30, 6, new Position(0, 0), messageCallback, 100, 20, 18, 3, 4, null, stepCounter));

        availablePlayers.add(new Warrior("Valor", 260, 50, 4, 3, new Position(0, 0), messageCallback, null, stepCounter));
        availablePlayers.add(new Warrior("Vane", 300, 55, 5, 4, new Position(0, 0), messageCallback, null, stepCounter));
        availablePlayers.add(new Warrior("Orion", 340, 60, 6, 5, new Position(0, 0), messageCallback, null, stepCounter));

        availablePlayers.add(new Rogue("Scythe", 180, 42, 2, new Position(0, 0), 20, messageCallback, null, stepCounter));
        availablePlayers.add(new Rogue("Vessel", 250, 35, 4, new Position(0, 0), 35, messageCallback, null, stepCounter));
        availablePlayers.add(new Rogue("Echo", 290, 30, 6, new Position(0, 0), 45, messageCallback, null, stepCounter));

        availablePlayers.add(new Hunter("Vaskaara", 170, 40, 2, new Position(0, 0), 7, messageCallback, null, stepCounter));
        availablePlayers.add(new Hunter("Blight", 200, 45, 3, new Position(0, 0), 5, messageCallback, null, stepCounter));
        availablePlayers.add(new Hunter("Trakiraa", 230, 50, 4, new Position(0, 0), 4, messageCallback, null, stepCounter));

        return availablePlayers;
    }

    public void selectLevel(int levelNumber) {
        if (levelNumber >= 1 && levelNumber <= levels.size()) {
            this.currentLevelIndex = levelNumber - 1;
            parseBoard();
        }
    }

    public void selectPlayer(int index) {
        List<Player> players = getAvailablePlayers();
        if (index >= 0 && index < players.size()) {
            this.chosenPlayer = players.get(index);
        } else {
            this.chosenPlayer = players.get(0);
        }
        this.currentLevelIndex = 0;
        parseBoard();
    }

    private void parseBoard() {
        if (!levels.isEmpty() && currentLevelIndex < levels.size()) {
            String resourcePath = levels.get(currentLevelIndex);
            LevelParser levelParser = new LevelParser(chosenPlayer, messageCallback, stepCounter);
            this.currentGameBoard = levelParser.parseLevelFromResource(resourcePath);
        }
    }

    public void processTurn(char input) {
        requireBoard();
        if (chosenPlayer == null || chosenPlayer.isDead()) {
            return;
        }

        playerInput(input);

        if (chosenPlayer.isDead()) {
            chosenPlayer.onDeath();
            messageCallback.send("Game Over!");
            messageCallback.sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.LOSE, null, null));
        }
    }

    public String[] getBoardAsLines() {
        if (currentGameBoard == null) {
            return new String[0];
        }
        return currentGameBoard.toString().split("\n");
    }

    public Player getChosenPlayer() {
        return chosenPlayer;
    }

    public List<Enemy> getEnemies() {
        requireBoard();
        return currentGameBoard.getEnemies();
    }

    private void playerInput(char c) {
        Position currentPos = chosenPlayer.getPosition();
        Position targetPos = null;
        boolean isAbility = false;
        boolean validAction = true;

        switch (c) {
            case 'd' ->
                targetPos = new Position(currentPos.getX() + 1, currentPos.getY());
            case 'w' ->
                targetPos = new Position(currentPos.getX(), currentPos.getY() - 1);
            case 's' ->
                targetPos = new Position(currentPos.getX(), currentPos.getY() + 1);
            case 'a' ->
                targetPos = new Position(currentPos.getX() - 1, currentPos.getY());
            case 'e' ->
                isAbility = true;
            case 'q', 'p' -> {
            }
            default ->
                validAction = false;
        }

        if (validAction) {
            stepCounter.resetCount();
            if (targetPos != null) {
                chosenPlayer.requestMove(targetPos);
            } else if (isAbility) {
                chosenPlayer.abilityCast();
            }

            currentGameBoard.tickAll();

            if (currentGameBoard.isLevelComplete()) {
                currentLevelIndex++;
                messageCallback.send("NEXT LEVEL!");
                messageCallback.sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.NEXT_LEVEL, null, getCurrentLevel()));
                if (currentLevelIndex < levels.size()) {
                    parseBoard();
                } else {
                    messageCallback.send("You won!");
                    messageCallback.sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.WIN, null, null));
                }
            }
        }
    }
}
