package game;

import game.cell.Position;
import game.occupant.unit.player.Player;
import game.occupant.unit.player.Warrior;
import game.occupant.unit.player.Mage;
import game.occupant.unit.player.Rogue;
import game.occupant.unit.player.Hunter;

import java.io.File;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

public class Game {
    private Player chosenPlayer;
    private List<File> levels;
    private Integer currentLevelIndex;
    private GameBoard currentGameBoard;
    private final MessageCallback messageCallback;
    // REMOVED: the unused, uninitialized boardCallback field that was causing the leak

    public Game(MessageCallback callback) {
        this.messageCallback = callback;
        loadAllFiles();
        this.currentLevelIndex = 0;
        startGame();
    }

    private void loadAllFiles() {
        this.levels = new ArrayList<>();
        File dir = new File("src/game/levels_dir");
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                java.util.Arrays.sort(files, Comparator.comparing(File::getName));
                for (File f : files) {
                    if (f.isFile() && f.getName().endsWith(".txt")) {
                        this.levels.add(f);
                    }
                }
            }
        }
    }

    private void parseBoard() {
        if (!levels.isEmpty()) {
            File currentFile = levels.get(currentLevelIndex);
            LevelParser levelParser = new LevelParser(chosenPlayer, messageCallback);
            this.currentGameBoard = levelParser.parseLevel(currentFile);
        } else {
            throw new IllegalArgumentException("couldn't load files");
        }
    }

    private void sendMessage(String message) {
        messageCallback.send(message);
    }

    private List<Player> loadAllPlayers() {
        List<Player> availablePlayers = new ArrayList<>();
        availablePlayers.add(new Warrior("Jon Snow", 300, 30, 4, 3, new Position(0, 0), messageCallback, null));
        availablePlayers.add(new Warrior("The Hound", 400, 20, 6, 5, new Position(0, 0), messageCallback, null));
        availablePlayers.add(new Mage("Melisandre", 100, 5, 1, new Position(0, 0), messageCallback, 300, 30, 15, 5, 6, null));
        availablePlayers.add(new Mage("Thoros of Myr", 250, 25, 4, new Position(0, 0), messageCallback, 150, 20, 20, 3, 4, null));
        availablePlayers.add(new Rogue("Arya Stark", 150, 40, 2, new Position(0, 0), 20, messageCallback, null));
        availablePlayers.add(new Rogue("Bronn", 250, 35, 3, new Position(0, 0), 50, messageCallback, null));
        availablePlayers.add(new Hunter("Ygritte", 220, 30, 2, new Position(0, 0), 6, messageCallback, null));

        for (int i = 0; i < availablePlayers.size(); i++) {
            sendMessage((i + 1) + ". " + availablePlayers.get(i).description());
        }
        return availablePlayers;
    }

    private void choosePlayer() {
        List<Player> availablePlayers = loadAllPlayers();
        Scanner scanner = new Scanner(System.in);
        int selection = Integer.parseInt(scanner.nextLine());
        int characterIndex = selection - 1;

        if (characterIndex < 0 || characterIndex >= availablePlayers.size()) {
            sendMessage("invalid input, defaulting to " + availablePlayers.getFirst().getName());
            this.chosenPlayer = availablePlayers.getFirst();
        } else {
            this.chosenPlayer = availablePlayers.get(characterIndex);
        }
        sendMessage(chosenPlayer.getName());
        parseBoard();
    }

    private void nextLevel() {
        currentLevelIndex++;
        sendMessage("NEXT LEVEL!");
        if (currentLevelIndex < levels.size()) {
            parseBoard();
        } else {
            sendMessage("You won!");
        }
    }

    private void startGame() {
        choosePlayer();
        gameTick();
    }

    private void gameTick() {
        Scanner scanner = new Scanner(System.in);
        while (currentLevelIndex < levels.size() && !chosenPlayer.isDead()) {
            sendMessage(currentGameBoard.toString());
            sendMessage(chosenPlayer.description());
            if (scanner.hasNextLine()) {
                String input = scanner.nextLine();
                if (!input.isEmpty()) {
                    char selection = input.charAt(0);
                    playerInput(selection);
                }
            }
        }
        if (chosenPlayer.isDead()) {
            loseGame();
        }
    }

    private void loseGame() {
        sendMessage(chosenPlayer.description());
        chosenPlayer.onDeath();
        sendMessage(currentGameBoard.toString());
        sendMessage("Game Over");
    }

    public void playerInput(char c) {
        if (chosenPlayer == null || currentGameBoard == null) {
            return;
        }

        Position currentPos = chosenPlayer.getPosition();
        Position targetPos = null;
        boolean validAction = true;

        switch (c) {
            case 'd' -> targetPos = new Position(currentPos.getX() + 1, currentPos.getY());
            case 'w' -> targetPos = new Position(currentPos.getX(), currentPos.getY() - 1);
            case 's' -> targetPos = new Position(currentPos.getX(), currentPos.getY() + 1);
            case 'a' -> targetPos = new Position(currentPos.getX() - 1, currentPos.getY());
            case 'e' -> chosenPlayer.abilityCast();
            case 'p' -> {
                // Passing turn / doing nothing
            }
            default -> {
                sendMessage("Invalid input!");
                validAction = false;
            }
        }

        if (validAction) {
            if (targetPos != null) {
                chosenPlayer.requestMove(targetPos);
            }

            currentGameBoard.tickAll();

            if (currentGameBoard.isLevelComplete()) {
                nextLevel();
            }
        }
    }
}