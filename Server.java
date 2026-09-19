import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Ocean Guardian - Zero-Dependency Java HTTP Server & REST API
 * Runs out of the box with standard Java 11+ (`java Server.java`).
 * Serves web assets and provides High Score & SDG Facts REST APIs.
 */
public class Server {

    private static final int PORT = 8080;
    private static final List<ScoreEntry> SCORES = new CopyOnWriteArrayList<>();
    private static Path STATIC_ROOT;

    public static class ScoreEntry {
        public String name;
        public int score;
        public int level;
        public String date;

        public ScoreEntry(String name, int score, int level, String date) {
            this.name = name;
            this.score = score;
            this.level = level;
            this.date = date;
        }

        public String toJson() {
            return String.format(
                "{\"name\":\"%s\",\"score\":%d,\"level\":%d,\"date\":\"%s\"}",
                escape(name), score, level, date
            );
        }

        private static String escape(String s) {
            return s.replace("\"", "\\\"");
        }
    }

    public static void main(String[] args) throws IOException {
        // Initialize default leaderboard
        SCORES.add(new ScoreEntry("TurtleHero", 680, 4, "2026-09-15"));
        SCORES.add(new ScoreEntry("CoralSaver", 520, 3, "2026-09-14"));
        SCORES.add(new ScoreEntry("AquaGuardian", 390, 2, "2026-09-12"));
        SCORES.add(new ScoreEntry("OceanFriend", 210, 1, "2026-09-10"));

        // Determine static files root (D:\microohackathon or relative)
        Path currentDir = Paths.get(".").toAbsolutePath().normalize();
        if (Files.exists(currentDir.resolve("index.html"))) {
            STATIC_ROOT = currentDir;
        } else if (Files.exists(currentDir.resolve("..").resolve("index.html"))) {
            STATIC_ROOT = currentDir.resolve("..").normalize();
        } else {
            STATIC_ROOT = Paths.get("D:/microohackathon");
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // API Endpoints
        server.createContext("/api/scores", new ScoresHandler());
        server.createContext("/api/sdg-facts", new SdgFactsHandler());
        server.createContext("/api/health", new HealthHandler());

        // Static File Handler
        server.createContext("/", new StaticFileHandler());

        server.setExecutor(null); // Default single-thread or pooled
        System.out.println("==================================================");
        System.out.println(" 🐢 OCEAN GUARDIAN - Java Game Backend Server");
        System.out.println("==================================================");
        System.out.println(" Server running at: http://localhost:" + PORT);
        System.out.println(" Static files root: " + STATIC_ROOT);
        System.out.println(" Endpoints:");
        System.out.println("   - GET  /api/scores");
        System.out.println("   - POST /api/scores");
        System.out.println("   - GET  /api/sdg-facts");
        System.out.println("   - GET  /api/health");
        System.out.println(" Press Ctrl+C to stop.");
        System.out.println("==================================================");

        server.start();
    }

    private static void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    // Health Handler
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String response = "{\"status\":\"UP\",\"game\":\"OCEAN GUARDIAN\",\"version\":\"1.0.0\"}";
            byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }

    // High Score REST API
    static class ScoresHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            String method = exchange.getRequestMethod();

            if ("OPTIONS".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equalsIgnoreCase(method)) {
                // Return top 10 scores
                List<ScoreEntry> sorted = new ArrayList<>(SCORES);
                sorted.sort((a, b) -> Integer.compare(b.score, a.score));
                if (sorted.size() > 10) sorted = sorted.subList(0, 10);

                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < sorted.size(); i++) {
                    json.append(sorted.get(i).toJson());
                    if (i < sorted.size() - 1) json.append(",");
                }
                json.append("]");

                byte[] bytes = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                // Parse simple JSON {name, score, level}
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                String name = extractJsonString(body, "name", "Player");
                int score = extractJsonInt(body, "score", 0);
                int level = extractJsonInt(body, "level", 1);
                String date = LocalDate.now().toString();

                SCORES.add(new ScoreEntry(name, score, level, date));
                System.out.println("💾 Saved new high score: " + name + " -> " + score + " pts (Level " + level + ")");

                String response = "{\"success\":true,\"message\":\"Score saved successfully\"}";
                byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(201, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }

        private String extractJsonString(String json, String key, String def) {
            String pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]+)\"";
            java.util.regex.Matcher m = java.util.regex.Pattern.compile(pattern).matcher(json);
            if (m.find()) return m.group(1);
            return def;
        }

        private int extractJsonInt(String json, String key, int def) {
            String pattern = "\"" + key + "\"\\s*:\\s*([0-9]+)";
            java.util.regex.Matcher m = java.util.regex.Pattern.compile(pattern).matcher(json);
            if (m.find()) {
                try {
                    return Integer.parseInt(m.group(1));
                } catch (NumberFormatException ignored) {}
            }
            return def;
        }
    }

    // SDG Facts API
    static class SdgFactsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            String[] facts = {
                "Over 14 million tons of plastic end up in the ocean every year.",
                "Plastics make up 80% of all marine debris found in surface waters.",
                "Sea turtles frequently mistake floating plastic bags for jellyfish.",
                "SDG 14 aims to prevent and significantly reduce marine pollution of all kinds by 2025.",
                "Microplastics have now been detected in marine food chains and deep ocean trenches."
            };
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < facts.length; i++) {
                sb.append("\"").append(facts[i].replace("\"", "\\\"")).append("\"");
                if (i < facts.length - 1) sb.append(",");
            }
            sb.append("]");

            byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }

    // Static Web Asset Handler
    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String pathStr = exchange.getRequestURI().getPath();
            if (pathStr.equals("/") || pathStr.isEmpty()) {
                pathStr = "/index.html";
            }

            Path filePath = STATIC_ROOT.resolve(pathStr.substring(1)).normalize();

            // Prevent directory traversal
            if (!filePath.startsWith(STATIC_ROOT) || !Files.exists(filePath) || Files.isDirectory(filePath)) {
                String notFound = "<h1>404 Not Found</h1>";
                exchange.sendResponseHeaders(404, notFound.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(notFound.getBytes(StandardCharsets.UTF_8));
                }
                return;
            }

            String contentType = getContentType(filePath.toString());
            byte[] fileBytes = Files.readAllBytes(filePath);

            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, fileBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(fileBytes);
            }
        }

        private String getContentType(String path) {
            if (path.endsWith(".html")) return "text/html; charset=UTF-8";
            if (path.endsWith(".css")) return "text/css; charset=UTF-8";
            if (path.endsWith(".js")) return "application/javascript; charset=UTF-8";
            if (path.endsWith(".json")) return "application/json";
            if (path.endsWith(".png")) return "image/png";
            if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
            if (path.endsWith(".svg")) return "image/svg+xml";
            return "application/octet-stream";
        }
    }
}
