'use server';

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Schemas ---

export interface SupportTicket {
    category: 'Billing' | 'Technical' | 'Feature Request' | 'Other';
    urgency: 'Low' | 'Medium' | 'High' | 'Critical';
    customer_sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Angry';
    summary: string;
    next_action_suggestion: string;
}

export interface InvoiceData {
    invoice_number: string;
    date: string;
    vendor_name: string;
    items: { description: string; amount: number }[];
    total_amount: number;
    currency: string;
}

// --- Prompt Templates ---

const TICKET_PROMPT = `
You are a Data Extraction Assistant. 
Analyze the following customer support email and extract structured data.
Return ONLY a valid JSON object matching this schema:

\`\`\`json
{{
    "category": "Billing | Technical | Feature Request | Other",
    "urgency": "Low | Medium | High | Critical",
    "customer_sentiment": "Positive | Neutral | Negative | Angry",
    "summary": "Brief 1-sentence summary of the issue",
    "next_action_suggestion": "Recommended next step for support agent"
}}
\`\`\`

Input Text:
{input}
`;

const INVOICE_PROMPT = `
You are a Data Extraction Assistant.
Analyze the following invoice text/OCR dump and extract structured data.
Return ONLY a valid JSON object matching this schema:

\`\`\`json
{{
    "invoice_number": "string",
    "date": "YYYY-MM-DD",
    "vendor_name": "string",
    "items": [
        {{ "description": "string", "amount": 0.00 }}
    ],
    "total_amount": 0.00,
    "currency": "USD | EUR | etc"
}}
\`\`\`

Input Text:
{input}
`;

// --- Action ---

export type ExtractionResult =
    | { type: 'ticket', data: SupportTicket }
    | { type: 'invoice', data: InvoiceData }
    | { type: 'error', error: string };

export async function extractData(
    text: string,
    schemaType: 'ticket' | 'invoice',
    model: string = "llama3.2"
): Promise<ExtractionResult> {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0, // Deterministic
        format: "json"
    });

    const template = schemaType === 'ticket' ? TICKET_PROMPT : INVOICE_PROMPT;

    const chain = ChatPromptTemplate.fromTemplate(template)
        .pipe(llm)
        .pipe(new StringOutputParser());

    try {
        const resultJson = await chain.invoke({ input: text });

        // Cleanup JSON
        const cleanJson = resultJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        if (schemaType === 'ticket') {
            return { type: 'ticket', data: parsed as SupportTicket };
        } else {
            return { type: 'invoice', data: parsed as InvoiceData };
        }

    } catch (e) {
        console.error("Extraction error:", e);
        return { type: 'error', error: "Failed to parse structured data." };
    }
}
