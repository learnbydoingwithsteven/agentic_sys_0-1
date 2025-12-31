'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface Triple {
    subject: string;
    predicate: string;
    object: string;
}

export async function extractTriples(text: string, modelName: string = 'auto'): Promise<Triple[]> {
    try {
        const systemPrompt = `You are a knowledge graph extraction system.
Your job is to extract entity-relationship triples from unstructured text.

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, just the JSON array.

Format:
[
  { "subject": "Entity1", "predicate": "RELATIONSHIP", "object": "Entity2" },
  { "subject": "Entity3", "predicate": "PROPERTY", "object": "Value" },
  ...
]

Rules:
- Extract ALL meaningful relationships from the text
- subject and object should be entities (people, places, organizations, concepts)
- predicate should be the relationship type in UPPERCASE (e.g., "WORKS_AT", "CEO_OF", "LOCATED_IN", "HAS_PROPERTY")
- Be specific and accurate
- Extract 1-5 triples depending on text complexity
- Return ONLY the JSON array, nothing else`;

        const userPrompt = `Text: "${text}"

Extract knowledge graph triples from this text.`;

        const rawResponse = await queryLLM(systemPrompt, userPrompt, modelName, false);
        const parsed = await extractJSON(rawResponse);

        if (!Array.isArray(parsed)) {
            throw new Error("Response is not an array");
        }

        // Validate and normalize triples
        const triples: Triple[] = parsed
            .filter((t: any) => t.subject && t.predicate && t.object)
            .map((t: any) => ({
                subject: String(t.subject).trim(),
                predicate: String(t.predicate).toUpperCase().replace(/\s+/g, '_'),
                object: String(t.object).trim()
            }))
            .slice(0, 10); // Limit to 10 triples for visualization

        if (triples.length === 0) {
            throw new Error("No valid triples extracted");
        }

        return triples;

    } catch (error) {
        console.error("Triple extraction failed:", error);

        // Fallback: Simple pattern matching for common cases
        const fallbackTriples: Triple[] = [];

        // Pattern: "X is Y" or "X is a Y"
        const isMatch = text.match(/(\w+(?:\s+\w+)*)\s+is\s+(?:a\s+|an\s+|the\s+)?(\w+(?:\s+\w+)*)/i);
        if (isMatch) {
            fallbackTriples.push({
                subject: isMatch[1].trim(),
                predicate: "IS_A",
                object: isMatch[2].trim()
            });
        }

        // Pattern: "X works at Y" or "X is CEO of Y"
        const worksMatch = text.match(/(\w+(?:\s+\w+)*)\s+(?:works at|is CEO of|founded|created)\s+(\w+(?:\s+\w+)*)/i);
        if (worksMatch) {
            const predicate = text.toLowerCase().includes('ceo') ? 'CEO_OF' :
                text.toLowerCase().includes('founded') ? 'FOUNDED' :
                    text.toLowerCase().includes('created') ? 'CREATED' : 'WORKS_AT';
            fallbackTriples.push({
                subject: worksMatch[1].trim(),
                predicate,
                object: worksMatch[2].trim()
            });
        }

        // Pattern: "X owns Y" or "X has Y"
        const ownsMatch = text.match(/(\w+(?:\s+\w+)*)\s+(?:owns|has)\s+(\w+(?:\s+\w+)*)/i);
        if (ownsMatch) {
            fallbackTriples.push({
                subject: ownsMatch[1].trim(),
                predicate: text.toLowerCase().includes('owns') ? 'OWNS' : 'HAS',
                object: ownsMatch[2].trim()
            });
        }

        if (fallbackTriples.length > 0) {
            return fallbackTriples;
        }

        // Ultimate fallback
        return [{
            subject: "System",
            predicate: "ERROR",
            object: "Could not extract triples"
        }];
    }
}
