/**
 * Ocean Guardian - Level Configurations & Progression System
 * 5 distinct progressive levels with tailored spawn rates, hazard weights, visual filters, and messages.
 */

const LEVELS_CONFIG = [
    {
        id: 1,
        title: "CLEAN WATERS",
        badge: "EASY",
        badgeColor: "#10b981", // Emerald green
        targetScore: 100,
        duration: 60,
        message: "Use arrow keys to swim!",
        goal: "Learn the controls and collect healthy food.",
        awareness: "Clean waters provide a thriving sanctuary for sea turtles and marine life.",
        plasticSpeed: { min: 2.2, max: 3.2 },
        foodSpawnInterval: 1.2,     // Plentiful food
        plasticSpawnInterval: 2.8,  // Few plastic obstacles
        toxicSpawnChance: 0.0,      // No toxic waste
        allowedPlasticTypes: ['bottle'],
        waterGradient: {
            top: '#00b4d8',
            middle: '#0077b6',
            bottom: '#023e8a'
        },
        fogColor: 'rgba(0, 180, 216, 0.05)',
        sunbeamIntensity: 1.0,
        coralsHealthy: true
    },
    {
        id: 2,
        title: "RISING POLLUTION",
        badge: "MEDIUM",
        badgeColor: "#3b82f6", // Blue
        targetScore: 250,
        duration: 60,
        message: "Plastic waste can harm marine animals.",
        goal: "Survive while collecting food and avoiding increasing pollution.",
        awareness: "Over 14 million tons of plastic end up in the ocean every single year.",
        plasticSpeed: { min: 2.8, max: 4.0 },
        foodSpawnInterval: 1.8,     // Normal food
        plasticSpawnInterval: 1.9,  // More plastic
        toxicSpawnChance: 0.0,      // No toxic waste
        allowedPlasticTypes: ['bottle', 'bag'],
        waterGradient: {
            top: '#0096c7',
            middle: '#005f73',
            bottom: '#0a2342'
        },
        fogColor: 'rgba(0, 95, 115, 0.1)',
        sunbeamIntensity: 0.7,
        coralsHealthy: true
    },
    {
        id: 3,
        title: "PLASTIC STORM",
        badge: "HARD",
        badgeColor: "#f59e0b", // Amber/orange
        targetScore: 450,
        duration: 60,
        message: "The ocean is getting more polluted!",
        goal: "Use quick movement and avoid increasingly dense pollution.",
        awareness: "Plastic bottles take up to 450 years to decompose in the sea.",
        plasticSpeed: { min: 3.5, max: 5.0 },
        foodSpawnInterval: 2.5,     // Less food
        plasticSpawnInterval: 1.3,  // Fast spawning plastic storm
        toxicSpawnChance: 0.0,      // Still no toxic waste
        allowedPlasticTypes: ['bottle', 'bag', 'wrapper', 'can', 'rings'],
        waterGradient: {
            top: '#1b4332',
            middle: '#2d6a4f',
            bottom: '#081c15'
        },
        fogColor: 'rgba(45, 106, 79, 0.22)',
        sunbeamIntensity: 0.35,
        coralsHealthy: false
    },
    {
        id: 4,
        title: "TOXIC OCEAN",
        badge: "VERY HARD",
        badgeColor: "#ef4444", // Red
        targetScore: 700,
        duration: 60,
        message: "Toxic waste harms marine life!",
        goal: "Survive the dangerous toxic environment.",
        awareness: "Chemical leaks and heavy toxic drums poison coral reefs and wipe out marine food chains.",
        plasticSpeed: { min: 4.2, max: 6.2 },
        foodSpawnInterval: 3.2,     // Scarce food
        plasticSpawnInterval: 1.1,  // Very high density
        toxicSpawnChance: 0.32,     // Toxic waste introduced (-2 health)
        allowedPlasticTypes: ['bottle', 'bag', 'wrapper', 'can', 'rings'],
        waterGradient: {
            top: '#1e1b4b',
            middle: '#1e293b',
            bottom: '#0f172a'
        },
        fogColor: 'rgba(57, 255, 20, 0.08)', // Radioactive tint
        sunbeamIntensity: 0.0,
        coralsHealthy: false
    },
    {
        id: 5,
        title: "OCEAN GUARDIAN",
        badge: "EXTREME",
        badgeColor: "#a855f7", // Purple
        targetScore: 1000,
        duration: 60,
        message: "Survive the final challenge to become the Ocean Guardian!",
        goal: "Survive the final level and become the Ocean Guardian.",
        awareness: "Protecting marine ecosystems requires global action, circular recycling, and youth leadership.",
        plasticSpeed: { min: 5.0, max: 7.2 },
        foodSpawnInterval: 3.5,     // Very limited food
        plasticSpawnInterval: 0.85, // Extreme pollution onslaught
        toxicSpawnChance: 0.40,     // Heavy toxic presence
        allowedPlasticTypes: ['bottle', 'bag', 'wrapper', 'can', 'rings'],
        waterGradient: {
            top: '#13111c',
            middle: '#0f172a',
            bottom: '#030712'
        },
        fogColor: 'rgba(168, 85, 247, 0.14)',
        sunbeamIntensity: 0.0,
        coralsHealthy: false
    }
];

window.LEVELS_CONFIG = LEVELS_CONFIG;
