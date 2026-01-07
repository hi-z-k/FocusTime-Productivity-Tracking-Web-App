// src/services/gamificationLogic.js

export const getPetMood = (streak) => {
  if (streak === 0) return { mood: "Resting", accessory: "💤", color: "#999", class: "mood-resting" };
  if (streak < 3) return { mood: "Happy", accessory: "🌱", color: "#4CAF50", class: "mood-happy" };
  if (streak < 7) return { mood: "Fired Up", accessory: "🔥", color: "#ff9800", class: "mood-fired" };
  if (streak < 14) return { mood: "Elite", accessory: "🕶️", color: "#2196f3", class: "mood-elite" };
  return { mood: "Legendary", accessory: "👑", color: "#ffd700", class: "mood-legendary" };
};

export const getPetEvolution = (hours) => {
  if (hours < 2) return { emoji: "🥚", stage: "Egg" };
  if (hours < 4) return { emoji: "🐣", stage: "Hatchling" };
  return { emoji: "🦉", stage: "Scholar Owl" };
};

export const getMilestones = (streak) => {
  return [
    { id: 1, title: "Day One", icon: "🌅", unlocked: streak >= 1 },
    { id: 2, title: "3 Day Heat", icon: "🔥", unlocked: streak >= 3 },
    { id: 3, title: "Full Week", icon: "📅", unlocked: streak >= 7 },
    { id: 4, title: "Unstoppable", icon: "⚡", unlocked: streak >= 10 },
    { id: 5, title: "Legendary Streak", icon: "👑", unlocked: streak >= 14 },
  ];
};