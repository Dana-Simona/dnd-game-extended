
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
import java.util.List;

public class MainServer {
    private static Game game;

    public static void main(String[] args) {
        try {
            MessageCallback callback = msg -> System.out.println("[GAME LOG]: " + msg);
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
                    exchange.sendResponseHeaders(450, -1);
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
                        sendJsonResponse(exchange, "{\"status\": \"success\", \"selected\": " + index + "}");
                    } catch (NumberFormatException e) {
                        sendJsonResponse(exchange, "{\"status\": \"error\", \"message\": \"Invalid index\"}");
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
                        game.processTurn(key.charAt(0));
                    }

                    sendJsonResponse(exchange, getBoardJson());
                }
            });

            server.setExecutor(null);
            server.start();
            System.out.println("Java Game Server successfully started on http://localhost:8080");

        } catch (Exception e) {
            System.err.println("Server failed to start:");
            e.printStackTrace();
        }
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

            if (p instanceof Mage mage) {
                json.append(",\"mana\":").append(mage.getManaPool()).append(",")
                        .append("\"manaCost\":").append(mage.getManaCost()).append(",")
                        .append("\"spellPower\":").append(mage.getSpellPower()).append(",")
                        .append("\"hitCount\":").append(mage.getHitCount()).append(",")
                        .append("\"range\":").append(mage.getAbilityRange());
            } else if (p instanceof Rogue rogue) {
                json.append(",\"energyCost\":").append(rogue.getEnergyCost());
            } else if (p instanceof Warrior warrior) {
                json.append(",\"cooldown\":").append(warrior.getCooldown());
            } else if (p instanceof Hunter hunter) {
                json.append(",\"range\":").append(hunter.getRange());
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
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }
}
