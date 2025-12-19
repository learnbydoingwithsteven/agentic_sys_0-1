
'use server'


import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


export interface AgentAction {
    step: number;
    input: string;
    action: string;
    reason: string;
    utility: number;

    type: 'reflex' | 'vanilla' | 'system' | 'agentic';
    rawOutput?: string;
}

// ------------------------------------------------------------------
// 1. REFLEX AGENT (Rule-Based, No AI)
// ------------------------------------------------------------------
// Pure logic: IF condition THEN action. Zero latency, 100% predictable.
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// 2. VANILLA LLM (Pattern Matching Simulation)
// ------------------------------------------------------------------
// Simulates a raw LLM completing text. No structure, just "chat".
// ------------------------------------------------------------------
const VANILLA_RESPONSES = {
    'rain': "Oh, it looks wet outside. You might want to stay dry.",
    'hot': "Wow it is really roasting today. I hate the heat.",
    'cold': "Brrr, it's freezing. I need a blanket.",
    'dark': "I can't see anything in here. It's too dark."
};

// ------------------------------------------------------------------
// 3. SYSTEM AGENT (Simulated Structured Logic)
// ------------------------------------------------------------------
// Simulates an agent with a System Prompt: "You are a home assistant..."
// It behaves "agentically" but is still just a simulation for teaching.
// ------------------------------------------------------------------
const SYSTEM_TRIGGERS = [
    { keywords: ['rain', 'storm', 'wet', 'pour', 'drizzle'], action: 'DEPLOY_UMBRELLA', reason: 'User input indicates precipitation. Action required to protect home.' },
    { keywords: ['hot', 'sun', 'heat', 'burn', 'warm'], action: 'ACTIVATE_COOLING', reason: 'User input indicates high temperature. Cooling enabled.' },
    { keywords: ['cold', 'freeze', 'snow', 'ice', 'chill'], action: 'ACTIVATE_HEATER', reason: 'User input indicates low temperature. Heating enabled.' },
    { keywords: ['dark', 'night', 'dim', 'black'], action: 'ENABLE_NIGHT_VISION', reason: 'User input indicates low visibility. Sensors active.' }
];

// ------------------------------------------------------------------
// 4. LANGCHAIN SINGLE AGENT (Real Implementation)
// ------------------------------------------------------------------
// Uses actual LangChain + Ollama to perform Reasoning (ReAct).
// "Thought -> Action" loop.
// ------------------------------------------------------------------


// encapsulated Single Agent class
class HomeAutomationAgent {
    private model: ChatOllama;
    private prompt: ChatPromptTemplate;
    private chain: any; // Using any to avoid complex Runnable types in demo code

    constructor(modelName: string) {
        this.model = new ChatOllama({
            baseUrl: "http://127.0.0.1:11434",
            model: modelName,
            temperature: 0,
        });

        this.prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are a specialized Home Automation Agent. 
Your goal is to analyze the user's input and select the single best action to maintain comfort and safety.
Available Actions: 
- DEPLOY_UMBRELLA (if raining/wet)
- ACTIVATE_COOLING (if hot/sunny)
- ACTIVATE_HEATER (if cold/freezing)
- ENABLE_NIGHT_VISION (if dark/night)
- IDLE (if no clear action needed)

CRITICAL: You must output your reasoning followed by the final action.
Format:
Thought: <short reasoning>
Action: <ACTION_NAME>`],
            ["user", "{input}"]
        ]);

        this.chain = this.prompt.pipe(this.model).pipe(new StringOutputParser());
    }

    async run(input: string): Promise<{ action: string; reason: string }> {
        try {
            const result = await this.chain.invoke({ input });

            // Parse the structured output
            const actionMatch = result.match(/Action:\s*([A-Z_]+)/i);
            const action = actionMatch ? actionMatch[1].toUpperCase() : 'OBSERVE';

            return { action, reason: result };
        } catch (error) {
            console.error("Agent execution failed:", error);
            throw error;
        }
    }
}


export async function getAvailableModels(): Promise<string[]> {
    try {
        const res = await fetch('http://127.0.0.1:11434/api/tags', { next: { revalidate: 60 } });
        if (!res.ok) return ['simulation-model'];
        const data = await res.json();
        return data.models?.map((m: any) => m.name) || ['simulation-model'];
    } catch (e) {
        return ['simulation-model']; // Fallback if Ollama is down
    }
}



export async function runAgentAction(formData: FormData): Promise<AgentAction> {
    const type = formData.get('type') as 'reflex' | 'vanilla' | 'system' | 'agentic' || 'reflex';

    // Simulate network/inference delay
    await new Promise(resolve => setTimeout(resolve, type === 'reflex' ? 400 : 1200));



    // MODE 2, 3, 4: LLM Based
    if (type !== 'reflex') {
        const input = formData.get('nlInput') as string;
        const model = formData.get('model') as string || 'simulation-model';
        const lowerInput = input.toLowerCase();

        // --- VANILLA MODE (Chat Simulation) ---
        if (type === 'vanilla') {
            const trigger = Object.keys(VANILLA_RESPONSES).find(k => lowerInput.includes(k)) as keyof typeof VANILLA_RESPONSES;
            const response = trigger ? VANILLA_RESPONSES[trigger] : "I'm just a language model, I don't understand that context.";

            return {
                step: Date.now(),
                input,
                action: 'CHAT_RESPONSE',
                reason: `[LLM Output]: "${response}"\n(Unstructured Text Generation)`,
                utility: 0.4,
                type: 'vanilla',
                rawOutput: response
            };
        }

        // --- SYSTEM AGENT (Simulated Agentic Behavior) ---
        if (type === 'system') {
            // Check triggers for simulation
            const match = SYSTEM_TRIGGERS.find(t => t.keywords.some(k => lowerInput.includes(k)));

            const action = match ? match.action : 'IDLE';
            const reason = match ? match.reason : 'No environmental trigger detected in input.';

            return {
                step: Date.now(),
                input,
                action: action,
                reason: `[System Prompt]: You are a home controller.\n[Analysis]: ${reason}`,
                utility: 0.8,
                type: 'system'
            };
        }

        // --- AGENTIC MODE (Real LangChain) ---
        if (type === 'agentic') {
            try {
                // Instantiate the Single Agent
                const agent = new HomeAutomationAgent(model);

                // Execute Agent
                const agentResult = await agent.run(input);

                return {
                    step: Date.now(),
                    input,
                    action: agentResult.action,
                    reason: agentResult.reason,
                    utility: 0.95,
                    type: 'agentic'
                };
            } catch (error) {
                return {
                    step: Date.now(),
                    input,
                    action: 'ERROR',
                    reason: "Agent failed to execute. Ensure Ollama is running.",
                    utility: 0,
                    type: 'agentic'
                };
            }
        }
    }

    // MODE 1: Reflex (Rule-Based)
    const envState = formData.get('envInput') as string;
    let action = 'IDLE';
    let reason = 'No change detected';
    let utility = 0.5;

    switch (envState) {
        case 'sunny':
            action = 'HARVEST_SOLAR_ENERGY';
            reason = 'Rule: IF sunny THEN harvest';
            utility = 0.9;
            break;
        case 'rainy':
            action = 'DEPLOY_UMBRELLA';
            reason = 'Rule: IF rainy THEN protect';
            utility = 0.85;
            break;
        case 'cold':
            action = 'ACTIVATE_HEATER';
            reason = 'Rule: IF cold THEN heat';
            utility = 0.7;
            break;
        case 'hot':
            action = 'ACTIVATE_COOLING';
            reason = 'Rule: IF hot THEN cool';
            utility = 0.8;
            break;
    }

    return {
        step: Date.now(),
        input: envState,
        action,
        reason,
        utility,
        type: 'reflex'
    };
}
