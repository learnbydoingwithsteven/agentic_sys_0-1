'use server';

export interface ReactStep {
    type: 'THOUGHT' | 'ACTION' | 'OBSERVATION' | 'ANSWER';
    content: string;
}

export async function runReactLoop(question: string): Promise<ReactStep[]> {
    const steps: ReactStep[] = [];

    // Determine scenario based on question
    if (question.toLowerCase().includes('age') && question.toLowerCase().includes('president')) {
        return [
            { type: 'THOUGHT', content: "I need to find the current president of the US and their birth date to calculate age." },
            { type: 'ACTION', content: "Search: 'current US president'" },
            { type: 'OBSERVATION', content: "Joe Biden is the 46th president of the United States." },
            { type: 'THOUGHT', content: "Now I need his birth date." },
            { type: 'ACTION', content: "Search: 'Joe Biden birth date'" },
            { type: 'OBSERVATION', content: "November 20, 1942" },
            { type: 'THOUGHT', content: "I can calculate 2024 - 1942 = 82." },
            { type: 'ANSWER', content: "Joe Biden is 82 years old." }
        ];
    } else {
        return [
            { type: 'THOUGHT', content: `I need to find information about '${question}'.` },
            { type: 'ACTION', content: `Search: '${question}'` },
            { type: 'OBSERVATION', content: "Found 14,000,000 results." },
            { type: 'THOUGHT', content: "I have enough info." },
            { type: 'ANSWER', content: "Here is a summary of the search results..." }
        ];
    }
}
