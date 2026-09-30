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
        availablePlayers.add(new Warrior("Jon Snow", 300, 300, 4, 3, new Position(0, 0), messageCallback, null, stepCounter));
        availablePlayers.add(new Warrior("The Hound", 400, 20, 6, 5, new Position(0, 0), messageCallback, null, stepCounter));
        availablePlayers.add(new Mage("Melisandre", 100, 50, 1, new Position(0, 0), messageCallback, 300, 30, 15, 5, 6, null, stepCounter));
        availablePlayers.add(new Mage("Thoros of Myr", 250, 25, 4, new Position(0, 0), messageCallback, 150, 20, 20, 3, 4, null, stepCounter));
        availablePlayers.add(new Rogue("Arya Stark", 150, 40, 2, new Position(0, 0), 20, messageCallback, null, stepCounter));
        availablePlayers.add(new Rogue("Bronn", 250, 35, 3, new Position(0, 0), 50, messageCallback, null, stepCounter));
        availablePlayers.add(new Hunter("Ygritte", 220, 30, 2, new Position(0, 0), 6, messageCallback, null, stepCounter));
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
