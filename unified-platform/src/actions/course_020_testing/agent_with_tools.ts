'use server'

import { ChatOllama } from "@langchain/ollama";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// Define agent tools
const calculatorTool = new DynamicStructuredTool({
    name: "calculator",
    description: "Performs basic arithmetic operations. Use this when you need to calculate numbers.",
    schema: z.object({
        operation: z.enum(["add", "subtract", "multiply", "divide"]),
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    }),
    func: async ({ operation, a, b }) => {
        switch (operation) {
            case "add": return String(a + b);
            case "subtract": return String(a - b);
            case "multiply": return String(a * b);
            case "divide": return b !== 0 ? String(a / b) : "Error: Division by zero";
            default: return "Unknown operation";
        }
    },
});

const factCheckerTool = new DynamicStructuredTool({
    name: "fact_checker",
    description: "Checks factual information about world capitals, countries, and basic geography.",
    schema: z.object({
        query: z.string().describe("The factual query to check"),
    }),
    func: async ({ query }) => {
        const facts: Record<string, string> = {
            "capital of france": "Paris",
            "capital of japan": "Tokyo",
            "capital of germany": "Berlin",
            "capital of italy": "Rome",
            "capital of spain": "Madrid",
        };

        const normalized = query.toLowerCase();
        for (const [key, value] of Object.entries(facts)) {
            if (normalized.includes(key)) {
                return value;
            }
        }
        return "Fact not found in database";
    },
});

// Agent with tool-calling capability
export async function runAgentWithTools(
    query: string,
    model: string = "llama3.2"
): Promise<{ answer: string; toolCalls: Array<{ tool: string; input: any; output: string }>; reasoning: string }> {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.3,
    });

    const tools = [calculatorTool, factCheckerTool];
    const toolCalls: Array<{ tool: string; input: any; output: string }> = [];

    // Step 1: Analyze query and determine if tools are needed
    const analysisPrompt = `You are an intelligent agent. Analyze this query and determine if you need to use tools.

Available tools:
- calculator: For math operations (add, subtract, multiply, divide)
- fact_checker: For checking world capitals and geography facts

Query: "${query}"

If you need a tool, respond with JSON: {"tool": "tool_name", "reasoning": "why you need it"}
If you don't need a tool, respond with JSON: {"tool": "none", "reasoning": "why you can answer directly"}

Response:`;

    const analysisResponse = await llm.invoke(analysisPrompt);
    const analysisText = typeof analysisResponse.content === 'string'
        ? analysisResponse.content
        : JSON.stringify(analysisResponse.content);

    let reasoning = "Direct answer without tools";

    // Try to parse tool decision
    try {
        const jsonMatch = analysisText.match(/\{[^}]+\}/);
        if (jsonMatch) {
            const decision = JSON.parse(jsonMatch[0]);
            reasoning = decision.reasoning || reasoning;

            // Step 2: If tool is needed, execute it
            if (decision.tool && decision.tool !== "none") {
                if (decision.tool === "calculator") {
                    // Extract math operation
                    const mathMatch = query.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
                    if (mathMatch) {
                        const a = parseFloat(mathMatch[1]);
                        const b = parseFloat(mathMatch[3]);
                        const opMap: Record<string, "add" | "subtract" | "multiply" | "divide"> = {
                            '+': 'add',
                            '-': 'subtract',
                            '*': 'multiply',
                            '/': 'divide'
                        };
                        const operation = opMap[mathMatch[2]];

                        const result = await calculatorTool.invoke({ operation, a, b });
                        toolCalls.push({
                            tool: "calculator",
                            input: { operation, a, b },
                            output: result
                        });

                        return {
                            answer: `The answer is ${result}`,
                            toolCalls,
                            reasoning
                        };
                    }
                } else if (decision.tool === "fact_checker") {
                    const result = await factCheckerTool.invoke({ query });
                    toolCalls.push({
                        tool: "fact_checker",
                        input: { query },
                        output: result
                    });

                    return {
                        answer: result,
                        toolCalls,
                        reasoning
                    };
                }
            }
        }
    } catch (e) {
        // If parsing fails, continue with direct answer
    }

    // Step 3: Generate direct answer if no tool was used
    const directResponse = await llm.invoke(query);
    const answer = typeof directResponse.content === 'string'
        ? directResponse.content
        : JSON.stringify(directResponse.content);

    return {
        answer,
        toolCalls,
        reasoning
    };
}
