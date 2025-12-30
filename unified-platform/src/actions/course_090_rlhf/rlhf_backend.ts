'use server';

export interface RLHFPair {
    id: string;
    prompt: string;
    optionA: string;
    optionB: string;
}

export async function getTrainingPair(): Promise<RLHFPair> {
    return {
        id: Math.random().toString(),
        prompt: "Write a haiku about code.",
        optionA: "Code is very functional. It runs on machines all day. I like typescript.",
        optionB: "Logic flows like streams,\nSilicon dreams come alive,\nBugs fade in the light."
    };
}

export async function submitPreference(choice: 'A' | 'B'): Promise<number> {
    // Return new "Alignment Score"
    return Math.random() * 10 + 90; // Mock score
}
