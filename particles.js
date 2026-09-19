/**
 * Ocean Guardian - Particle & Visual Effects Engine
 * Handles bubbles, food pickup sparkles, floating score numbers, toxic sparks, and screen shake.
 */

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
        this.screenShake = 0;
    }

    // Trigger a screen shake with decay
    shake(intensity = 10) {
        this.screenShake = Math.max(this.screenShake, intensity);
    }

    // Get current screen shake offset
    getShakeOffset() {
        if (this.screenShake <= 0) return { x: 0, y: 0 };
        const x = (Math.random() * 2 - 1) * this.screenShake;
        const y = (Math.random() * 2 - 1) * this.screenShake;
        return { x, y };
    }

    // Spawn ambient bubble
    addAmbientBubble(width, height, level = 1) {
        this.particles.push({
            type: 'bubble',
            x: Math.random() * width,
            y: height + 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -(0.8 + Math.random() * 1.5),
            size: 2 + Math.random() * 6,
            life: 1.0,
            decay: 0.002 + Math.random() * 0.003,
            wobbleSpeed: 2 + Math.random() * 3,
            wobbleAmp: 0.8 + Math.random() * 1.2,
            color: level >= 4 ? 'rgba(80, 240, 120, 0.45)' : 'rgba(255, 255, 255, 0.6)'
        });
    }

    // Spawn turtle swimming bubbles
    addTurtleBubble(x, y) {
        this.particles.push({
            type: 'bubble',
            x: x - 28 + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 6,
            vx: -(1 + Math.random() * 1.5),
            vy: -(0.5 + Math.random() * 0.8),
            size: 2.5 + Math.random() * 4,
            life: 1.0,
            decay: 0.025,
            wobbleSpeed: 4,
            wobbleAmp: 1,
            color: 'rgba(210, 245, 255, 0.7)'
        });
    }

    // Sparkle burst on food collection (+10)
    addEatEffect(x, y) {
        const colors = ['#ffd166', '#06d6a0', '#118ab2', '#ff9f1c', '#ffffff'];
        for (let i = 0; i < 18; i++) {
            const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
            const speed = 1.5 + Math.random() * 3.5;
            this.particles.push({
                type: 'spark',
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2.5 + Math.random() * 3.5,
                life: 1.0,
                decay: 0.035,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        // Floating score "+10"
        this.floatingTexts.push({
            text: '+10',
            x,
            y: y - 10,
            vy: -1.2,
            alpha: 1.0,
            color: '#ffe600',
            fontSize: 22
        });
    }

    // Plastic impact burst (crunch/thud)
    addPlasticImpact(x, y) {
        const colors = ['#ffffff', '#ced4da', '#adb5bd', '#6c757d', '#ff4d6d'];
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4.5;
            this.particles.push({
                type: 'debris',
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 4,
                life: 1.0,
                decay: 0.04,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    // Toxic barrel impact & continuous drip
    addToxicBurst(x, y) {
        for (let i = 0; i < 28; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.5 + Math.random() * 5;
            this.particles.push({
                type: 'spark',
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 5,
                life: 1.0,
                decay: 0.03,
                color: Math.random() > 0.3 ? '#39ff14' : '#ffff3f'
            });
        }

        // Floating damage indicator "-2"
        this.floatingTexts.push({
            text: '-2 LIFE ☣',
            x,
            y: y - 12,
            vy: -1.4,
            alpha: 1.0,
            color: '#ff0055',
            fontSize: 24
        });
    }

    // Update all particles & shake
    update(deltaTime, width, height) {
        // Decay screen shake
        if (this.screenShake > 0) {
            this.screenShake -= deltaTime * 24;
            if (this.screenShake < 0) this.screenShake = 0;
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.type === 'bubble') {
                p.x += Math.sin(p.life * p.wobbleSpeed) * p.wobbleAmp;
            }

            if (p.life <= 0 || p.y < -20 || p.x < -20 || p.x > width + 20) {
                this.particles.splice(i, 1);
            }
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy;
            t.alpha -= 0.025;
            if (t.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    // Render all particles & floating texts
    draw(ctx) {
        ctx.save();

        // 1. Particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            ctx.globalAlpha = Math.max(0, p.life);

            if (p.type === 'bubble') {
                ctx.fillStyle = p.color;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Bubble shine glint
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(p.x - p.size * 0.35, p.y - p.size * 0.35, p.size * 0.25, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'spark' || p.type === 'debris') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 2. Floating Numbers (+10, -2)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < this.floatingTexts.length; i++) {
            const t = this.floatingTexts[i];
            ctx.globalAlpha = Math.max(0, t.alpha);
            ctx.font = `900 ${t.fontSize}px "Outfit", "Segoe UI", sans-serif`;
            ctx.fillStyle = '#000000';
            ctx.fillText(t.text, t.x + 1, t.y + 1);
            ctx.fillStyle = t.color;
            ctx.fillText(t.text, t.x, t.y);
        }

        ctx.restore();
    }
}

window.ParticleSystem = ParticleSystem;
