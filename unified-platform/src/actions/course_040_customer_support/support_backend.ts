'use server';

export interface Ticket {
    id: string;
    message: string;
    category: 'REFUND' | 'TECHNICAL' | 'GENERAL';
    sentiment: 'ANGRY' | 'NEUTRAL' | 'HAPPY';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export async function triageTicket(message: string): Promise<Ticket> {
    const lower = message.toLowerCase();

    // 1. Determine Category
    let category: Ticket['category'] = 'GENERAL';
    if (lower.includes('refund') || lower.includes('money') || lower.includes('charge')) category = 'REFUND';
    else if (lower.includes('crash') || lower.includes('error') || lower.includes('bug')) category = 'TECHNICAL';

    // 2. Determine Sentiment
    let sentiment: Ticket['sentiment'] = 'NEUTRAL';

    // Check Happy First (Prioritize positive signal)
    if (lower.includes('love') || lower.includes('great') || lower.includes('thanks') || lower.includes('amazing')) {
        sentiment = 'HAPPY';
    }
    // Then Check Angry
    else if (lower.includes('hate') || lower.includes('terrible') || lower.includes('stupid') || lower.includes('worst')) {
        sentiment = 'ANGRY';
    }

    // 3. Determine Priority (Angry + Refund = High)
    let priority: Ticket['priority'] = 'LOW';
    if (sentiment === 'ANGRY' || category === 'REFUND') priority = 'HIGH';
    if (category === 'TECHNICAL') priority = 'MEDIUM';

    // Mock processing delay
    await new Promise(r => setTimeout(r, 500));

    return {
        id: Math.random().toString(36).substr(2, 9),
        message,
        category,
        sentiment,
        priority
    };
}
