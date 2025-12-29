'use server';

// In-memory knowledge base for the session
const knowledgeBase: Record<string, string> = {};

export async function askAgent(question: string): Promise<{ answer: string, confidence: number, fromMemory: boolean }> {
    const qKey = question.toLowerCase().trim();

    // Check learned memory first
    if (knowledgeBase[qKey]) {
        return { answer: knowledgeBase[qKey], confidence: 1.0, fromMemory: true };
    }

    // Default "Training Data" (simulated wrong/incomplete)
    if (qKey.includes("canada")) return { answer: "Toronto", confidence: 0.8, fromMemory: false };
    if (qKey.includes("ceo of twitter")) return { answer: "Jack Dorsey", confidence: 0.7, fromMemory: false }; // Outdated info

    return { answer: "I don't know that yet.", confidence: 0.1, fromMemory: false };
}

export async function teachAgent(question: string, correctAnswer: string): Promise<void> {
    const qKey = question.toLowerCase().trim();
    knowledgeBase[qKey] = correctAnswer;
}

export async function resetBrain(): Promise<void> {
    for (const key in knowledgeBase) delete knowledgeBase[key];
}
