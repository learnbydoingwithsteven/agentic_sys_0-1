'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface RedactionResult {
    original: string;
    redacted: string;
    detectedTypes: string[];
}

export async function redactPII(text: string, modelName: string = 'auto'): Promise<RedactionResult> {
    const systemPrompt = `You are a Privacy Guard Agent (DLP).
    Identify all Personally Identifiable Information (PII) in the text:
    - Emails
    - Credit Card Numbers
    - SSNs
    - Names (only full names)
    
    Return a JSON array of objects with the exact text to redact and its type:
    [{"text": "john@example.com", "type": "EMAIL"}, {"text": "123-456", "type": "SSN"}]
    
    Return STRICT JSON only.`;

    let redacted = text;
    const detected: string[] = [];

    try {
        const rawResponse = await queryLLM(systemPrompt, text, modelName, false);
        const piiItems = await extractJSON(rawResponse);

        if (Array.isArray(piiItems)) {
            for (const item of piiItems) {
                if (item.text && item.type) {
                    // Create a redaction placeholder
                    const placeholder = `[${item.type}_REDACTED]`;
                    // Global replace of that exact string
                    redacted = redacted.split(item.text).join(placeholder);
                    detected.push(item.type);
                }
            }
        }
    } catch (e) {
        console.error("PII Scan Failed", e);
        // Fallback to basic Regex if LLM fails
        // This hybrid approach is best practice anyway
        const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
        if (emailRegex.test(redacted)) {
            detected.push("EMAIL (Fallback)");
            redacted = redacted.replace(emailRegex, '[EMAIL_REDACTED]');
        }
    }

    // Deduplicate types
    const uniqueTypes = Array.from(new Set(detected));

    return {
        original: text,
        redacted,
        detectedTypes: uniqueTypes
    };
}
