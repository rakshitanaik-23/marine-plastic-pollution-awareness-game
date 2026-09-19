package com.oceanguardian.game.controller;

import com.oceanguardian.game.model.Score;
import com.oceanguardian.game.service.ScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GameApiController {

    private final ScoreService scoreService;

    public GameApiController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @GetMapping("/scores")
    public List<Score> getScores() {
        return scoreService.getTopScores();
    }

    @PostMapping("/scores")
    public ResponseEntity<Map<String, Object>> saveScore(@RequestBody Score score) {
        scoreService.addScore(score);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Score registered successfully"
        ));
    }

    @GetMapping("/sdg-facts")
    public List<String> getSdgFacts() {
        return List.of(
            "Over 14 million tons of plastic end up in the ocean every year.",
            "Plastics make up 80% of all marine debris found from surface waters to deep-sea sediments.",
            "Sea turtles often mistake floating plastic bags for jellyfish.",
            "SDG 14 calls for preventing and significantly reducing marine pollution of all kinds by 2025.",
            "Microplastics have now been detected in marine food chains and deep ocean trenches."
        );
    }

    @GetMapping("/health")
    public Map<String, String> getHealth() {
        return Map.of(
            "status", "UP",
            "game", "OCEAN GUARDIAN",
            "framework", "Spring Boot"
        );
    }
}
