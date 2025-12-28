'use server';

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

// --- Interfaces ---

export interface SimulationConfig {
    userPersona: string; // e.g. "Angry Customer"
    userGoal: string;    // e.g. "Get a refund"
    systemPersona: string; // e.g. "Helpful Support Agent"
}

export interface ChatTurn {
    speaker: 'User' | 'System';
    message: string;
}

// --- Action ---

export async function runSimulationStep(
    history: ChatTurn[],
    config: SimulationConfig,
    model: string = "llama3.2"
): Promise<ChatTurn> {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.7, // Creativity for simulation
    });

    const lastTurn = history[history.length - 1];
    const isSystemTurn = !lastTurn || lastTurn.speaker === 'User';

    // 1. Construct History for LangChain
    // If it's System's turn: History is as-is.
    // If it's User's turn: We need to invert the roles for the User Simulator so it sees "System" messages as "AI" messages?
    // Actually simpler: Just format the history as a string or use roles carefully.

    // Let's use string formatting for robustness in this simple loop
    const conversationString = history.map(h => `${h.speaker}: ${h.message}`).join("\n");

    let promptTemplate = "";
    let speaker: 'User' | 'System' = 'System';

    if (isSystemTurn) {
        speaker = 'System';
        promptTemplate = `
You are the System Agent.
Your Persona: ${config.systemPersona}

Current Conversation:
${conversationString}

Respond to the User naturally.
`;
    } else {
        speaker = 'User';
        promptTemplate = `
You are a User Simulator.
Your Persona: ${config.userPersona}
Your Goal: ${config.userGoal}

Current Conversation:
${conversationString}

Respond to the System to advance your goal.
`;
    }

    const output = await llm.invoke(promptTemplate);

    return {
        speaker: speaker,
        message: output.content.toString().replace(`${speaker}:`, '').trim()
    };
}
