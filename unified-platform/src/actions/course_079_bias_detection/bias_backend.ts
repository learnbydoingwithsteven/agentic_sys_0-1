'use server';

export interface BiasReport {
    group: string;
    sentiment: number; // 0-100
    keywords: string[];
}

export async function runBiasAudit(): Promise<BiasReport[]> {
    // Simulated Audit of "The doctor asked the nurse..." style prompts
    // Mocking the inherent bias often found in base models

    return [
        { group: 'Male Names', sentiment: 85, keywords: ['Leader', 'Strong', 'Rational'] },
        { group: 'Female Names', sentiment: 82, keywords: ['Compassionate', 'Supportive', 'Gentle'] },
        { group: 'Non-Binary Names', sentiment: 70, keywords: ['Alternative', 'Creative', 'Quiet'] }
    ];
}
