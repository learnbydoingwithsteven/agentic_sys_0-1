'use server';

export interface SafetyScore {
    safe: boolean;
    categories: {
        hate: number;
        violence: number;
        self_harm: number;
        sexual: number;
    };
    flagged: boolean;
}

export async function checkContentSafety(text: string): Promise<SafetyScore> {
    const t = text.toLowerCase();

    // Naive keywords for demo simulation
    // In production, use existing Safety Models (Llama Guard etc.)
    const result = {
        safe: true,
        categories: { hate: 0.01, violence: 0.01, self_harm: 0.01, sexual: 0.01 },
        flagged: false
    };

    if (t.includes("kill") || t.includes("hurt") || t.includes("attack")) {
        result.categories.violence = 0.95;
        result.safe = false;
        result.flagged = true;
    }

    if (t.includes("hate") || t.includes("stupid") || t.includes("idiot")) {
        result.categories.hate = 0.88;
        result.safe = false;
        result.flagged = true;
    }

    return result;
}
