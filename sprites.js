/**
 * Ocean Guardian - Procedural Canvas Vector Sprite Renderer
 * Handcrafted vector graphics with smooth animations for Turtle, Food, Plastic, and Scenery.
 */

class SpriteRenderer {
    // -------------------------------------------------------------
    // SEA TURTLE 🐢
    // -------------------------------------------------------------
    static drawTurtle(ctx, x, y, size, animTime, tiltAngle = 0, isInvulnerable = false) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tiltAngle);

        // Invulnerability flashing
        if (isInvulnerable && Math.floor(animTime * 15) % 2 === 0) {
            ctx.globalAlpha = 0.35;
        }

        const scale = size / 60;
        ctx.scale(scale, scale);

        // Sinusoidal flipper motion
        const flipperAngle = Math.sin(animTime * 6) * 0.35;
        const rearFlipperAngle = Math.sin(animTime * 6 + 1) * 0.2;

        // 1. Rear Flippers (Back legs)
        ctx.fillStyle = '#2d8a56';
        ctx.strokeStyle = '#1b5a37';
        ctx.lineWidth = 1.5;

        // Top rear flipper
        ctx.save();
        ctx.translate(-22, -12);
        ctx.rotate(-0.4 + rearFlipperAngle);
        ctx.beginPath();
        ctx.ellipse(-8, -4, 12, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Bottom rear flipper
        ctx.save();
        ctx.translate(-22, 12);
        ctx.rotate(0.4 - rearFlipperAngle);
        ctx.beginPath();
        ctx.ellipse(-8, 4, 12, 6, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. Front Flippers (Main swimming flippers)
        // Top front flipper
        ctx.save();
        ctx.translate(6, -16);
        ctx.rotate(-0.7 + flipperAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(10, -20, 28, -26, 32, -18);
        ctx.bezierCurveTo(28, -6, 12, -2, 0, 0);
        ctx.fillStyle = '#3eb574';
        ctx.fill();
        ctx.stroke();
        // Flipper spots
        ctx.fillStyle = '#237346';
        ctx.beginPath();
        ctx.arc(16, -12, 2.5, 0, Math.PI * 2);
        ctx.arc(24, -16, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Bottom front flipper
        ctx.save();
        ctx.translate(6, 16);
        ctx.rotate(0.7 - flipperAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(10, 20, 28, 26, 32, 18);
        ctx.bezierCurveTo(28, 6, 12, 2, 0, 0);
        ctx.fillStyle = '#3eb574';
        ctx.fill();
        ctx.stroke();
        // Flipper spots
        ctx.fillStyle = '#237346';
        ctx.beginPath();
        ctx.arc(16, 12, 2.5, 0, Math.PI * 2);
        ctx.arc(24, 16, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Turtle Head & Neck
        ctx.save();
        ctx.translate(24, 0);
        // Neck
        ctx.fillStyle = '#3eb574';
        ctx.beginPath();
        ctx.ellipse(2, 0, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.ellipse(12, 0, 11, 8.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Beak
        ctx.fillStyle = '#2e8b57';
        ctx.beginPath();
        ctx.moveTo(21, -2);
        ctx.lineTo(25, 0);
        ctx.lineTo(21, 2);
        ctx.closePath();
        ctx.fill();

        // Big friendly Eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(14, -3.5, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#112211';
        ctx.beginPath();
        ctx.arc(15, -3.5, 2.2, 0, Math.PI * 2);
        ctx.fill();
        // Eye catchlight/sparkle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(15.8, -4.5, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Little Tail
        ctx.fillStyle = '#3eb574';
        ctx.beginPath();
        ctx.moveTo(-28, -2);
        ctx.lineTo(-37, 0);
        ctx.lineTo(-28, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 5. Shell (Carapace)
        // Outer shell gradient
        const shellGrad = ctx.createRadialGradient(-4, 0, 4, 0, 0, 28);
        shellGrad.addColorStop(0, '#56b870');
        shellGrad.addColorStop(0.5, '#2e7a4a');
        shellGrad.addColorStop(1, '#184729');

        ctx.fillStyle = shellGrad;
        ctx.strokeStyle = '#123820';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(-2, 0, 27, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Shell Rim (Yellowish-green scute trim)
        ctx.strokeStyle = '#e6c86e';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Shell Plate Patterns (Hexagonal scutes)
        ctx.fillStyle = '#338550';
        ctx.strokeStyle = '#1b5231';
        ctx.lineWidth = 1.4;

        // Center hexagonal plates
        const hexCenters = [
            { x: -14, y: 0, r: 6.5 },
            { x: -2, y: 0, r: 7.5 },
            { x: 11, y: 0, r: 6.5 }
        ];

        hexCenters.forEach(hc => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const hx = hc.x + Math.cos(angle) * hc.r;
                const hy = hc.y + Math.sin(angle) * (hc.r * 0.85);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.stroke();
        });

        // Top and bottom scute lines
        [-9, 9].forEach(yOffset => {
            ctx.beginPath();
            ctx.moveTo(-18, yOffset);
            ctx.lineTo(-12, yOffset * 1.5);
            ctx.lineTo(2, yOffset * 1.5);
            ctx.lineTo(14, yOffset);
            ctx.stroke();
        });

        ctx.restore();
    }

    // -------------------------------------------------------------
    // HEALTHY FOOD (+10 Points)
    // -------------------------------------------------------------
    static drawFood(ctx, x, y, size, type = 'jellyfish', animTime = 0) {
        ctx.save();
        ctx.translate(x, y);
        const scale = size / 40;
        ctx.scale(scale, scale);

        if (type === 'jellyfish') {
            // Translucent glowing jellyfish
            const pulse = Math.sin(animTime * 4) * 0.12;
            ctx.scale(1 + pulse, 1 - pulse * 0.8);

            // Bioluminescent glow
            const glow = ctx.createRadialGradient(0, 0, 6, 0, 0, 24);
            glow.addColorStop(0, 'rgba(255, 130, 210, 0.4)');
            glow.addColorStop(1, 'rgba(255, 130, 210, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, 24, 0, Math.PI * 2);
            ctx.fill();

            // Jellyfish Bell (Umbrella)
            const bellGrad = ctx.createLinearGradient(0, -18, 0, 4);
            bellGrad.addColorStop(0, '#ff94dd');
            bellGrad.addColorStop(0.6, '#ff6ec7');
            bellGrad.addColorStop(1, 'rgba(255, 180, 235, 0.8)');

            ctx.fillStyle = bellGrad;
            ctx.beginPath();
            ctx.arc(0, -4, 16, Math.PI, 0);
            ctx.bezierCurveTo(14, 2, 8, 5, 0, 4);
            ctx.bezierCurveTo(-8, 5, -14, 2, -16, -4);
            ctx.fill();

            // Internal organ glow
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.ellipse(0, -6, 7, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tentacles waving
            ctx.strokeStyle = '#ff94dd';
            ctx.lineWidth = 1.8;
            ctx.lineCap = 'round';
            for (let i = -3; i <= 3; i++) {
                const tx = i * 4;
                const wave1 = Math.sin(animTime * 5 + i) * 5;
                const wave2 = Math.cos(animTime * 4 + i) * 6;
                ctx.beginPath();
                ctx.moveTo(tx, 4);
                ctx.bezierCurveTo(tx + wave1, 14, tx + wave2, 22, tx + wave1 * 0.5, 30);
                ctx.stroke();
            }
        } else if (type === 'fish') {
            // Little healthy clownfish / damsel
            const tailWag = Math.sin(animTime * 8) * 0.35;

            // Tail Fin
            ctx.save();
            ctx.translate(-14, 0);
            ctx.rotate(tailWag);
            ctx.fillStyle = '#ff7b25';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-12, -9);
            ctx.quadraticCurveTo(-16, 0, -12, 9);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Fish Body
            const bodyGrad = ctx.createRadialGradient(4, -2, 2, 0, 0, 18);
            bodyGrad.addColorStop(0, '#ffaa40');
            bodyGrad.addColorStop(0.8, '#ff6a00');
            bodyGrad.addColorStop(1, '#d84e00');

            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.ellipse(2, 0, 16, 11, 0, 0, Math.PI * 2);
            ctx.fill();

            // White stripes
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(2, 0, 4, 11, 0, 0, Math.PI * 2);
            ctx.fill();

            // Little pectoral fin
            ctx.fillStyle = '#ff9248';
            ctx.beginPath();
            ctx.ellipse(0, 3, 5, 3, 0.4, 0, Math.PI * 2);
            ctx.fill();

            // Fish Eye
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(10, -3, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(11, -3, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(11.8, -3.8, 0.8, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Floating seaweed pod / nutritious kelp
            const bob = Math.sin(animTime * 3) * 3;
            ctx.translate(0, bob);

            ctx.fillStyle = '#48c774';
            ctx.strokeStyle = '#2d8a4e';
            ctx.lineWidth = 1.5;

            // Leaves
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2 + animTime * 0.5;
                ctx.save();
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.ellipse(10, 0, 12, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            // Central golden berry / nutrient core
            ctx.fillStyle = '#ffe066';
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    // -------------------------------------------------------------
    // PLASTIC POLLUTION HAZARDS (-1 Health)
    // -------------------------------------------------------------
    static drawPlastic(ctx, x, y, size, type = 'bottle', animTime = 0, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        const scale = size / 45;
        ctx.scale(scale, scale);

        switch (type) {
            case 'bottle': {
                // Single-use plastic water bottle
                // Blue bottle cap
                ctx.fillStyle = '#0084ff';
                ctx.fillRect(16, -4, 5, 8);

                // Bottle neck
                ctx.fillStyle = 'rgba(180, 225, 255, 0.75)';
                ctx.strokeStyle = 'rgba(120, 190, 240, 0.9)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(16, -3);
                ctx.lineTo(12, -7);
                ctx.lineTo(-18, -7);
                ctx.lineTo(-20, -5);
                ctx.lineTo(-20, 5);
                ctx.lineTo(-18, 7);
                ctx.lineTo(12, 7);
                ctx.lineTo(16, 3);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Wrinkled plastic label
                ctx.fillStyle = '#ff4d6d';
                ctx.fillRect(-6, -7, 12, 14);
                // Barcode lines
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-4, -5, 8, 10);
                ctx.fillStyle = '#333333';
                ctx.fillRect(-3, -4, 1.5, 8);
                ctx.fillRect(-0.5, -4, 1, 8);
                ctx.fillRect(1.5, -4, 2, 8);

                // Plastic ridges / highlights
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(-14, -5);
                ctx.lineTo(-14, 5);
                ctx.moveTo(-10, -5);
                ctx.lineTo(-10, 5);
                ctx.stroke();
                break;
            }

            case 'bag': {
                // Floating ghostly plastic shopping bag
                const flutter = Math.sin(animTime * 5) * 3;

                ctx.fillStyle = 'rgba(240, 248, 255, 0.65)';
                ctx.strokeStyle = 'rgba(190, 215, 235, 0.85)';
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                ctx.moveTo(-18, -12);
                ctx.quadraticCurveTo(-8 + flutter, -18, 10, -14);
                // Handles
                ctx.quadraticCurveTo(18, -16, 20, -8);
                ctx.quadraticCurveTo(15, 0, 20, 8);
                ctx.quadraticCurveTo(18, 16, 10, 14);
                // Lower body
                ctx.quadraticCurveTo(-8 - flutter, 18, -18, 12);
                ctx.quadraticCurveTo(-24 + flutter, 0, -18, -12);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Handle hole cutout
                ctx.fillStyle = 'rgba(0, 50, 100, 0.15)';
                ctx.beginPath();
                ctx.ellipse(13, 0, 4, 7, 0, 0, Math.PI * 2);
                ctx.fill();

                // Bag crinkle creases
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-10, -8);
                ctx.lineTo(2, 4);
                ctx.moveTo(-6, 8);
                ctx.lineTo(4, -2);
                ctx.stroke();
                break;
            }

            case 'wrapper': {
                // Crinkled metallic snack wrapper
                ctx.save();
                const wrapperGrad = ctx.createLinearGradient(-16, -12, 16, 12);
                wrapperGrad.addColorStop(0, '#ffbe0b');
                wrapperGrad.addColorStop(0.5, '#fb5607');
                wrapperGrad.addColorStop(1, '#ff006e');

                ctx.fillStyle = wrapperGrad;
                ctx.strokeStyle = '#8338ec';
                ctx.lineWidth = 1.5;

                // Jagged edges on sides
                ctx.beginPath();
                ctx.moveTo(-16, -10);
                ctx.lineTo(16, -10);
                // Zig zag right
                ctx.lineTo(18, -6);
                ctx.lineTo(15, -2);
                ctx.lineTo(18, 2);
                ctx.lineTo(15, 6);
                ctx.lineTo(18, 10);
                ctx.lineTo(-16, 10);
                // Zig zag left
                ctx.lineTo(-14, 6);
                ctx.lineTo(-17, 2);
                ctx.lineTo(-14, -2);
                ctx.lineTo(-17, -6);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Shiny foil diagonal highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.beginPath();
                ctx.moveTo(-4, -10);
                ctx.lineTo(4, -10);
                ctx.lineTo(-2, 10);
                ctx.lineTo(-10, 10);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;
            }

            case 'can': {
                // Dented metal soda can
                const canGrad = ctx.createLinearGradient(-12, -14, 12, 14);
                canGrad.addColorStop(0, '#e63946');
                canGrad.addColorStop(0.6, '#f1faee');
                canGrad.addColorStop(1, '#a8dadc');

                ctx.fillStyle = canGrad;
                ctx.strokeStyle = '#457b9d';
                ctx.lineWidth = 1.8;

                // Dented silhouette
                ctx.beginPath();
                ctx.moveTo(-10, -14);
                ctx.lineTo(10, -14);
                ctx.lineTo(11, -4);
                ctx.lineTo(7, 2); // Dent
                ctx.lineTo(11, 14);
                ctx.lineTo(-10, 14);
                ctx.lineTo(-11, 4);
                ctx.lineTo(-8, -2); // Dent
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Top rim and pull tab
                ctx.fillStyle = '#adb5bd';
                ctx.fillRect(-9, -16, 18, 3);
                ctx.fillStyle = '#495057';
                ctx.fillRect(-2, -18, 5, 2);
                break;
            }

            case 'rings':
            default: {
                // 6-pack plastic beverage rings
                ctx.strokeStyle = 'rgba(230, 245, 255, 0.85)';
                ctx.lineWidth = 2.4;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';

                const positions = [
                    { x: -11, y: -7 }, { x: 0, y: -7 }, { x: 11, y: -7 },
                    { x: -11, y: 7 }, { x: 0, y: 7 }, { x: 11, y: 7 }
                ];

                positions.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                });
                break;
            }
        }

        ctx.restore();
    }

    // -------------------------------------------------------------
    // TOXIC WASTE BARREL (-2 Health)
    // -------------------------------------------------------------
    static drawToxicWaste(ctx, x, y, size, animTime = 0, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        const scale = size / 55;
        ctx.scale(scale, scale);

        // 1. Pulsing Radioactive Glow
        const pulse = 0.5 + Math.sin(animTime * 6) * 0.25;
        const glow = ctx.createRadialGradient(0, 0, 12, 0, 0, 42);
        glow.addColorStop(0, `rgba(57, 255, 20, ${0.45 * pulse})`);
        glow.addColorStop(0.6, `rgba(50, 205, 50, ${0.25 * pulse})`);
        glow.addColorStop(1, 'rgba(0, 255, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.fill();

        // 2. Heavy Industrial Steel Barrel Body
        const barrelGrad = ctx.createLinearGradient(-18, 0, 18, 0);
        barrelGrad.addColorStop(0, '#2c3e50');
        barrelGrad.addColorStop(0.3, '#34495e');
        barrelGrad.addColorStop(0.7, '#2c3e50');
        barrelGrad.addColorStop(1, '#1a252f');

        ctx.fillStyle = barrelGrad;
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-18, -24, 36, 48, 4);
        ctx.fill();
        ctx.stroke();

        // Steel reinforcement rings/ribs
        ctx.fillStyle = '#1e2b37';
        ctx.fillRect(-19, -12, 38, 4);
        ctx.fillRect(-19, 8, 38, 4);
        ctx.strokeRect(-19, -12, 38, 4);
        ctx.strokeRect(-19, 8, 38, 4);

        // 3. Hazard Yellow/Black Warning Sign
        ctx.fillStyle = '#ffd60a';
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(13, 6);
        ctx.lineTo(-13, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Biohazard / Skull icon center
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 1, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Warning exclamation mark
        ctx.fillRect(-0.8, -3.5, 1.6, 3);
        ctx.fillRect(-0.8, 1, 1.6, 1.2);

        // 4. Leaking Toxic Sludge & Drips
        const dripOffset = Math.sin(animTime * 8) * 2;
        ctx.fillStyle = '#39ff14';
        ctx.beginPath();
        ctx.moveTo(-10, 24);
        ctx.bezierCurveTo(-8, 30 + dripOffset, -4, 34 + dripOffset, -6, 24);
        ctx.bezierCurveTo(2, 28 + dripOffset, 6, 36 + dripOffset, 4, 24);
        ctx.closePath();
        ctx.fill();

        // Top leak
        ctx.beginPath();
        ctx.ellipse(-6, -24, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // -------------------------------------------------------------
    // UNDERWATER ENVIRONMENT & CORAL REEF
    // -------------------------------------------------------------
    static drawCoralReef(ctx, width, height, level = 1, animTime = 0) {
        ctx.save();
        const baseCoralY = height - 10;

        // Sea floor gradient
        let sandGrad;
        if (level === 1) {
            sandGrad = ctx.createLinearGradient(0, height - 70, 0, height);
            sandGrad.addColorStop(0, 'rgba(240, 218, 157, 0.1)');
            sandGrad.addColorStop(1, '#e3c287');
        } else if (level === 2) {
            sandGrad = ctx.createLinearGradient(0, height - 70, 0, height);
            sandGrad.addColorStop(0, 'rgba(210, 195, 140, 0.1)');
            sandGrad.addColorStop(1, '#c2ab72');
        } else if (level === 3) {
            sandGrad = ctx.createLinearGradient(0, height - 70, 0, height);
            sandGrad.addColorStop(0, 'rgba(140, 150, 130, 0.1)');
            sandGrad.addColorStop(1, '#8f947e');
        } else {
            sandGrad = ctx.createLinearGradient(0, height - 70, 0, height);
            sandGrad.addColorStop(0, 'rgba(60, 80, 70, 0.1)');
            sandGrad.addColorStop(1, '#3b4d44');
        }

        ctx.fillStyle = sandGrad;
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 60) {
            const h = Math.sin(x * 0.015) * 12 + Math.cos(x * 0.03) * 8;
            ctx.lineTo(x, height - 40 + h);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Coral formations across the bottom
        const coralColors = level <= 2
            ? ['#ff5d8f', '#ff97b7', '#70e000', '#38b000', '#9d4edd', '#00b4d8']
            : level === 3
            ? ['#c77dff', '#9a8c98', '#6b705c', '#a5a58d', '#588157']
            : ['#495057', '#343a40', '#212529', '#2d6a4f', '#1b4332']; // Bleached/dead corals

        // Draw waving kelp fronds
        for (let x = 40; x < width; x += 110) {
            const kelpHeight = 80 + ((x * 13) % 70);
            const sway = Math.sin(animTime * 2.5 + x) * 16;
            ctx.strokeStyle = level >= 4 ? '#2d6a4f' : '#38b000';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x, baseCoralY);
            ctx.bezierCurveTo(x + sway * 0.5, baseCoralY - kelpHeight * 0.5, x - sway * 0.3, baseCoralY - kelpHeight * 0.8, x + sway, baseCoralY - kelpHeight);
            ctx.stroke();

            // Little kelp leaves
            ctx.fillStyle = level >= 4 ? '#1b4332' : '#70e000';
            for (let i = 1; i <= 3; i++) {
                const ly = baseCoralY - (kelpHeight * i) / 4;
                ctx.beginPath();
                ctx.ellipse(x + (i % 2 === 0 ? 8 : -8) + sway * 0.5, ly, 10, 4, (i % 2 === 0 ? 0.4 : -0.4), 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Branching corals & sponges
        for (let x = 80; x < width; x += 140) {
            const color = coralColors[(x / 20) % coralColors.length];
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, baseCoralY - 14, 18, Math.PI, 0);
            ctx.arc(x + 16, baseCoralY - 10, 14, Math.PI, 0);
            ctx.arc(x - 16, baseCoralY - 8, 12, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    // -------------------------------------------------------------
    // SUN RAYS / GOD RAYS
    // -------------------------------------------------------------
    static drawSunRays(ctx, width, height, level = 1, animTime = 0) {
        if (level >= 4) return; // Dark polluted ocean has no sunbeams!

        ctx.save();
        const alphaBase = level === 1 ? 0.08 : level === 2 ? 0.05 : 0.025;
        const count = 6;

        for (let i = 0; i < count; i++) {
            const startX = (width / count) * i + Math.sin(animTime + i) * 30;
            const endX = startX + 160 + Math.cos(animTime * 0.8 + i) * 40;

            const rayGrad = ctx.createLinearGradient(startX, 0, endX, height * 0.85);
            rayGrad.addColorStop(0, `rgba(255, 255, 230, ${alphaBase * 1.6})`);
            rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = rayGrad;
            ctx.beginPath();
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX + 45, 0);
            ctx.lineTo(endX + 80, height * 0.85);
            ctx.lineTo(endX - 20, height * 0.85);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}

window.SpriteRenderer = SpriteRenderer;
