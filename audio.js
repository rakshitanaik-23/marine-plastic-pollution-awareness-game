/**
 * Ocean Guardian - Web Audio API Procedural Sound Engine
 * Generates all SFX and ambient sound effects dynamically without external audio assets.
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.ambientInterval = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported:", e);
        }
    }

    resume() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // Swim swish sound (subtle)
    playSwim() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, now);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    }

    // Food pickup (+10 pts) - bright melodic chimes
    playEat() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.04);

                gain.gain.setValueAtTime(0.12, now + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.18);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.04);
                osc.stop(now + idx * 0.04 + 0.2);
            });
        } catch (e) {}
    }

    // Plastic obstacle collision (-1 health) - dull hollow thud
    playDamage() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Low thud
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);

            oscGain.gain.setValueAtTime(0.2, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(oscGain);
            oscGain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);

            // Noise burst for plastic crack
            const bufferSize = this.ctx.sampleRate * 0.12;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.5;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1200, now);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.18, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now);
        } catch (e) {}
    }

    // Toxic waste collision (-2 health) - harsh radioactive sizzle & alarm
    playToxicDamage() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            
            // Dissonant dual oscillators
            [110, 116, 233].forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.4);
            });

            // High sizzling noise
            const bufferSize = this.ctx.sampleRate * 0.25;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(2500, now);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.15, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now);
        } catch (e) {}
    }

    // Countdown beeps (3, 2, 1 -> short high pip; GO -> fanfare chord)
    playCountdown(isGo = false) {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (!isGo) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.16);
            } else {
                [523.25, 659.25, 783.99, 1046.50].forEach(freq => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.46);
                });
            }
        } catch (e) {}
    }

    // Level complete fanfare
    playLevelComplete() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            arpeggio.forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now + i * 0.09);
                gain.gain.setValueAtTime(0.18, now + i * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.09);
                osc.stop(now + i * 0.09 + 0.4);
            });
        } catch (e) {}
    }

    // Game Over sad tune
    playGameOver() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const sadNotes = [392.00, 369.99, 349.23, 311.13, 261.63];
            sadNotes.forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, now + i * 0.18);
                gain.gain.setValueAtTime(0.15, now + i * 0.18);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.3);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.18);
                osc.stop(now + i * 0.18 + 0.32);
            });
        } catch (e) {}
    }

    // Grand Ocean Guardian victory fanfare
    playVictory() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const chords = [
                { notes: [523.25, 659.25, 783.99], time: 0 },
                { notes: [587.33, 698.46, 880.00], time: 0.22 },
                { notes: [659.25, 783.99, 987.77], time: 0.44 },
                { notes: [783.99, 987.77, 1046.50, 1318.51], time: 0.7 }
            ];

            chords.forEach(c => {
                c.notes.forEach(f => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now + c.time);
                    gain.gain.setValueAtTime(0.14, now + c.time);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + 0.6);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + c.time);
                    osc.stop(now + c.time + 0.65);
                });
            });
        } catch (e) {}
    }

    // Bubble pop sound
    playBubble() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const baseFreq = 600 + Math.random() * 400;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.08);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        } catch (e) {}
    }
}

// Global sound manager instance
window.soundEngine = new SoundEngine();
