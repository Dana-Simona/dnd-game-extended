package game;

import game.cell.Position;
import game.occupant.unit.player.*;
import java.io.File;
import java.util.*;

public class Game {

    private Player chosenPlayer;
    private List<File> levels;
    private Integer currentLevelIndex;
    private GameBoard currentGameBoard;
    private final MessageCallback messageCallback;

    public Game(MessageCallback callback) {
        this.messageCallback = callback;
        loadAllFiles();
        this.currentLevelIndex = 0;
        selectPlayer(0);
    }

    private void loadAllFiles() {
        this.levels = new ArrayList<>();

        File dir = new File("src/game/levels_dir");
        if (!dir.exists()) {
            dir = new File("backend/src/game/levels_dir");
        }

        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                Arrays.sort(files, Comparator.comparing(File::getName));
                for (File f : files) {
                    if (f.isFile() && f.getName().endsWith(".txt")) {
                        this.levels.add(f);
                        System.out.println("Loaded level file: " + f.getName());
                    }
                }
            }
        } else {
            System.err.println("WARNING: Could not find levels directory at " + dir.getAbsolutePath());
        }
    }

    public List<Player> getAvailablePlayers() {
        List<Player> availablePlayers = new ArrayList<>();
        availablePlayers.add(new Warrior("Jon Snow", 300, 30, 4, 3, new Position(0, 0), messageCallback, null));
        availablePlayers.add(new Warrior("The Hound", 400, 20, 6, 5, new Position(0, 0), messageCallback, null));
        availablePlayers.add(new Mage("Melisandre", 100, 5, 1, new Position(0, 0), messageCallback, 300, 30, 15, 5, 6, null));
        availablePlayers.add(new Mage("Thoros of Myr", 250, 25, 4, new Position(0, 0), messageCallback, 150, 20, 20, 3, 4, null));
        availablePlayers.add(new Rogue("Arya Stark", 150, 40, 2, new Position(0, 0), 20, messageCallback, null));
        availablePlayers.add(new Rogue("Bronn", 250, 35, 3, new Position(0, 0), 50, messageCallback, null));
        availablePlayers.add(new Hunter("Ygritte", 220, 30, 2, new Position(0, 0), 6, messageCallback, null));
        return availablePlayers;
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
            File currentFile = levels.get(currentLevelIndex);
            LevelParser levelParser = new LevelParser(chosenPlayer, messageCallback);
            this.currentGameBoard = levelParser.parseLevel(currentFile);
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

    private void playerInput(char c) {
        Position currentPos = chosenPlayer.getPosition();
        Position targetPos = null;
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
                chosenPlayer.abilityCast();
            case 'q', 'p' -> {
            }
            default ->
                validAction = false;
        }

        if (validAction) {
            if (targetPos != null) {
                chosenPlayer.requestMove(targetPos);
            }
            currentGameBoard.tickAll();

            if (currentGameBoard.isLevelComplete()) {
                currentLevelIndex++;
                messageCallback.send("NEXT LEVEL!");
                if (currentLevelIndex < levels.size()) {
                    parseBoard();
                } else {
                    messageCallback.send("You won!");
                }
            }
        }
    }
}
