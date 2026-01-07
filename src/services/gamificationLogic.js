export const getPetMood = (streak) => {
  if (streak === 0) return { mood: "Resting", accessory: "💤", color: "#999", class: "mood-resting" };
  if (streak < 3) return { mood: "Happy", accessory: "🌱", color: "#4CAF50", class: "mood-happy" };
  if (streak < 7) return { mood: "Focused", accessory: "🎯", color: "#2196f3", class: "mood-focused" };
  if (streak < 14) return { mood: "Fired Up", accessory: "🔥", color: "#ff9800", class: "mood-fired" };
  if (streak < 30) return { mood: "Elite", accessory: "🕶️", color: "#673ab7", class: "mood-elite" };
  return { mood: "Legendary", accessory: "👑", color: "#ffd700", class: "mood-legendary" };
};

export const getPetEvolution = (hours) => {
  if (hours < 5) return { emoji: "🥚", stage: "Egg" };
  if (hours < 20) return { emoji: "🐣", stage: "Hatchling" };
  if (hours < 50) return { emoji: "🐤", stage: "Fledgling" };
  return { emoji: "🦉", stage: "Scholar Owl" };
};

export const getMilestones = (streak) => {
  return [
    { id: 1, title: "First Step", icon: "🌅", unlocked: streak >= 1 },
    { id: 2, title: "3 Day Heat", icon: "🔥", unlocked: streak >= 3 },
    { id: 3, title: "Full Week", icon: "📅", unlocked: streak >= 7 },
    { id: 4, title: "Fortnight", icon: "🛡️", unlocked: streak >= 14 },
    { id: 5, title: "Monthly Master", icon: "🏆", unlocked: streak >= 30 },
  ];
};
