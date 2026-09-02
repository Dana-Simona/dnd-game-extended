
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import game.Game;
import game.MessageCallback;
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
                System.out.println("[GAME LOG]: " + msg);
                gameLogs.add(msg);
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
                        gameLogs.clear(); // Clear logs when a new player is selected
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
                        gameLogs.clear(); // Clear logs when switching levels
                        sendJsonResponse(exchange, getBoardJson());
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
                    sendJsonResponse(exchange, getBoardJson());
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

                    sendJsonResponse(exchange, getBoardJson());
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
            System.err.println("Server failed to start:");
            e.printStackTrace();
        }
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

    private static String getPlayersJson() {
        List<Player> players = game.getAvailablePlayers();
        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < players.size(); i++) {
            Player p = players.get(i);

            json.append("{")
                    .append("\"index\":").append(i).append(",")
                    .append("\"name\":\"").append(p.getName()).append("\",")
                    .append("\"class\":\"").append(p.getClass().getSimpleName()).append("\",")
                    .append("\"health\":").append(p.getHealthPool()).append(",")
                    .append("\"attack\":").append(p.getAttackPoints()).append(",")
                    .append("\"defense\":").append(p.getDefensePoints());

            switch (p) {
                case Mage mage ->
                    json.append(",\"mana\":").append(mage.getManaPool()).append(",")
                            .append("\"manaCost\":").append(mage.getManaCost()).append(",")
                            .append("\"spellPower\":").append(mage.getSpellPower()).append(",")
                            .append("\"hitCount\":").append(mage.getHitCount()).append(",")
                            .append("\"range\":").append(mage.getAbilityRange());
                case Rogue rogue ->
                    json.append(",\"energyCost\":").append(rogue.getEnergyCost());
                case Warrior warrior ->
                    json.append(",\"cooldown\":").append(warrior.getCooldown());
                case Hunter hunter ->
                    json.append(",\"range\":").append(hunter.getRange());
                default -> {
                }
            }

            json.append("}");

            if (i < players.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        return json.toString();
    }

    private static String getBoardJson() {
        String[] lines = game.getBoardAsLines();
        StringBuilder json = new StringBuilder("{\"grid\": [");
        for (int i = 0; i < lines.length; i++) {
            json.append("\"").append(lines[i].replace("\"", "\\\"")).append("\"");
            if (i < lines.length - 1) {
                json.append(",");
            }
        }
        json.append("]}");
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
