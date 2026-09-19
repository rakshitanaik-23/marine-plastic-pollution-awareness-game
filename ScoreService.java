package com.oceanguardian.game.service;

import com.oceanguardian.game.model.Score;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class ScoreService {
    private final List<Score> scores = new CopyOnWriteArrayList<>();

    public ScoreService() {
        // Initial high scores
        scores.add(new Score("TurtleHero", 680, 4, "2026-09-15"));
        scores.add(new Score("CoralSaver", 520, 3, "2026-09-14"));
        scores.add(new Score("AquaGuardian", 390, 2, "2026-09-12"));
        scores.add(new Score("OceanFriend", 210, 1, "2026-09-10"));
    }

    public List<Score> getTopScores() {
        List<Score> sorted = new ArrayList<>(scores);
        sorted.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));
        if (sorted.size() > 10) {
            return sorted.subList(0, 10);
        }
        return sorted;
    }

    public void addScore(Score score) {
        if (score.getName() == null || score.getName().trim().isEmpty()) {
            score.setName("Player");
        }
        scores.add(score);
    }
}
