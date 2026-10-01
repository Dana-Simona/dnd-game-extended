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
    }

    public List<Player> getAvailablePlayers() {
        List<Player> availablePlayers = new ArrayList<>();

        availablePlayers.add(new Mage("Aurora", 140, 15, 2, new Position(0, 0), messageCallback, 300, 35, 30, 4, 6, null, stepCounter));
        availablePlayers.add(new Mage("Kaeleen", 220, 22, 4, new Position(0, 0), messageCallback, 200, 25, 20, 5, 5, null, stepCounter));
        availablePlayers.add(new Mage("Astria", 280, 28, 6, new Position(0, 0), messageCallback, 150, 20, 18, 3, 4, null, stepCounter));

        availablePlayers.add(new Warrior("Valor", 320, 38, 4, 3, new Position(0, 0), messageCallback, null, stepCounter));
        availablePlayers.add(new Warrior("Vane", 400, 28, 7, 4, new Position(0, 0), messageCallback, null, stepCounter));
        availablePlayers.add(new Warrior("Orion", 480, 22, 10, 5, new Position(0, 0), messageCallback, null, stepCounter));

        availablePlayers.add(new Rogue("Scythe", 180, 42, 2, new Position(0, 0), 20, messageCallback, null, stepCounter));
        availablePlayers.add(new Rogue("Vessel", 250, 35, 4, new Position(0, 0), 35, messageCallback, null, stepCounter));
        availablePlayers.add(new Rogue("Echo", 290, 30, 6, new Position(0, 0), 45, messageCallback, null, stepCounter));

        availablePlayers.add(new Hunter("Vaskaara", 200, 38, 2, new Position(0, 0), 7, messageCallback, null, stepCounter));
        availablePlayers.add(new Hunter("Blight", 240, 30, 4, new Position(0, 0), 5, messageCallback, null, stepCounter));
        availablePlayers.add(new Hunter("Trakiraa", 290, 25, 6, new Position(0, 0), 4, messageCallback, null, stepCounter));

        return availablePlayers;
    }

    public void selectLevel(int levelIndex) {
        if (levelIndex >= 0 && levelIndex < levels.size()) {
            this.currentLevelIndex = levelIndex - 1;
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
        if (chosenPlayer == null || currentGameBoard == null || chosenPlayer.isDead()) {
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
                messageCallback.sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.NEXT_LEVEL, null, null));
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
