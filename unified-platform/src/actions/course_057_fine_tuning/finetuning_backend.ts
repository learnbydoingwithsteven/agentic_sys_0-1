'use server';

export interface TrainingState {
    epoch: number;
    loss: number;
    completed: boolean;
}

export async function getPreTrainedOutput(input: string): Promise<string> {
    // Standard English
    if (input.includes("learn")) return "I am ready to learn new things.";
    if (input.includes("force")) return "The force is a mysterious power.";
    return "I am a helpful assistant.";
}

export async function getFineTunedOutput(input: string): Promise<string> {
    // Yoda style hardcoded simulation
    if (input.includes("learn")) return "Learn new things, ready I am.";
    if (input.includes("force")) return "Mysterious power, the force is.";
    return "Helpful, I am.";
}

export async function startTrainingSimulation(): Promise<void> {
    // Just a placeholder to confirm action triggered
    await new Promise(r => setTimeout(r, 100));
}
