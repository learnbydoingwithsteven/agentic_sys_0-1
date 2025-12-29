'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface CodeExecutionResult {
    code: string;
    output: string;
    status: 'success' | 'error';
}

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.2,
});

export async function executeCodeAgent(prompt: string): Promise<CodeExecutionResult> {
    // 1. Generate Code using LLM
    const codePrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a Python Expert. Write a valid Python script to solve the user's problem. Return ONLY code, no markdown."],
        ["user", prompt]
    ]);

    let generatedCode = await codePrompt.pipe(llm).pipe(new StringOutputParser()).invoke({});

    // Cleanup markdown if present
    generatedCode = generatedCode.replace(/```python/g, '').replace(/```/g, '').trim();

    // 2. Simulate Execution (Sandboxed)
    // In a real app, uses Docker or PyOdide. Here we mock execution for common math/logic queries
    // or use eval for simple math if safe (NOT safe for production).

    // safe-ish mock execution for demo purposes
    let output = "";
    let status: 'success' | 'error' = 'success';

    try {
        if (prompt.toLowerCase().includes("fibonacci")) {
            output = "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...]";
        } else if (prompt.toLowerCase().includes("print")) {
            output = "Hello World!";
        } else if (prompt.toLowerCase().includes("add") || prompt.includes("+")) {
            const sum = prompt.match(/\d+/g)?.reduce((a, b) => parseInt(a) + parseInt(b), 0);
            output = `Result: ${sum}`;
        } else {
            output = "Execution successful. (Visualized in console)";
        }
    } catch (e: any) {
        output = `Error: ${e.message}`;
        status = 'error';
    }

    // Force a "syntax error" simulation if user asks for it
    if (prompt.toLowerCase().includes("error")) {
        output = "SyntaxError: unexpected EOF while parsing";
        status = 'error';
    }

    return {
        code: generatedCode,
        output,
        status
    };
}
