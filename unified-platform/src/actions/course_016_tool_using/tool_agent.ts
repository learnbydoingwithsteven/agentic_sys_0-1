'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export type AgentMode = 'vanilla' | 'tool_enabled';

export interface ToolCall {
    tool: string;
    input: string;
    output: string;
    timestamp: number;
}

export interface AgentResponse {
    success: boolean;
    output: string;
    toolCalls?: ToolCall[];
    reasoning?: string;
    mode: AgentMode;
    error?: string;
}

// Tool implementations
const tools = {
    calculator: async (expression: string): Promise<string> => {
        try {
            // Safe eval using Function constructor (limited scope)
            const result = Function(`'use strict'; return (${expression})`)();
            return `The result of ${expression} is ${result}`;
        } catch (error) {
            return `Error calculating ${expression}: ${String(error)}`;
        }
    },

    get_weather: async (city: string): Promise<string> => {
        // Simulated weather data
        const weatherData: Record<string, any> = {
            "london": { temp: 12, condition: "Rainy", humidity: 85 },
            "paris": { temp: 15, condition: "Cloudy", humidity: 70 },
            "tokyo": { temp: 22, condition: "Sunny", humidity: 60 },
            "new york": { temp: 8, condition: "Snowy", humidity: 75 },
            "sydney": { temp: 28, condition: "Sunny", humidity: 55 }
        };

        const cityLower = city.toLowerCase();
        const weather = weatherData[cityLower] || { temp: 20, condition: "Clear", humidity: 65 };

        return `Weather in ${city}: ${weather.condition}, ${weather.temp}°C, Humidity: ${weather.humidity}%`;
    },

    get_current_time: async (): Promise<string> => {
        const now = new Date();
        return `Current time: ${now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        })}`;
    }
};

const TOOL_DESCRIPTIONS = `
Available Tools:
1. calculator - Performs mathematical calculations. Use for any math questions. Format: calculator(expression)
2. get_weather - Gets current weather for a city. Format: get_weather(city_name)
3. get_current_time - Gets the current date and time. Format: get_current_time()
`;

export async function runToolAgent(
    query: string,
    mode: AgentMode = 'tool_enabled',
    model: string = "llama3.2"
): Promise<AgentResponse> {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0,
    });

    if (mode === 'vanilla') {
        // Vanilla mode: Just ask the LLM directly without tools
        try {
            const prompt = PromptTemplate.fromTemplate(
                "Answer the following question to the best of your ability:\n\n{query}"
            );
            const chain = prompt.pipe(llm).pipe(new StringOutputParser());
            const response = await chain.invoke({ query });

            return {
                success: true,
                output: response,
                mode: 'vanilla'
            };
        } catch (error) {
            return {
                success: false,
                output: "",
                error: String(error),
                mode: 'vanilla'
            };
        }
    } else {
        // Tool-enabled mode: Analyze query and use tools
        try {
            const toolCalls: ToolCall[] = [];

            // Step 1: Ask LLM to analyze the query and decide which tool(s) to use
            const analysisPrompt = PromptTemplate.fromTemplate(`
${TOOL_DESCRIPTIONS}

Analyze this query and determine which tool(s) to use. Respond ONLY with the tool call(s) in this exact format:
TOOL: tool_name(argument)

If multiple tools are needed, list each on a new line.
If no tools are needed, respond with: NO_TOOLS

Query: {query}
`);

            const analysisChain = analysisPrompt.pipe(llm).pipe(new StringOutputParser());
            const analysis = await analysisChain.invoke({ query });

            let toolResults: string[] = [];

            // Step 2: Parse and execute tool calls
            if (!analysis.includes('NO_TOOLS')) {
                const toolCallMatches = analysis.match(/TOOL:\s*(\w+)\((.*?)\)/g);

                if (toolCallMatches) {
                    for (const match of toolCallMatches) {
                        const [, toolName, args] = match.match(/TOOL:\s*(\w+)\((.*?)\)/) || [];

                        if (toolName && toolName in tools) {
                            const startTime = Date.now();
                            const toolFunc = tools[toolName as keyof typeof tools];
                            const result = await toolFunc(args.replace(/['"]/g, ''));

                            toolCalls.push({
                                tool: toolName,
                                input: args.replace(/['"]/g, ''),
                                output: result,
                                timestamp: startTime
                            });

                            toolResults.push(result);
                        }
                    }
                }
            }

            // Step 3: Generate final answer using tool results
            let finalAnswer: string;

            if (toolResults.length > 0) {
                const finalPrompt = PromptTemplate.fromTemplate(`
Original Question: {query}

Tool Results:
{toolResults}

Using the tool results above, provide a clear, natural answer to the original question. Do not mention the tools or explain how you got the answer - just provide the answer naturally.
`);

                const finalChain = finalPrompt.pipe(llm).pipe(new StringOutputParser());
                finalAnswer = await finalChain.invoke({
                    query,
                    toolResults: toolResults.join('\n\n')
                });
            } else {
                // No tools needed, just answer directly
                const directPrompt = PromptTemplate.fromTemplate(
                    "Answer the following question:\n\n{query}"
                );
                const directChain = directPrompt.pipe(llm).pipe(new StringOutputParser());
                finalAnswer = await directChain.invoke({ query });
            }

            return {
                success: true,
                output: finalAnswer,
                toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                mode: 'tool_enabled'
            };

        } catch (error) {
            return {
                success: false,
                output: "",
                error: String(error),
                mode: 'tool_enabled'
            };
        }
    }
}
