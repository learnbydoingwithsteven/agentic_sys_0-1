'use server';

export interface FactCheck {
    sentence: string;
    isHallucinated: boolean;
    reason?: string;
}

export async function checkHallucination(source: string, response: string): Promise<FactCheck[]> {
    const sentences = response.split('.').filter(s => s.trim().length > 0);
    const results: FactCheck[] = [];

    for (const s of sentences) {
        const trimmed = s.trim();
        let isHallucinated = false;
        let reason = undefined;

        // Mock Logic: If sentence contains a number/date that IS NOT in source -> Hallucination
        const numbersInSentence = trimmed.match(/\d+/g) || [];
        for (const num of numbersInSentence) {
            if (!source.includes(num)) {
                isHallucinated = true;
                reason = `The number/date "${num}" appears in the answer but NOT in the source text.`;
            }
        }

        // Mock Logic: Check for key entities (simplistic)
        if (trimmed.includes("Mars") && !source.includes("Mars")) {
            isHallucinated = true;
            reason = "Entity 'Mars' mentioned but not found in source.";
        }

        results.push({
            sentence: trimmed + '.',
            isHallucinated,
            reason
        });
    }

    // Artificial delay
    await new Promise(r => setTimeout(r, 600));

    return results;
}
