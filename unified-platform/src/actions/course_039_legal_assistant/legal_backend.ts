'use server';

export interface LegalClause {
    id: string;
    type: 'RISK' | 'OBLIGATION' | 'NEUTRAL';
    text: string;
    explanation: string;
}

export async function analyzeContract(text: string): Promise<LegalClause[]> {
    const clauses: LegalClause[] = [];

    // Mock Analysis Logic
    if (text.toLowerCase().includes('termination')) {
        clauses.push({
            id: '1',
            type: 'RISK',
            text: 'Termination for Convenience',
            explanation: 'This clause allows the other party to end the contract without cause. Ensure notice period is sufficient.'
        });
    }

    if (text.toLowerCase().includes('indemnify')) {
        clauses.push({
            id: '2',
            type: 'OBLIGATION',
            text: 'Indemnification',
            explanation: 'You are agreeing to cover specific losses. Verify scope of liability.'
        });
    }

    if (text.toLowerCase().includes('jurisdiction')) {
        clauses.push({
            id: '3',
            type: 'NEUTRAL',
            text: 'Governing Law',
            explanation: 'Standard jurisdiction clause. Check if location is favorable.'
        });
    }

    if (clauses.length === 0) {
        clauses.push({
            id: '4',
            type: 'NEUTRAL',
            text: 'General Review',
            explanation: 'No specific high-risk keywords detected in this snippet.'
        });
    }

    return clauses;
}
