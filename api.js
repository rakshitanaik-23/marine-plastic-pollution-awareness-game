/**
 * Ocean Guardian - API & Storage Client
 * Connects to Java Spring Boot / Java REST backend with seamless fallback to localStorage.
 */

class ApiService {
    constructor() {
        this.apiBase = window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:8080';
        this.backendAvailable = false;
        this.checkBackend();
    }

    async checkBackend() {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 1200);
            const res = await fetch(`${this.apiBase}/api/scores`, { signal: controller.signal });
            clearTimeout(id);
            if (res.ok) {
                this.backendAvailable = true;
                console.log("Connected to Java Ocean Guardian Backend!");
            }
        } catch (e) {
            this.backendAvailable = false;
            console.log("Using LocalStorage fallback mode (Standalone Browser)");
        }
    }

    getFallbackScores() {
        const stored = localStorage.getItem('ocean_guardian_high_scores');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {}
        }
        // Default initial leaderboard
        const defaults = [
            { name: "TurtleHero", score: 680, level: 4, date: "2026-09-15" },
            { name: "CoralSaver", score: 520, level: 3, date: "2026-09-14" },
            { name: "AquaGuardian", score: 390, level: 2, date: "2026-09-12" },
            { name: "OceanFriend", score: 210, level: 1, date: "2026-09-10" }
        ];
        localStorage.setItem('ocean_guardian_high_scores', JSON.stringify(defaults));
        return defaults;
    }

    async getScores() {
        if (this.backendAvailable) {
            try {
                const res = await fetch(`${this.apiBase}/api/scores`);
                if (res.ok) {
                    const data = await res.json();
                    return data;
                }
            } catch (e) {
                this.backendAvailable = false;
            }
        }
        return this.getFallbackScores();
    }

    async getHighestScore() {
        const scores = await this.getScores();
        if (!scores || scores.length === 0) return 0;
        return Math.max(...scores.map(s => s.score));
    }

    async saveScore(name, score, level) {
        const newEntry = {
            name: name || "Player",
            score: score,
            level: level,
            date: new Date().toISOString().split('T')[0]
        };

        // Always save to localStorage as cache
        const local = this.getFallbackScores();
        local.push(newEntry);
        local.sort((a, b) => b.score - a.score);
        const top10 = local.slice(0, 10);
        localStorage.setItem('ocean_guardian_high_scores', JSON.stringify(top10));

        // Try backend if available
        if (this.backendAvailable) {
            try {
                await fetch(`${this.apiBase}/api/scores`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newEntry)
                });
            } catch (e) {
                console.warn("Failed to push score to backend, kept in localStorage:", e);
            }
        }

        return top10;
    }

    getSdgFacts() {
        return [
            "Every year, 8 to 14 million tonnes of plastic leak into the oceans.",
            "Sea turtles often mistake floating plastic bags for their favorite food: jellyfish.",
            "Over 1 million marine seabirds and 100,000 marine mammals are killed annually by ocean plastic.",
            "Microplastics have now been found in the deepest ocean trenches and in polar ice.",
            "By 2050, plastic in the ocean could outweigh all the fish combined unless we take urgent action.",
            "SDG 14 calls for preventing and significantly reducing marine pollution of all kinds by 2025.",
            "Recycling just one plastic bottle saves enough energy to power a 60W lightbulb for 6 hours."
        ];
    }
}

window.apiService = new ApiService();
