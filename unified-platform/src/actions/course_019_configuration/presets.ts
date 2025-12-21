// Preset prompts for testing different configuration strategies

export const PRESET_PROMPTS = [
    {
        label: "Factual Question",
        query: "What is the capital of France?",
        bestStrategy: "minimal" as const,
        description: "Simple factual query - benefits from low temperature"
    },
    {
        label: "Creative Writing",
        query: "Write a short poem about artificial intelligence and human creativity",
        bestStrategy: "advanced" as const,
        description: "Creative task - benefits from high temperature"
    },
    {
        label: "Code Explanation",
        query: "Explain how a binary search algorithm works with an example",
        bestStrategy: "balanced" as const,
        description: "Technical explanation - benefits from balanced config"
    },
    {
        label: "Problem Solving",
        query: "How would you design a scalable microservices architecture for an e-commerce platform?",
        bestStrategy: "advanced" as const,
        description: "Complex reasoning - benefits from advanced config"
    },
    {
        label: "Quick Summary",
        query: "Summarize the concept of machine learning in one sentence",
        bestStrategy: "minimal" as const,
        description: "Concise response needed - benefits from minimal config"
    },
    {
        label: "Brainstorming",
        query: "Generate 5 innovative ideas for reducing carbon emissions in urban areas",
        bestStrategy: "advanced" as const,
        description: "Ideation task - benefits from creative config"
    }
];
