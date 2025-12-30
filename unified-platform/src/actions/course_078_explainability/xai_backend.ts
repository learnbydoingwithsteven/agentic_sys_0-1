'use server';

export interface Explanation {
    decision: 'APPROVED' | 'DENIED';
    score: number;
    factors: { name: string, impact: number }[]; // Impact is +/- score contribution
}

export async function explainDecision(creditScore: number, income: number, debt: number): Promise<Explanation> {
    // Simple Logic Model
    let score = 0;
    const factors: { name: string, impact: number }[] = [];

    // 1. Credit Score Impact
    const creditImpact = (creditScore - 600) * 0.5;
    score += creditImpact;
    factors.push({ name: 'Credit Score', impact: creditImpact });

    // 2. Income Impact
    const incomeImpact = (income - 30000) / 1000;
    score += incomeImpact;
    factors.push({ name: 'Annual Income', impact: incomeImpact });

    // 3. Debt Impact
    const debtImpact = -(debt / 500);
    score += debtImpact;
    factors.push({ name: 'Total Debt', impact: debtImpact });

    return {
        decision: score > 50 ? 'APPROVED' : 'DENIED',
        score: Math.round(score),
        factors
    };
}
