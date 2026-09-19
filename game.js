/**
 * Ocean Guardian - Core Game Engine & State Machine
 * Orchestrates rendering, physics, collisions, level transitions, timers, and HUD updates.
 */

class OceanGuardianGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Fixed internal virtual resolution (16:9 ratio)
        this.width = 1280;
        this.height = 720;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.particles = new ParticleSystem();
        this.sound = window.soundEngine;
        this.api = window.apiService;

        // Game State
        this.state = 'START_MENU'; // START_MENU, COUNTDOWN, PLAYING, LEVEL_COMPLETE, GAME_OVER, VICTORY, PAUSED
        this.currentLevelIndex = 0; // 0 to 4 (Level 1 to 5)
        this.score = 0;
        this.highScore = 0;
        this.health = 3;
        this.maxHealth = 3;
        this.levelTimer = 60.0;
        this.totalTimeElapsed = 0.0;

        // Countdown State
        this.countdownValue = 3;
        this.countdownTimer = 0.0;

        // Transition timer
        this.transitionTimer = 0.0;

        // Player Turtle
        this.player = {
            x: 180,
            y: 360,
            vx: 0,
            vy: 0,
            speed: 5.5,
            size: 60,
            radius: 24, // Collision radius
            tilt: 0,
            invulnerableTimer: 0.0,
            bubbleTimer: 0.0
        };

        // Entities
        this.foodItems = [];
        this.obstacles = [];

        // Spawn Timers
        this.foodSpawnTimer = 0.0;
        this.obstacleSpawnTimer = 0.0;
        this.waveTimer = 0.0;

        // Input
        this.keys = {};
        this.virtualKeys = { up: false, down: false, left: false, right: false };

        // Timing & Animation
        this.lastTime = performance.now();
        this.animTime = 0.0;

        // Damage flash
        this.damageFlash = 0.0;
        this.damageType = 'plastic'; // 'plastic' or 'toxic'

        this.init();
    }

    async init() {
        this.setupInput();
        this.setupUIEvents();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.highScore = await this.api.getHighestScore();
        this.updateHUD();

        // Start requestAnimationFrame loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    // Responsive Canvas scaling with aspect ratio preservation
    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const targetAspect = 16 / 9;
        let w = containerWidth;
        let h = containerWidth / targetAspect;

        if (h > containerHeight) {
            h = containerHeight;
            w = containerHeight * targetAspect;
        }

        this.canvas.style.width = `${Math.floor(w)}px`;
        this.canvas.style.height = `${Math.floor(h)}px`;
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
            this.sound.resume();

            if (e.code === 'Escape' || e.code === 'KeyP') {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Touch & on-screen D-pad controls
        const bindBtn = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;
            const start = (e) => { e.preventDefault(); this.virtualKeys[key] = true; this.sound.resume(); };
            const end = (e) => { e.preventDefault(); this.virtualKeys[key] = false; };
            el.addEventListener('mousedown', start);
            el.addEventListener('mouseup', end);
            el.addEventListener('touchstart', start, { passive: false });
            el.addEventListener('touchend', end, { passive: false });
        };

        bindBtn('btnUp', 'up');
        bindBtn('btnDown', 'down');
        bindBtn('btnLeft', 'left');
        bindBtn('btnRight', 'right');
    }

    setupUIEvents() {
        // Start Game
        document.getElementById('btnStartGame').addEventListener('click', () => {
            this.sound.resume();
            this.startNewGame();
        });

        // How to Play Modal
        document.getElementById('btnHowToPlay').addEventListener('click', () => {
            this.openModal('howToPlayModal');
        });

        // SDG 14 Modal
        document.getElementById('btnSdg14').addEventListener('click', () => {
            this.openModal('sdg14Modal');
        });

        // High Scores Modal
        document.getElementById('btnHighScore').addEventListener('click', async () => {
            await this.renderLeaderboard();
            this.openModal('highScoreModal');
        });

        // Close buttons for modals
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.getAttribute('data-close');
                if (target) document.getElementById(target).classList.add('hidden');
            });
        });

        // Restart buttons
        document.getElementById('btnRestartGame').addEventListener('click', () => {
            document.getElementById('gameOverOverlay').classList.add('hidden');
            this.startNewGame();
        });

        document.getElementById('btnPlayAgain').addEventListener('click', () => {
            document.getElementById('victoryOverlay').classList.add('hidden');
            this.startNewGame();
        });

        // Menu buttons
        document.getElementById('btnMainMenu').addEventListener('click', () => {
            document.getElementById('gameOverOverlay').classList.add('hidden');
            this.returnToMainMenu();
        });

        document.getElementById('btnVictoryMenu').addEventListener('click', () => {
            document.getElementById('victoryOverlay').classList.add('hidden');
            this.returnToMainMenu();
        });

        // Audio Mute toggle
        document.getElementById('btnAudioToggle').addEventListener('click', () => {
            const isMuted = this.sound.toggleMute();
            document.getElementById('btnAudioToggle').innerHTML = isMuted ? '🔇' : '🔊';
        });

        // Pause / Resume
        document.getElementById('btnPause').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('btnResumeGame').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('btnPauseRestart').addEventListener('click', () => {
            document.getElementById('pauseOverlay').classList.add('hidden');
            this.startNewGame();
        });

        document.getElementById('btnPauseMenu').addEventListener('click', () => {
            document.getElementById('pauseOverlay').classList.add('hidden');
            this.returnToMainMenu();
        });
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    async renderLeaderboard() {
        const scores = await this.api.getScores();
        const list = document.getElementById('leaderboardList');
        if (!list) return;
        list.innerHTML = scores.map((s, idx) => `
            <div class="leaderboard-row">
                <span class="rank">#${idx + 1}</span>
                <span class="name">${s.name}</span>
                <span class="level-tag">Lvl ${s.level}</span>
                <span class="score-val">${s.score} pts</span>
            </div>
        `).join('');
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            document.getElementById('pauseOverlay').classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.lastTime = performance.now();
            document.getElementById('pauseOverlay').classList.add('hidden');
        }
    }

    returnToMainMenu() {
        this.state = 'START_MENU';
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('levelCountdownOverlay').classList.add('hidden');
        document.getElementById('levelCompleteBanner').classList.add('hidden');
        this.resetGameData();
    }

    resetGameData() {
        this.currentLevelIndex = 0;
        this.score = 0;
        this.health = 3;
        this.levelTimer = 60.0;
        this.totalTimeElapsed = 0.0;
        this.foodItems = [];
        this.obstacles = [];
        this.player.x = 180;
        this.player.y = 360;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.tilt = 0;
        this.player.invulnerableTimer = 0.0;
    }

    startNewGame() {
        this.resetGameData();
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');
        this.startLevelCountdown(0);
    }

    startLevelCountdown(levelIdx) {
        this.currentLevelIndex = levelIdx;
        this.state = 'COUNTDOWN';
        this.levelTimer = 60.0;
        this.countdownValue = 3;
        this.countdownTimer = 1.0; // 1 second per step

        const cfg = LEVELS_CONFIG[this.currentLevelIndex];

        // Setup Countdown Overlay
        const overlay = document.getElementById('levelCountdownOverlay');
        const numEl = document.getElementById('countdownNumber');
        const titleEl = document.getElementById('countdownLevelTitle');
        const diffEl = document.getElementById('countdownDifficulty');
        const awarenessEl = document.getElementById('countdownAwareness');

        titleEl.textContent = `LEVEL ${cfg.id}: ${cfg.title}`;
        diffEl.textContent = `Difficulty: ${cfg.badge} | Goal: ${cfg.targetScore} pts or 60s`;
        diffEl.style.color = cfg.badgeColor;
        awarenessEl.textContent = `“${cfg.message}”`;
        numEl.textContent = '3';
        numEl.className = 'countdown-num pulse';

        overlay.classList.remove('hidden');
        this.sound.playCountdown(false);
        this.updateHUD();
    }

    updateCountdown(dt) {
        this.countdownTimer -= dt;
        if (this.countdownTimer <= 0) {
            this.countdownValue--;
            this.countdownTimer = 1.0;

            const numEl = document.getElementById('countdownNumber');

            if (this.countdownValue === 2) {
                numEl.textContent = '2';
                this.sound.playCountdown(false);
            } else if (this.countdownValue === 1) {
                numEl.textContent = '1';
                this.sound.playCountdown(false);
            } else if (this.countdownValue === 0) {
                numEl.textContent = 'GO! 🌊';
                numEl.classList.add('go');
                this.sound.playCountdown(true);
            } else {
                // Countdown complete -> enter PLAYING state
                document.getElementById('levelCountdownOverlay').classList.add('hidden');
                this.state = 'PLAYING';
                this.foodSpawnTimer = 0;
                this.obstacleSpawnTimer = 0;
                this.lastTime = performance.now();
            }
        }
    }

    // Complete level and transition to next
    completeLevel() {
        this.sound.playLevelComplete();
        this.state = 'LEVEL_COMPLETE';
        this.transitionTimer = 1.8; // 1.8 second transition banner

        const banner = document.getElementById('levelCompleteBanner');
        banner.classList.remove('hidden');

        // Spawn celebratory sparkle burst
        for (let i = 0; i < 40; i++) {
            this.particles.addEatEffect(
                this.width * 0.3 + Math.random() * (this.width * 0.4),
                this.height * 0.3 + Math.random() * (this.height * 0.4)
            );
        }
    }

    // Advance to next level or trigger victory
    advanceToNextLevel() {
        document.getElementById('levelCompleteBanner').classList.add('hidden');

        if (this.currentLevelIndex < LEVELS_CONFIG.length - 1) {
            this.startLevelCountdown(this.currentLevelIndex + 1);
        } else {
            // Level 5 completed -> OCEAN GUARDIAN VICTORY!
            this.triggerVictory();
        }
    }

    triggerVictory() {
        this.state = 'VICTORY';
        this.sound.playVictory();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.api.saveScore("OceanGuardian", this.score, 5);
        }

        const overlay = document.getElementById('victoryOverlay');
        document.getElementById('victoryFinalScore').textContent = this.score;
        document.getElementById('victoryHighScore').textContent = this.highScore;

        const minutes = Math.floor(this.totalTimeElapsed / 60);
        const seconds = Math.floor(this.totalTimeElapsed % 60);
        document.getElementById('victoryTimeSurvived').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        overlay.classList.remove('hidden');
    }

    triggerGameOver() {
        this.state = 'GAME_OVER';
        this.sound.playGameOver();

        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.api.saveScore("Player", this.score, this.currentLevelIndex + 1);

        const overlay = document.getElementById('gameOverOverlay');
        document.getElementById('gameOverFinalScore').textContent = this.score;
        document.getElementById('gameOverLevel').textContent = `${this.currentLevelIndex + 1} (${LEVELS_CONFIG[this.currentLevelIndex].title})`;
        document.getElementById('gameOverHighScore').textContent = this.highScore;

        const currentConfig = LEVELS_CONFIG[this.currentLevelIndex];
        document.getElementById('gameOverFact').textContent = currentConfig.awareness;

        overlay.classList.remove('hidden');
    }

    // Main Game Loop
    gameLoop(timestamp) {
        const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;
        this.animTime += deltaTime;

        // Ambient bubbles continuously generate
        if (Math.random() < 0.18) {
            this.particles.addAmbientBubble(this.width, this.height, this.currentLevelIndex + 1);
        }

        // Damage flash decay
        if (this.damageFlash > 0) {
            this.damageFlash -= deltaTime * 3;
            if (this.damageFlash < 0) this.damageFlash = 0;
        }

        // Update state
        switch (this.state) {
            case 'START_MENU':
                // Menu background idle animations
                this.particles.update(deltaTime, this.width, this.height);
                break;

            case 'COUNTDOWN':
                this.updateCountdown(deltaTime);
                this.updatePlayerMovement(deltaTime);
                this.particles.update(deltaTime, this.width, this.height);
                break;

            case 'PLAYING':
                this.updatePlaying(deltaTime);
                this.particles.update(deltaTime, this.width, this.height);
                break;

            case 'LEVEL_COMPLETE':
                this.transitionTimer -= deltaTime;
                this.updatePlayerMovement(deltaTime);
                this.particles.update(deltaTime, this.width, this.height);
                if (this.transitionTimer <= 0) {
                    this.advanceToNextLevel();
                }
                break;

            case 'GAME_OVER':
            case 'VICTORY':
            case 'PAUSED':
                // Idle particles
                this.particles.update(deltaTime, this.width, this.height);
                break;
        }

        // Render everything
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    updatePlaying(dt) {
        const cfg = LEVELS_CONFIG[this.currentLevelIndex];

        // 1. Timer Countdown
        this.levelTimer -= dt;
        this.totalTimeElapsed += dt;

        // Check if 60-second level timer reached zero
        if (this.levelTimer <= 0) {
            this.levelTimer = 0;
            if (this.health > 0) {
                // Survived the full 60 seconds!
                this.completeLevel();
                return;
            } else {
                this.triggerGameOver();
                return;
            }
        }

        // Check if early score threshold reached
        if (this.score >= cfg.targetScore) {
            this.completeLevel();
            return;
        }

        // 2. Player Invulnerability timer
        if (this.player.invulnerableTimer > 0) {
            this.player.invulnerableTimer -= dt;
        }

        // 3. Player Movement
        this.updatePlayerMovement(dt);

        // 4. Spawning Food & Obstacles
        this.foodSpawnTimer += dt;
        if (this.foodSpawnTimer >= cfg.foodSpawnInterval) {
            this.foodSpawnTimer = 0;
            this.spawnFood();
        }

        this.obstacleSpawnTimer += dt;
        if (this.obstacleSpawnTimer >= cfg.plasticSpawnInterval) {
            this.obstacleSpawnTimer = 0;
            this.spawnObstacle(cfg);
        }

        // Level 3 Plastic Wave Surges
        if (cfg.id >= 3) {
            this.waveTimer += dt;
            if (this.waveTimer > 12.0) {
                this.waveTimer = 0;
                this.spawnPlasticWave(cfg);
            }
        }

        // 5. Update Food items
        for (let i = this.foodItems.length - 1; i >= 0; i--) {
            const f = this.foodItems[i];
            f.x += f.vx;
            f.y += Math.sin(this.animTime * 3 + f.seed) * 0.8;

            // Collision with Player
            const dist = Math.hypot(f.x - this.player.x, f.y - this.player.y);
            if (dist < this.player.radius + f.radius) {
                // Collect food!
                this.score += 10;
                this.sound.playEat();
                this.particles.addEatEffect(f.x, f.y);
                this.foodItems.splice(i, 1);
                this.updateHUD();

                // Check early score threshold immediate trigger
                if (this.score >= cfg.targetScore) {
                    this.completeLevel();
                    return;
                }
                continue;
            }

            // Despawn off-screen left
            if (f.x < -40) {
                this.foodItems.splice(i, 1);
            }
        }

        // 6. Update Obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x += obs.vx;
            obs.rotation += obs.vRot;

            // Check collision with Player
            const dist = Math.hypot(obs.x - this.player.x, obs.y - this.player.y);
            if (dist < this.player.radius + obs.radius) {
                if (this.player.invulnerableTimer <= 0) {
                    // Impact!
                    if (obs.isToxic) {
                        this.health = Math.max(0, this.health - 2);
                        this.damageType = 'toxic';
                        this.damageFlash = 1.0;
                        this.sound.playToxicDamage();
                        this.particles.shake(18);
                        this.particles.addToxicBurst(obs.x, obs.y);
                    } else {
                        this.health = Math.max(0, this.health - 1);
                        this.damageType = 'plastic';
                        this.damageFlash = 0.8;
                        this.sound.playDamage();
                        this.particles.shake(12);
                        this.particles.addPlasticImpact(obs.x, obs.y);
                    }

                    this.player.invulnerableTimer = 1.4; // 1.4s invulnerability blink
                    this.updateHUD();

                    if (this.health <= 0) {
                        this.triggerGameOver();
                        return;
                    }
                }
            }

            // Despawn off-screen left
            if (obs.x < -60) {
                this.obstacles.splice(i, 1);
            }
        }

        this.updateHUD();
    }

    updatePlayerMovement(dt) {
        const p = this.player;

        // Input vectors
        let dx = 0;
        let dy = 0;

        if (this.keys['ArrowUp'] || this.keys['KeyW'] || this.virtualKeys.up) dy -= 1;
        if (this.keys['ArrowDown'] || this.keys['KeyS'] || this.virtualKeys.down) dy += 1;
        if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.virtualKeys.left) dx -= 1;
        if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.virtualKeys.right) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const len = Math.SQRT2;
            dx /= len;
            dy /= len;
        }

        // Apply acceleration & damping
        const targetVx = dx * p.speed * 60;
        const targetVy = dy * p.speed * 60;

        p.vx += (targetVx - p.vx) * 0.15;
        p.vy += (targetVy - p.vy) * 0.15;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Clamp to screen bounds
        p.x = Math.max(p.size * 0.6, Math.min(this.width - p.size * 0.6, p.x));
        p.y = Math.max(p.size * 0.6 + 60, Math.min(this.height - p.size * 0.8, p.y));

        // Tilt angle based on vertical movement
        const targetTilt = (p.vy / (p.speed * 60)) * 0.35;
        p.tilt += (targetTilt - p.tilt) * 0.2;

        // Swim sound & bubble trail when moving
        if (Math.abs(p.vx) > 10 || Math.abs(p.vy) > 10) {
            p.bubbleTimer += dt;
            if (p.bubbleTimer > 0.08) {
                p.bubbleTimer = 0;
                this.particles.addTurtleBubble(p.x, p.y);
            }
        }
    }

    spawnFood() {
        const types = ['jellyfish', 'fish', 'seaweed'];
        const type = types[Math.floor(Math.random() * types.length)];
        const y = 80 + Math.random() * (this.height - 180);
        const speed = -(2.0 + Math.random() * 1.5);

        this.foodItems.push({
            type,
            x: this.width + 30,
            y,
            vx: speed,
            size: 38,
            radius: 18,
            seed: Math.random() * 10
        });
    }

    spawnObstacle(cfg) {
        const isToxic = Math.random() < cfg.toxicSpawnChance;
        const y = 80 + Math.random() * (this.height - 160);
        const baseSpeed = cfg.plasticSpeed.min + Math.random() * (cfg.plasticSpeed.max - cfg.plasticSpeed.min);
        const speed = -baseSpeed;

        if (isToxic) {
            this.obstacles.push({
                isToxic: true,
                type: 'toxic_barrel',
                x: this.width + 45,
                y,
                vx: speed * 1.05,
                vRot: (Math.random() - 0.5) * 0.03,
                rotation: Math.random() * Math.PI,
                size: 52,
                radius: 24
            });
        } else {
            const types = cfg.allowedPlasticTypes;
            const type = types[Math.floor(Math.random() * types.length)];
            this.obstacles.push({
                isToxic: false,
                type,
                x: this.width + 35,
                y,
                vx: speed,
                vRot: (Math.random() - 0.5) * 0.04,
                rotation: Math.random() * Math.PI,
                size: 42,
                radius: 19
            });
        }
    }

    spawnPlasticWave(cfg) {
        const count = 3;
        for (let i = 0; i < count; i++) {
            const y = 90 + (i * (this.height - 200)) / (count - 1) + (Math.random() - 0.5) * 30;
            const speed = -(cfg.plasticSpeed.max + 0.8);
            this.obstacles.push({
                isToxic: false,
                type: cfg.allowedPlasticTypes[Math.floor(Math.random() * cfg.allowedPlasticTypes.length)],
                x: this.width + 40 + i * 45,
                y,
                vx: speed,
                vRot: (Math.random() - 0.5) * 0.05,
                rotation: 0,
                size: 44,
                radius: 20
            });
        }
    }

    updateHUD() {
        // Hearts
        let heartsStr = '';
        for (let i = 0; i < this.maxHealth; i++) {
            heartsStr += i < this.health ? '❤️' : '🖤';
        }
        document.getElementById('hudHearts').textContent = heartsStr;

        // Score
        document.getElementById('hudScore').textContent = String(this.score).padStart(3, '0');

        // Level
        const cfg = LEVELS_CONFIG[this.currentLevelIndex];
        const lvlEl = document.getElementById('hudLevel');
        lvlEl.textContent = `L${cfg.id}: ${cfg.title}`;
        lvlEl.style.borderColor = cfg.badgeColor;

        // Timer (01:00 -> 00:00)
        const t = Math.ceil(this.levelTimer);
        const mins = Math.floor(t / 60);
        const secs = t % 60;
        document.getElementById('hudTimer').textContent =
            `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        // High Score
        document.getElementById('hudHighScore').textContent = String(Math.max(this.score, this.highScore)).padStart(3, '0');

        // Awareness Message
        document.getElementById('hudAwareness').textContent = cfg.message;
    }

    // Canvas Rendering
    render() {
        const ctx = this.ctx;
        const cfg = LEVELS_CONFIG[this.currentLevelIndex];
        const shake = this.particles.getShakeOffset();

        ctx.save();
        ctx.translate(shake.x, shake.y);

        // 1. Water Background Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        bgGrad.addColorStop(0, cfg.waterGradient.top);
        bgGrad.addColorStop(0.55, cfg.waterGradient.middle);
        bgGrad.addColorStop(1, cfg.waterGradient.bottom);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. Underwater Sunbeams / God Rays
        SpriteRenderer.drawSunRays(ctx, this.width, this.height, cfg.id, this.animTime);

        // 3. Coral Reef & Kelp Seabed
        SpriteRenderer.drawCoralReef(ctx, this.width, this.height, cfg.id, this.animTime);

        // 4. Food Items
        for (let i = 0; i < this.foodItems.length; i++) {
            const f = this.foodItems[i];
            SpriteRenderer.drawFood(ctx, f.x, f.y, f.size, f.type, this.animTime + f.seed);
        }

        // 5. Plastic & Toxic Hazards
        for (let i = 0; i < this.obstacles.length; i++) {
            const obs = this.obstacles[i];
            if (obs.isToxic) {
                SpriteRenderer.drawToxicWaste(ctx, obs.x, obs.y, obs.size, this.animTime, obs.rotation);
            } else {
                SpriteRenderer.drawPlastic(ctx, obs.x, obs.y, obs.size, obs.type, this.animTime, obs.rotation);
            }
        }

        // 6. Sea Turtle Player
        if (this.state !== 'GAME_OVER') {
            SpriteRenderer.drawTurtle(
                ctx,
                this.player.x,
                this.player.y,
                this.player.size,
                this.animTime,
                this.player.tilt,
                this.player.invulnerableTimer > 0
            );
        }

        // 7. Particles (bubbles, sparkles, floating text)
        this.particles.draw(ctx);

        // 8. Atmospheric Water Fog / Murkiness overlay
        ctx.fillStyle = cfg.fogColor;
        ctx.fillRect(0, 0, this.width, this.height);

        // 9. Damage Screen Vignette / Flash
        if (this.damageFlash > 0) {
            ctx.fillStyle = this.damageType === 'toxic'
                ? `rgba(57, 255, 20, ${this.damageFlash * 0.45})`
                : `rgba(239, 68, 68, ${this.damageFlash * 0.5})`;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        ctx.restore();
    }
}

// Instantiate game when window loads
window.addEventListener('DOMContentLoaded', () => {
    window.game = new OceanGuardianGame();
});
