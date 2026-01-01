'use server';

import { queryLLM } from '@/lib/llm_helper';
import { writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export interface CodeExecutionResult {
    code: string;
    output: string;
    status: 'success' | 'error';
}

export async function executeCodeAgent(prompt: string, modelName: string = 'auto'): Promise<CodeExecutionResult> {
    try {
        // 1. Generate Code using LLM
        const systemPrompt = `You are an expert Python programmer.
Your job is to write valid, executable Python code to solve the user's problem.

CRITICAL RULES:
1. Return ONLY the raw Python code. No markdown formatting (no \`\`\`).
2. The code MUST print the final result to stdout using \`print()\`. If the user asks for a calculation, print the answer.
3. Import necessary standard libraries (math, random, datetime, json, etc.).
4. Do NOT ask for user input (input()). Hardcode example values if needed.
5. Keep it simple and efficient.`;

        const userPrompt = `Task: ${prompt}

Write a Python script to accomplish this. ensure the result is printed.`;

        let generatedCode = await queryLLM(systemPrompt, userPrompt, modelName, false);

        // Cleanup markdown if LLM includes it
        generatedCode = generatedCode
            .replace(/```python/g, '')
            .replace(/```/g, '')
            .trim();

        // 2. Execute Code (Real Python Process)
        const tempFileName = `agent_exec_${Date.now()}_${Math.random().toString(36).slice(2)}.py`;
        const tempFilePath = path.join(os.tmpdir(), tempFileName);

        let output = "";
        let status: 'success' | 'error' = 'success';

        try {
            // Write code to temp file
            await writeFile(tempFilePath, generatedCode);

            // Execute with timeout (5 seconds)
            const { stdout, stderr } = await execAsync(`python "${tempFilePath}"`, {
                timeout: 5000,
                maxBuffer: 1024 * 1024 // 1MB output limit
            });

            if (stderr) {
                // Check if it's just a warning or an actual error
                if (stderr.toLowerCase().includes('error')) {
                    output = `STDERR:\n${stderr}\n\nSTDOUT:\n${stdout}`;
                    status = 'error';
                } else {
                    // Treat warnings as success but show them
                    output = `${stdout}\n\n(Warnings:\n${stderr})`;
                }
            } else {
                output = stdout.trim();
                if (!output) output = "(No output printed to stdout)";
            }

        } catch (error: any) {
            status = 'error';
            // Clean up error message
            const msg = error.message || String(error);
            if (msg.includes('idled')) {
                output = "Error: Execution timed out (max 5 seconds).";
            } else {
                output = `Execution Failed:\n${error.stderr || error.message}`;
            }
        } finally {
            // Cleanup temp file
            try {
                await unlink(tempFilePath);
            } catch (e) {
                console.error("Failed to cleanup temp file:", e);
            }
        }

        return {
            code: generatedCode,
            output,
            status
        };

    } catch (error) {
        console.error("Code generation/execution failed:", error);

        return {
            code: "# Error generating code",
            output: `System Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            status: 'error'
        };
    }
}
