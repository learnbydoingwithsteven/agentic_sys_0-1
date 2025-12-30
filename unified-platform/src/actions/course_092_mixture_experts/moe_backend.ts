'use server';

export interface MoeLog {
    query: string;
    selectedExpert: 'CODE' | 'MATH' | 'GENERAL';
    confidence: number;
}

export async function processMoeRequest(query: string): Promise<MoeLog> {
    const qLower = query.toLowerCase();

    if (qLower.includes('function') || qLower.includes('python') || qLower.includes('bug')) {
        return { query, selectedExpert: 'CODE', confidence: 0.98 };
    }

    if (qLower.includes('calculate') || qLower.includes('multiply') || qLower.match(/\d+/)) {
        return { query, selectedExpert: 'MATH', confidence: 0.95 };
    }

    return { query, selectedExpert: 'GENERAL', confidence: 0.85 };
}
