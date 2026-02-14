export interface Question {
  id: number;
  text: string;
  trait: string;
  options: { label: string; value: string }[];
}

export const quizQuestions: Question[] = [
  {
    id: 1,
    text: "How do you debug a tricky bug at 2 AM?",
    trait: "personality",
    options: [
      { label: "Methodical console.log everywhere", value: "analytical" },
      { label: "Rubber duck it with a friend", value: "social" },
      { label: "Stack Overflow deep dive", value: "resourceful" },
      { label: "Rage quit, sleep, fix it in 5 min tomorrow", value: "chill" },
    ],
  },
  {
    id: 2,
    text: "Your ideal weekend looks like…",
    trait: "personality",
    options: [
      { label: "Hackathon with snacks", value: "analytical" },
      { label: "Board games & binge-watching", value: "social" },
      { label: "Solo hike or reading", value: "chill" },
      { label: "Exploring a new café or city", value: "resourceful" },
    ],
  },
  {
    id: 3,
    text: "Pick your love language:",
    trait: "love_language",
    options: [
      { label: "Words of affirmation (send memes & compliments)", value: "words" },
      { label: "Quality time (let's co-work silently)", value: "time" },
      { label: "Acts of service (I'll fix your code)", value: "service" },
      { label: "Gifts (surprise boba delivery)", value: "gifts" },
    ],
  },
  {
    id: 4,
    text: "How do you show someone you care?",
    trait: "love_language",
    options: [
      { label: "Write them a heartfelt message", value: "words" },
      { label: "Plan a whole day together", value: "time" },
      { label: "Help them with their project", value: "service" },
      { label: "Get them something thoughtful", value: "gifts" },
    ],
  },
  {
    id: 5,
    text: "It's 11 PM. You're most likely…",
    trait: "energy_level",
    options: [
      { label: "Deep in a coding sprint", value: "night_owl" },
      { label: "Already asleep since 10", value: "early_bird" },
      { label: "Watching YouTube rabbit holes", value: "night_owl" },
      { label: "Journaling or winding down", value: "balanced" },
    ],
  },
  {
    id: 6,
    text: "Your energy at a party:",
    trait: "energy_level",
    options: [
      { label: "I AM the party 🎉", value: "extrovert" },
      { label: "Vibing with 2-3 close friends", value: "balanced" },
      { label: "Found the dog, petting it in the corner", value: "introvert" },
      { label: "Left early to recharge", value: "introvert" },
    ],
  },
  {
    id: 7,
    text: "Pick your ideal date:",
    trait: "interests",
    options: [
      { label: "Netflix & code review", value: "tech" },
      { label: "Stargazing on a rooftop", value: "romantic" },
      { label: "Competitive gaming session", value: "gaming" },
      { label: "Cooking together from a recipe", value: "creative" },
    ],
  },
  {
    id: 8,
    text: "What's your go-to content?",
    trait: "interests",
    options: [
      { label: "Tech podcasts / dev blogs", value: "tech" },
      { label: "Anime / K-dramas", value: "creative" },
      { label: "Memes & Reels", value: "gaming" },
      { label: "Books & poetry", value: "romantic" },
    ],
  },
  {
    id: 9,
    text: "In a group project, you're the one who…",
    trait: "tech_role",
    options: [
      { label: "Designs the entire system architecture", value: "backend" },
      { label: "Makes the UI pixel-perfect", value: "frontend" },
      { label: "Writes the README and presents", value: "pm" },
      { label: "Does everything the night before", value: "fullstack" },
    ],
  },
  {
    id: 10,
    text: "Pick a superpower:",
    trait: "tech_role",
    options: [
      { label: "Read anyone's mind (like reading docs)", value: "backend" },
      { label: "Make anything beautiful instantly", value: "frontend" },
      { label: "Freeze time (more deadlines!)", value: "fullstack" },
      { label: "Teleport (skip commutes)", value: "pm" },
    ],
  },
  {
    id: 11,
    text: "Your Valentine's Day ideal:",
    trait: "personality",
    options: [
      { label: "Candlelit dinner & roses", value: "social" },
      { label: "Anti-Valentine party with friends", value: "resourceful" },
      { label: "Cozy movie marathon for two", value: "chill" },
      { label: "Surprise adventure date", value: "analytical" },
    ],
  },
  {
    id: 12,
    text: "Pick a coding emoji that represents you:",
    trait: "tech_role",
    options: [
      { label: "🧠 Brain (logic master)", value: "backend" },
      { label: "🎨 Palette (design guru)", value: "frontend" },
      { label: "🔥 Fire (ship fast)", value: "fullstack" },
      { label: "📋 Clipboard (organized PM)", value: "pm" },
    ],
  },
  {
    id: 13,
    text: "How do you handle conflict?",
    trait: "love_language",
    options: [
      { label: "Talk it out openly", value: "words" },
      { label: "Give space, then reconnect", value: "time" },
      { label: "Do something nice to make up", value: "service" },
      { label: "Write a long apology text", value: "gifts" },
    ],
  },
];

export const matchTitles = [
  "Perfect Debugging Duo 🐛",
  "Merge Conflict Soulmates 💕",
  "Co-founders in Love 🚀",
  "404: Loneliness Not Found 💘",
  "Git Commit Partners 💝",
  "Pair Programming Sweethearts 👩‍💻❤️👨‍💻",
  "Stack Overflow Soulmates 📚",
  "Deploy Together Forever 🌐",
  "Infinite Loop of Love ♾️",
  "Best Branch Match 🌿",
];
