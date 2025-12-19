'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getOllamaModels } from "@/actions/course_004_state_management/chat";

export type SchemaType = 'person' | 'event' | 'invoice' | 'mixed';

// Define the schemas for the prompt context
const SCHEMAS = {
    person: `
    {
        "full_name": "string",
        "email": "string | null",
        "phone": "string | null",
        "job_title": "string | null",
        "company": "string | null",
        "skills": ["string"]
    }`,
    event: `
    {
        "event_title": "string",
        "date": "string (YYYY-MM-DD)",
        "time": "string (HH:MM 24hr)",
        "location": "string | null",
        "attendees": ["string"],
        "is_virtual": "boolean"
    }`,
    invoice: `
    {
        "invoice_id": "string | null",
        "vendor_name": "string",
        "total_amount": "number",
        "currency": "string",
        "date": "string",
        "items": [
            { "description": "string", "quantity": "number", "price": "number" }
        ]
    }`,
    mixed: `
    {
        "people": [
             { "name": "string", "role": "string", "contact": "string | null" }
        ],
        "action_items": [
             { "task": "string", "assignee": "string", "deadline": "string | null" }
        ],
        "key_topics": ["string"]
    }`
};

export async function extractData(text: string, schemaType: SchemaType, model: string = "llama3.2") {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.1, // Zero creativity for extraction
        format: "json", // strict JSON mode
    });

    const promptTemplate = `
    You are a precise Data Extraction Agent. Your job is to convert unstructured text into structured JSON.
    
    Target Schema ({schemaType}):
    {schemaExample}

    Rules:
    1. Extract only facts present in the text.
    2. Use "null" if a field is missing.
    3. Return ONLY the valid JSON object.

    Input Text:
    "{text}"

    JSON Output:
    `;

    try {
        const prompt = PromptTemplate.fromTemplate(promptTemplate);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        const jsonStr = await chain.invoke({
            text,
            schemaType: schemaType.toUpperCase(),
            schemaExample: SCHEMAS[schemaType]
        });

        return {
            success: true,
            data: JSON.parse(jsonStr.trim()),
            schemaType
        };

    } catch (error) {
        console.error("Extraction Error:", error);
        return {
            success: false,
            data: null,
            error: "Failed to extract data. Ensure Ollama is running.",
            schemaType
        };
    }
}
