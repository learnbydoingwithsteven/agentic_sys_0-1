'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { FileType, ProcessingTask } from "./constants";

export interface FileProcessingRequest {
    fileContent: string;
    fileType: FileType;
    task: ProcessingTask;
    customInstruction?: string;
}

export interface FileProcessingResponse {
    success: boolean;
    result: string;
    metadata?: {
        fileType: FileType;
        task: ProcessingTask;
        recordCount?: number;
        keyFields?: string[];
        processingTime?: number;
    };
    error?: string;
}

// Parse CSV content
function parseCSV(content: string): { headers: string[], rows: string[][] } {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line =>
        line.split(',').map(cell => cell.trim())
    );
    return { headers, rows };
}

// Parse JSON content
function parseJSON(content: string): any {
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
}

// Extract text from simulated PDF (in real app, use pdf-parse library)
function extractPDFText(content: string): string {
    // For demo purposes, we'll treat it as plain text
    // In production, use libraries like pdf-parse or pdfjs-dist
    return content;
}

export async function processFile(
    request: FileProcessingRequest,
    model: string = "llama3.2"
): Promise<FileProcessingResponse> {

    const startTime = Date.now();

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.3,
    });

    try {
        let structuredData: any;
        let metadata: FileProcessingResponse['metadata'] = {
            fileType: request.fileType,
            task: request.task
        };

        // Step 1: Parse file based on type
        switch (request.fileType) {
            case 'csv': {
                const { headers, rows } = parseCSV(request.fileContent);
                structuredData = { headers, rows, recordCount: rows.length };
                metadata.recordCount = rows.length;
                metadata.keyFields = headers;
                break;
            }
            case 'json': {
                structuredData = parseJSON(request.fileContent);
                if (Array.isArray(structuredData)) {
                    metadata.recordCount = structuredData.length;
                    if (structuredData.length > 0) {
                        metadata.keyFields = Object.keys(structuredData[0]);
                    }
                } else {
                    metadata.keyFields = Object.keys(structuredData);
                }
                break;
            }
            case 'pdf': {
                structuredData = extractPDFText(request.fileContent);
                break;
            }
            case 'txt': {
                structuredData = request.fileContent;
                break;
            }
        }

        // Step 2: Build task-specific prompt
        let taskPrompt: string;

        switch (request.task) {
            case 'summarize':
                taskPrompt = `Summarize the following ${request.fileType.toUpperCase()} file content. Provide a concise overview of the key information, patterns, and insights.\n\nFile Content:\n${JSON.stringify(structuredData, null, 2)}\n\nSummary:`;
                break;

            case 'extract':
                taskPrompt = `Extract key information from the following ${request.fileType.toUpperCase()} file. Identify important entities, dates, numbers, and facts.\n\nFile Content:\n${JSON.stringify(structuredData, null, 2)}\n\nExtracted Information:`;
                break;

            case 'analyze':
                taskPrompt = `Analyze the following ${request.fileType.toUpperCase()} file content. Identify trends, patterns, anomalies, and provide insights.\n\nFile Content:\n${JSON.stringify(structuredData, null, 2)}\n\nAnalysis:`;
                break;

            case 'transform':
                const instruction = request.customInstruction || 'Convert this data to a different format';
                taskPrompt = `Transform the following ${request.fileType.toUpperCase()} file content according to these instructions: ${instruction}\n\nFile Content:\n${JSON.stringify(structuredData, null, 2)}\n\nTransformed Output:`;
                break;
        }

        // Step 3: Process with LLM
        const result = await llm.invoke(taskPrompt);
        const parsedResult = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);

        metadata.processingTime = Date.now() - startTime;

        return {
            success: true,
            result: parsedResult,
            metadata
        };

    } catch (error) {
        return {
            success: false,
            result: "",
            error: String(error),
            metadata: {
                fileType: request.fileType,
                task: request.task,
                processingTime: Date.now() - startTime
            }
        };
    }
}
