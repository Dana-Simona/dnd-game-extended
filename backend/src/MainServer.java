
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import game.Game;
import game.MessageCallback;
import game.occupant.unit.Unit;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Hunter;
import game.occupant.unit.player.Mage;
import game.occupant.unit.player.Player;
import game.occupant.unit.player.Rogue;
import game.occupant.unit.player.Warrior;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MainServer {

    private static Game game;
    private static final List<String> gameLogs = Collections.synchronizedList(new ArrayList<>());

    public static void main(String[] args) {
        try {
            MessageCallback callback = msg -> {
                if (!isMovementLog(msg)) {
                    System.out.println("[GAME LOG]: " + msg);
                    gameLogs.add(msg);
                }
            };
            game = new Game(callback);

            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

            server.createContext("/api/players", exchange -> {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendJsonResponse(exchange, getPlayersJson());
                } else {
                    exchange.sendResponseHeaders(405, -1);
                }
            });

            server.createContext("/api/select-player", exchange -> {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    InputStream is = exchange.getRequestBody();
                    String indexStr = new String(is.readAllBytes()).trim();

                    try {
                        int index = Integer.parseInt(indexStr);
                        game.selectPlayer(index);
                        gameLogs.clear();
                        sendJsonResponse(exchange, "{\"status\": \"success\", \"selected\": " + index + "}");
                    } catch (NumberFormatException e) {
                        sendJsonResponse(exchange, "{\"status\": \"error\", \"message\": \"Invalid index\"}");
                    }
                }
            });

            server.createContext("/api/select-level", exchange -> {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    InputStream is = exchange.getRequestBody();
                    String indexStr = new String(is.readAllBytes()).trim();

                    try {
                        int levelIndex = Integer.parseInt(indexStr);
                        game.selectLevel(levelIndex);
                        gameLogs.clear();
                        sendJsonResponse(exchange, getGameStateJson());
                    } catch (NumberFormatException e) {
                        sendJsonResponse(exchange, "{\"status\": \"error\", \"message\": \"Invalid level index\"}");
                    }
                }
            });

            server.createContext("/api/board", exchange -> {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendJsonResponse(exchange, getGameStateJson());
                }
            });

            server.createContext("/api/action", exchange -> {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    InputStream is = exchange.getRequestBody();
                    String key = new String(is.readAllBytes()).trim().toLowerCase();

                    if (!key.isEmpty()) {
                        gameLogs.clear();
                        game.processTurn(key.charAt(0));
                    }

                    sendJsonResponse(exchange, getGameStateJson());
                }
            });

            server.createContext("/api/logs", exchange -> {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendJsonResponse(exchange, getLogsJson());
                } else {
                    exchange.sendResponseHeaders(405, -1);
                }
            });

            server.setExecutor(null);
            server.start();
            System.out.println("Java Game Server successfully started on http://localhost:8080");

        } catch (IOException e) {
            System.err.println("Server failed to start");
        }
    }

    private static boolean isMovementLog(String msg) {
        if (msg == null) {
            return false;
        }
        String lower = msg.toLowerCase();
        return lower.contains("moved") || lower.contains("moves");
    }

    private static String getGameStateJson() {
        StringBuilder json = new StringBuilder("{");

        json.append("\"grid\":[");
        String[] lines = game.getBoardAsLines();
        for (int i = 0; i < lines.length; i++) {
            String sanitizedLine = lines[i]
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"");
            json.append("\"").append(sanitizedLine).append("\"");
            if (i < lines.length - 1) {
                json.append(",");
            }
        }
        json.append("],");

        json.append("\"player\":");
        if (game.getChosenPlayer() != null) {
            buildPlayerJson(json, game.getChosenPlayer(), null);
        } else {
            json.append("null");
        }

        json.append(",\"units\":").append(getUnitsJson());

        json.append("}");
        return json.toString();
    }

    private static String getUnitsJson() {
        StringBuilder json = new StringBuilder("[");
        List<Enemy> enemies = game.getEnemies();

        boolean first = true;

        if (game.getChosenPlayer() != null) {
            buildGenericUnitJson(json, game.getChosenPlayer());
            first = false;
        }

        if (enemies != null) {
            for (Enemy enemy : enemies) {
                if (!first) {
                    json.append(",");
                }
                buildGenericUnitJson(json, enemy);
                first = false;
            }
        }

        json.append("]");
        return json.toString();
    }

    private static StringBuilder buildGenericUnitJson(StringBuilder json, Unit unit) {
        json.append("{")
                .append("\"name\":\"").append(unit.getName()).append("\",")
                .append("\"type\":\"").append(unit.getClass().getSimpleName()).append("\",")
                .append("\"tile\":\"").append(unit.getCharacter()).append("\",")
                .append("\"x\":").append(unit.getPosition().getX()).append(",")
                .append("\"y\":").append(unit.getPosition().getY()).append(",")
                .append("\"health\":").append(unit.getHealthPool()).append(",")
                .append("\"currentHealth\":").append(unit.getCurrentHealth()).append(",")
                .append("\"attack\":").append(unit.getAttackPoints()).append(",")
                .append("\"defense\":").append(unit.getDefensePoints());

        if (unit instanceof Enemy enemy) {
            json.append(",\"experienceValue\":").append(enemy.getExperienceValue());
        }

        json.append("}");
        return json;
    }

    private static StringBuilder buildPlayerJson(StringBuilder json, Player player, Integer index) {
        json.append("{");

        if (index != null) {
            json.append("\"index\":").append(index).append(",");
        }

        json.append("\"name\":\"").append(player.getName()).append("\",")
                .append("\"class\":\"").append(player.getClass().getSimpleName()).append("\",")
                .append("\"tile\":\"").append(player.getCharacter()).append("\",")
                .append("\"x\":").append(player.getPosition().getX()).append(",")
                .append("\"y\":").append(player.getPosition().getY()).append(",")
                .append("\"level\":").append(player.getLevel()).append(",")
                .append("\"health\":").append(player.getHealthPool()).append(",")
                .append("\"currentHealth\":").append(player.getCurrentHealth()).append(",")
                .append("\"attack\":").append(player.getAttackPoints()).append(",")
                .append("\"defense\":").append(player.getDefensePoints());

        switch (player) {
            case Mage mage ->
                json.append(",\"manaPool\":").append(mage.getManaPool())
                        .append(",\"currentMana\":").append(mage.getCurrentMana())
                        .append(",\"manaCost\":").append(mage.getManaCost())
                        .append(",\"spellPower\":").append(mage.getSpellPower())
                        .append(",\"hitCount\":").append(mage.getHitCount())
                        .append(",\"range\":").append(mage.getAbilityRange());

            case Rogue rogue ->
                json.append(",\"energy\":").append(100)
                        .append(",\"currentEnergy\":").append(rogue.getCurrentEnergy())
                        .append(",\"energyCost\":").append(rogue.getEnergyCost());

            case Warrior warrior ->
                json.append(",\"cooldown\":").append(warrior.getCooldown())
                        .append(",\"currentCooldown\":").append(warrior.getRemainingCooldown());

            case Hunter hunter ->
                json.append(",\"arrowCount\":").append(hunter.getArrowCount())
                        .append(",\"range\":").append(hunter.getRange());

            default -> {
            }
        }

        json.append("}");
        return json;
    }

    private static String getPlayersJson() {
        List<Player> players = game.getAvailablePlayers();
        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < players.size(); i++) {
            buildPlayerJson(json, players.get(i), i);
            if (i < players.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");
        return json.toString();
    }

    private static String getLogsJson() {
        StringBuilder json = new StringBuilder("[");
        synchronized (gameLogs) {
            for (int i = 0; i < gameLogs.size(); i++) {
                String sanitizedLog = gameLogs.get(i)
                        .replace("\\", "\\\\")
                        .replace("\"", "\\\"")
                        .replace("\b", "\\b")
                        .replace("\f", "\\f")
                        .replace("\n", "\\n")
                        .replace("\r", "\\r")
                        .replace("\t", "\\t");
                json.append("\"").append(sanitizedLog).append("\"");
                if (i < gameLogs.size() - 1) {
                    json.append(",");
                }
            }
        }
        json.append("]");
        return json.toString();
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    }

    private static void sendJsonResponse(HttpExchange exchange, String json) throws IOException {
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        byte[] bytes = json.getBytes();
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
