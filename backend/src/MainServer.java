
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import game.Game;
import game.MessageCallback;
import game.occupant.unit.player.Player;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.List;

public class MainServer {

    private static Game game;

    public static void main(String[] args) throws IOException {
        MessageCallback callback = msg -> System.out.println("[GAME LOG]: " + msg);
        game = new Game(callback);

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/board", exchange -> {
            addCorsHeaders(exchange);
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

        server.createContext("/api/players", exchange -> {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, getPlayersJson());
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

        server.start();
        System.out.println("Java Game Server running on http://localhost:8080");
    }

    private static String getPlayersJson() {
        List<Player> players = game.getAvailablePlayers();
        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < players.size(); i++) {
            Player p = players.get(i);
            json.append("{")
                    .append("\"index\":").append(i).append(",")
                    .append("\"name\":\"").append(p.getName()).append("\"")
                    .append("}");

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
