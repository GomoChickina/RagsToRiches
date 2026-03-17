package ragstoriches;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

public class GeminiService {
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final HttpClient client = HttpClient.newHttpClient();

    public static String callGemini(AppRouter.ExplainRequest req, String apiKey) {
        if (apiKey == null || apiKey.isEmpty())
            return "Coach is taking a nap (No API Key).";

        try {
            // 1. Use the stable Flash model
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                    + apiKey;

            // Tailor the coaching depending on whether this was the best choice or not
            String quality = req.quality == null ? "" : req.quality.trim().toLowerCase();
            String guidance;
            if ("best".equals(quality)) {
                guidance = "Explain in 2 sentences why this was a strong, financially smart choice.";
            } else {
                guidance = "Explain in 2 sentences why this choice is NOT the best option financially, " +
                        "what hidden risks or trade-offs it has, and gently hint what a better choice would do differently.";
            }

            String prompt = String.format(
                    "You are a financial coach for the game 'Rags to Riches'. Situation: %s. User chose: %s. Result: %s. %s "
                            +
                            "Use simple, friendly language (for teens) and be encouraging, not shaming.",
                    req.situationTitle, req.choiceText, req.impact, guidance);

            Map<String, Object> body = Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));
            String jsonBody = mapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());


            Map<String, Object> resMap = mapper.readValue(response.body(), Map.class);

            // 3. SAFE CHECK: Look for error messages or null candidates
            if (resMap.containsKey("error")) {
                Map error = (Map) resMap.get("error");
                return "Coach says: " + error.get("message");
            }

            List candidates = (List) resMap.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "Coach is speechless. Check your API key and billing status.";
            }

            // Navigate the JSON safely
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);

            return (String) firstPart.get("text");

        } catch (Exception e) {
            return "Coach got lost in the data: " + e.getMessage();
        }
    }
};