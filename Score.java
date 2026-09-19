package com.oceanguardian.game.model;

import java.time.LocalDate;

public class Score {
    private String name;
    private int score;
    private int level;
    private String date;

    public Score() {
        this.date = LocalDate.now().toString();
    }

    public Score(String name, int score, int level) {
        this.name = name;
        this.score = score;
        this.level = level;
        this.date = LocalDate.now().toString();
    }

    public Score(String name, int score, int level, String date) {
        this.name = name;
        this.score = score;
        this.level = level;
        this.date = date;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
