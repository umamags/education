const dimensions = [
  "🧠 Cognitive",
  "🗣️ Language",
  "🏃 Physical",
  "❤️ Social",
  "😊 Emotional",
  "🔍 Curiosity",
  "📚 Learning",
  "🌱 Independence"
];

function createPrompt(age) {
  return `You are an expert child development specialist. IMPORTANT: Return ONLY valid JSON, no markdown, no extra text.

Create a JSON response with developmental information for a ${age}-year-old child.

For each of these 8 dimensions, provide:
1. Typical developmental milestones and skills at this age (3-4 milestones)
2. Suggested activities and learning opportunities (3-4 activities)
3. What parents/caregivers should watch for (3-4 indicators)

Dimensions:
1. Cognitive - Thinking, reasoning, memory, problem solving
2. Language - Listening, speaking, vocabulary, reading, writing
3. Physical - Gross motor, fine motor, coordination, strength
4. Social - Sharing, cooperation, friendships, empathy
5. Emotional - Self-awareness, regulation, resilience
6. Curiosity - Questions, exploration, experimentation
7. Learning - Attention, persistence, learning strategies
8. Independence - Self-care, responsibility, decision-making

Return ONLY this JSON structure (no markdown, no extra text):
{
  "age": ${age},
  "dimensions": [
    {
      "title": "Cognitive",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "watchFor": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "title": "Language",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "watchFor": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "title": "Physical",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "watchFor": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "title": "Social",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "watchFor": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "title": "Emotional",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "watchFor": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "title": "Curiosity",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "watchFor": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "title": "Learning",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "watchFor": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "title": "Independence",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "watchFor": ["indicator 1", "indicator 2", "indicator 3"]
    }
  ]
}`;
}

export { createPrompt, dimensions };
