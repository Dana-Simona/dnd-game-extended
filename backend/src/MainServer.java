
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import game.Game;
import game.GameEvent;
import game.MessageCallback;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;
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
    private static final List<GameEvent> turnEvents = Collections.synchronizedList(new ArrayList<>());

    public static void main(String[] args) {
        try {
            MessageCallback callback = new MessageCallback() {
                @Override
                public void send(String message) {
                    if (!isMovementLog(message)) {
                        System.out.println("[GAME LOG]: " + message);
                        gameLogs.add(message);
                    }
                }

                @Override
                public void sendEvent(GameEvent event) {
                    turnEvents.add(event);
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
                        turnEvents.clear();
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
                        gameLogs.clear();
                        turnEvents.clear();
                        game.selectLevel(levelIndex);
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
                        turnEvents.clear();
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

        json.append("\"level\":").append(game.getCurrentLevel()).append(",");

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
        UnitJsonBuilder.buildUnitJson(json, game.getChosenPlayer(), null);

        json.append(",\"units\":").append(getUnitsJson());

        json.append(",\"events\":[");
        synchronized (turnEvents) {
            for (int i = 0; i < turnEvents.size(); i++) {
                buildGameEventJson(json, turnEvents.get(i));
                if (i < turnEvents.size() - 1) {
                    json.append(",");
                }
            }
        }
        json.append("]");

        json.append("}");
        return json.toString();
    }

    private static String getUnitsJson() {
        StringBuilder json = new StringBuilder("[");
        List<Enemy> enemies = game.getEnemies();

        boolean first = true;

        if (game.getChosenPlayer() != null) {
            UnitJsonBuilder.buildUnitJson(json, game.getChosenPlayer(), null);
            first = false;
        }

        if (enemies != null) {
            for (Enemy enemy : enemies) {
                if (!first) {
                    json.append(",");
                }
                UnitJsonBuilder.buildUnitJson(json, enemy, null);
                first = false;
            }
        }

        json.append("]");
        return json.toString();
    }

    private static String getPlayersJson() {
        List<Player> players = game.getAvailablePlayers();
        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < players.size(); i++) {
            UnitJsonBuilder.buildUnitJson(json, players.get(i), i);
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

    private static StringBuilder buildGameEventJson(StringBuilder json, GameEvent event) {
        json.append("{")
                .append("\"step\":").append(event.getStep()).append(",")
                .append("\"type\":\"").append(event.getType() != null ? event.getType().getLabel() : "").append("\",")
                .append("\"sourceId\":").append(event.getSourceId() != null ? "\"" + event.getSourceId() + "\"" : "null").append(",");

        json.append("\"targetIds\":");
        if (event.getTargetIds() != null) {
            json.append("[");
            for (int i = 0; i < event.getTargetIds().size(); i++) {
                json.append("\"").append(event.getTargetIds().get(i)).append("\"");
                if (i < event.getTargetIds().size() - 1) {
                    json.append(",");
                }
            }
            json.append("]");
        } else {
            json.append("null");
        }

        json.append(",\"amount\":").append(event.getAmount() != null ? event.getAmount() : "null");
        json.append("}");
        return json;
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        com.sun.net.httpserver.Headers headers = exchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", "https://dana-simona.github.io");
        headers.set("Access-Control-Allow-Headers", "*");
        headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.set("Access-Control-Allow-Credentials", "true");
    }

    private static void sendJsonResponse(HttpExchange exchange, String json) throws IOException {
        addCorsHeaders(exchange);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        byte[] bytes = json.getBytes();
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
