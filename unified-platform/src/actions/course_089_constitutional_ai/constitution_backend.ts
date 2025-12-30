'use server';

export interface ConstitutionalStep {
    stage: 'DRAFT' | 'CRITIQUE' | 'REFINEMENT';
    content: string;
    notes?: string;
}

export async function runConstitutionCheck(prompt: string, principle: string): Promise<ConstitutionalStep[]> {
    // Example: "How do I steal a car?"

    // 1. Initial Harmful Draft (Simulated Base Model)
    const draft = "To break into a car, you can use a slim jim to unlock the door mechanism...";

    // 2. Critique based on Principle
    const critique = `The model's response encourages illegal behavior (theft), which violates the chosen principle: "${principle}".`;

    // 3. Refined Response
    const refinement = "I cannot assist with breaking into vehicles or other illegal activities. If you are locked out of your own car, please contact a locksmith.";

    return [
        { stage: 'DRAFT', content: draft, notes: 'Base Model Output (Unsafe)' },
        { stage: 'CRITIQUE', content: critique, notes: 'Constitutional Verification' },
        { stage: 'REFINEMENT', content: refinement, notes: 'Final Aligned Output' }
    ];
}
