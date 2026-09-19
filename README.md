# OCEAN GUARDIAN 🐢🌊

### *“Save the Ocean, One Turtle at a Time.”*

---

## 🌍 UN Sustainable Development Goal: SDG 14 – Life Below Water
**Theme:** Marine Plastic Pollution Awareness Game

### ⚠️ Problem
Every year, between **8 to 14 million tonnes of plastic** leak into our oceans, constituting over **80% of all marine debris**. Sea turtles, dolphins, seabirds, and whales mistake floating plastic bags for jellyfish, and become entangled in six-pack beverage rings and abandoned fishing gear. Furthermore, industrial toxic waste and heavy chemical runoff create dead zones and bioaccumulate across marine food webs.

### 💡 Solution
**OCEAN GUARDIAN** is an engaging, fast-paced educational 2D browser arcade game where players control an endangered sea turtle swimming through increasingly polluted ocean waters. The game transforms abstract environmental statistics into an intuitive, visceral gameplay experience where players learn to identify distinct plastic hazards while discovering actionable conservation solutions.

### 🌱 Impact
Through interactive gameplay, players develop heightened awareness of plastic pollution lifespans (e.g. bottles lasting 450+ years), hazardous industrial dumping, and the tangible impact of daily single-use plastic reduction.

---

## ⏱️ 5-Level Progressive Gameplay System

The complete game features **5 progressive levels** lasting **60 seconds each** (total maximum gameplay: **5 minutes**):

| Level | Name | Score Range | Difficulty | Key Hazards & Features | Awareness Message |
|---|---|---|---|---|---|
| **Level 1** | **Clean Waters** 🟢 | 0–100 pts | Easy | Clean bright blue ocean, slow plastic bottles, plentiful healthy food, control tutorial. | *“Use arrow keys to swim!”* |
| **Level 2** | **Rising Pollution** 🔵 | 101–250 pts | Medium | Plastic bottles & shopping bags, faster obstacle drift, slightly murky ocean. | *“Plastic waste can harm marine animals.”* |
| **Level 3** | **Plastic Storm** 🟠 | 251–450 pts | Hard | Plastic wrappers, soda cans, 6-pack rings, surging plastic debris waves. | *“The ocean is getting more polluted!”* |
| **Level 4** | **Toxic Ocean** 🔴 | 451–700 pts | Very Hard | **Toxic Waste Barrels (-2 ❤️)** introduced with glowing radioactive halo, dark sludge waters. | *“Toxic waste harms marine life!”* |
| **Level 5** | **Ocean Guardian** 🟣 | 701+ pts | Extreme | Maximum obstacle density, high speeds, scarce food, combined hazards, final survival. | *“Survive the final challenge to become the Ocean Guardian!”* |

### Level Duration & Completion Rules
- **60-Second Countdown Timer:** Formatted as `01:00 → 00:00` clearly displayed in the HUD.
- **3-Second Pre-Level Countdown:** Animated `3 → 2 → 1 → GO!` sequence with synchronized audio beeps before every level.
- **Dual Completion Conditions:**
  1. **Score Threshold:** Reaching the level's score target early triggers an immediate **“LEVEL COMPLETE! 🌊”** transition to the next level.
  2. **Time Survival:** Surviving the full 60 seconds with health > 0 advances the player to the next level.
- **Score Accumulation:** Score accumulates continuously across all 5 levels.
- **Victory Condition:** Surviving or mastering Level 5 awards the player the **Ocean Guardian** title and trophy screen.

---

## 🎮 Game Mechanics & HUD

- **Player:** Sea Turtle 🐢 with procedural vector flipper animation and hydrodynamic tilting.
- **Controls:**
  - ⬆️ / `W`: Swim Up
  - ⬇️ / `S`: Swim Down
  - ⬅️ / `A`: Swim Left
  - ➡️ / `D`: Swim Right
  - `ESC` / `P`: Pause / Resume
  - **On-screen D-Pad** provided for touchscreen / laptop trackpad users.
- **Healthy Food (+10 pts):**
  - Shimmering Jellyfish 🎐, Coral Fish 🐟, and Kelp Seaweed Pods 🌿.
  - Floating `+10` text, sparkle particle burst, and melodic chime audio.
- **Plastic Hazards (-1 Health):**
  - Single-use water bottles, shopping bags, snack wrappers, aluminum cans, and 6-pack rings.
  - Screen shake, red damage flash, impact debris, and 1.4-second invulnerability blinking.
- **Toxic Waste (-2 Health):**
  - Industrial radioactive waste barrels leaking toxic green sludge with glowing aura.
  - Sizzling hazard alarm sound and high-impact screen shake.
- **Health System:** Start with 3 hearts (`❤️❤️❤️`). Reaching 0 triggers Game Over.
- **HUD Interface:**
  ```text
  🐢 OCEAN GUARDIAN
  ❤️❤️❤️     SCORE: 120     LEVEL: 2     ⏱️ 00:42     HI: 680
  ```

---

## 🎨 Dynamic Visual Progression

As levels advance, the underwater environment transforms dynamically:
1. **Level 1:** Crystal-clear turquoise water with bright sunlight shafts and vibrant blooming corals.
2. **Level 2:** Slightly desaturated teal waters with floating dust particles.
3. **Level 3:** Murky grayish-green plastic storm with swaying bleached seaweed.
4. **Level 4:** Dark toxic violet sludge with dead reefs, eerie green toxic glow, and zero sunlight.
5. **Level 5:** Apocalyptic deep ocean pollution with intense hazard densities.

---

## 🔊 Procedural Web Audio Engine (0 Dependencies)

The game utilizes the native HTML5 **Web Audio API** (`js/audio.js`) to procedurally synthesize all audio effects without requiring any external mp3/wav files:
- Melodic 4-note ascending chord on food pickup
- Low resonant thud & plastic fracture noise on collision
- Sizzling dual-sawtooth dissonance on toxic waste hit
- 3-2-1 countdown pips and high major chord on "GO!"
- Level complete arpeggio
- Melancholic descending melody on game over
- Grand Ocean Guardian victory fanfare

---

## 🚀 How to Run the Project

### Option 1: Instant Standalone Browser (Zero Setup)
1. Double-click or open `D:\microohackathon\index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox).
2. All audio, visuals, and high scores (via browser `localStorage`) work 100% offline out-of-the-box.

### Option 2: Java Backend Server (Included)
The project includes a lightweight, zero-dependency Java server (`backend/Server.java`) utilizing standard Java standard library `com.sun.net.httpserver.HttpServer`:
1. Double-click `run_server.bat` **OR** open a terminal in `D:\microohackathon` and run:
   ```bash
   cd backend
   java Server.java
   ```
2. Open your browser to:
   ```
   http://localhost:8080
   ```
3. The server serves all game assets and exposes REST API endpoints:
   - `GET /api/scores` – Returns top high scores
   - `POST /api/scores` – Saves player scores
   - `GET /api/sdg-facts` – Returns marine conservation facts
   - `GET /api/health` – Returns server health status

### Option 3: Spring Boot (For Java/Maven Hackathon Evaluation)
A full Spring Boot configuration (`pom.xml` and source files) is provided in `backend/`:
```bash
cd backend
mvn spring-boot:run
```

---

## 📂 Project Structure

```
D:\microohackathon\
├── index.html              # Modern UI layout, HUD, start screen, modals, canvas
├── run_server.bat          # 1-Click Windows launcher for the Java backend
├── README.md               # Project documentation & SDG 14 overview
├── css\
│   └── style.css           # Modern ocean glassmorphism, responsive 16:9 layout
├── js\
│   ├── audio.js            # Web Audio API procedural sound engine
│   ├── sprites.js          # Procedural vector drawing for turtle, hazards, food, corals
│   ├── particles.js        # Particle systems (bubbles, sparkles, toxic drips, screen shake)
│   ├── levels.js           # 5-level configurations, thresholds, and environmental palettes
│   ├── api.js              # Dual-mode REST API & localStorage client
│   └── game.js             # Core game loop, state machine, collision detection, physics
└── backend\
    ├── Server.java         # Zero-dependency Java HTTP Server & REST API
    ├── pom.xml             # Spring Boot Maven configuration
    └── src\main\java\com\oceanguardian\game\
        ├── OceanGuardianApplication.java
        ├── controller\GameApiController.java
        ├── service\ScoreService.java
        └── model\Score.java
```
