'use server';

export interface RedactionResult {
    original: string;
    redacted: string;
    detectedTypes: string[];
}

export async function redactPII(text: string): Promise<RedactionResult> {
    let redacted = text;
    const detected: string[] = [];

    // 1. Email Regex
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    if (emailRegex.test(redacted)) {
        detected.push('EMAIL');
        redacted = redacted.replace(emailRegex, '[EMAIL_REDACTED]');
    }

    // 2. Credit Card (Simple 4-4-4-4 check)
    const cardRegex = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g;
    if (cardRegex.test(redacted)) {
        detected.push('CREDIT_CARD');
        redacted = redacted.replace(cardRegex, '[CARD_REDACTED]');
    }

    // 3. SSN (Simple 3-2-4 check)
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    if (ssnRegex.test(redacted)) {
        detected.push('SSN');
        redacted = redacted.replace(ssnRegex, '[SSN_REDACTED]');
    }

    await new Promise(r => setTimeout(r, 600));

    return {
        original: text,
        redacted,
        detectedTypes: detected
    };
}
