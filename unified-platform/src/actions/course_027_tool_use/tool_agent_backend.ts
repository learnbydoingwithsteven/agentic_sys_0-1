'use server';

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Tools Implementation ---
function executeCalculator(expression: string): string {
    // Sanitized eval for demo
    try {
        // Remove non-math chars for safety
        const safeExpr = expression.replace(/[^0-9+\-*/().]/g, '');
        return String(eval(safeExpr));
    } catch (e) {
        return "Error calculating.";
    }
}

function executeWeather(city: string): string {
    const mocks: Record<string, string> = {
        "london": "15°C, Rainy",
        "new york": "22°C, Sunny",
        "tokyo": "18°C, Cloudy",
        "sydney": "25°C, Sunny",
    };
    const key = city.toLowerCase();
    return mocks[key] || "20°C, Partly Cloudy (Mock Data)";
}

// --- Agent Logic ---

export interface AgentStep {
    type: 'thought' | 'action' | 'observation' | 'answer';
    content: string;
    tool?: string;
}

export interface AgentRunResult {
    steps: AgentStep[];
    finalAnswer: string;
}

const SYSTEM_PROMPT = `
You are a smart assistant that can use tools. 
You have access to the following tools:

1. calculate: Evaluate a mathematical expression. Input: "expression" (e.g. "2 + 2")
2. weather: Get the current weather for a city. Input: "city" (e.g. "Paris")

To use a tool, you MUST respond with a JSON object in this format:
\`\`\`json
{{ "action": "tool_name", "input": "value" }}
\`\`\`

If you have the answer, respond with a JSON object in this format:
\`\`\`json
{{ "action": "final_answer", "input": "The answer is..." }}
\`\`\`

User Question: {input}

Existing Conversation History:
{history}

Think step-by-step. specific format is REQUIRED.
`;

export async function runReActAgent(
    userQuery: string,
    model: string = "llama3.2"
): Promise<AgentRunResult> {

    // We'll run a loop of max 5 steps to prevent inf loops
    const maxSteps = 5;
    const steps: AgentStep[] = [];
    let historyStr = "";

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0,
        format: "json" // Force JSON mode if supported by model, usually helps regardless
    });

    const chain = ChatPromptTemplate.fromTemplate(SYSTEM_PROMPT)
        .pipe(llm)
        .pipe(new StringOutputParser());

    for (let i = 0; i < maxSteps; i++) {
        // 1. THINK / DECIDE
        const response = await chain.invoke({
            input: userQuery,
            history: historyStr
        });

        // Parse JSON
        let actionStr = response.trim();
        // Remove markdown code blocks if present
        actionStr = actionStr.replace(/```json/g, '').replace(/```/g, '').trim();

        let parsed;
        try {
            parsed = JSON.parse(actionStr);
        } catch (e) {
            // Fallback: If model failed JSON, try to extract it loosely or just fail
            steps.push({ type: 'thought', content: "Error parsing JSON response: " + actionStr });
            break;
        }

        steps.push({
            type: 'thought',
            content: `Decided to use: ${parsed.action}`,
            tool: parsed.action
        });

        // 2. CHECK TERMINATION
        if (parsed.action === "final_answer") {
            return {
                steps,
                finalAnswer: parsed.input
            };
        }

        // 3. ACT / EXECUTE TOOL
        let toolResult = "";
        if (parsed.action === "calculate") {
            toolResult = executeCalculator(parsed.input);
        } else if (parsed.action === "weather") {
            toolResult = executeWeather(parsed.input);
        } else {
            toolResult = "Error: Unknown tool.";
        }

        steps.push({
            type: 'observation',
            content: `Tool Output: ${toolResult}`,
            tool: parsed.action
        });

        // 4. UPDATE HISTORY
        historyStr += `\nAssistant Action: ${JSON.stringify(parsed)}\nTool Observation: ${toolResult}\n`;
    }

    return {
        steps,
        finalAnswer: "Agent stopped (max steps reached)."
    };
}
