'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface ReActStep {
    type: 'thought' | 'action' | 'observation' | 'answer';
    content: string;
    tool?: string;
    toolInput?: string;
}

// --- Tools ---
const TOOLS = {
    'get_current_year': () => "2025",
    'get_birth_year': (person: string) => {
        if (person.toLowerCase().includes('obama')) return "1961";
        if (person.toLowerCase().includes('einstein')) return "1879";
        if (person.toLowerCase().includes('steven')) return "1990"; // Easter egg
        return "Unknown";
    },
    'subtract': (a: string, b: string) => (parseInt(a) - parseInt(b)).toString()
};

// --- Main Action ---

export async function runReActAgent(question: string): Promise<ReActStep[]> {
    const steps: ReActStep[] = [];

    // We will simulate the ReAct loop deterministically for this educational demo
    // to avoid waiting for a 7b model to adhere to strict formatting.
    // In a real scenario, this would be a while(true) loop calling the LLM.

    // Step 1: Thought
    steps.push({
        type: 'thought',
        content: `I need to find out the current year and the birth year of the person mentioned to calculate their age.`
    });

    // Step 2: Action - Get Year
    steps.push({
        type: 'action',
        content: `Calling get_current_year()`,
        tool: 'get_current_year'
    });

    // Step 3: Observation
    const currentYear = TOOLS.get_current_year();
    steps.push({
        type: 'observation',
        content: currentYear
    });

    // Step 4: Action - Get Birth Year
    let target = "Obama";
    if (question.toLowerCase().includes('einstein')) target = "Einstein";

    steps.push({
        type: 'thought',
        content: `Now I need to find the birth year of ${target}.`
    });

    steps.push({
        type: 'action',
        content: `Calling get_birth_year('${target}')`,
        tool: 'get_birth_year',
        toolInput: target
    });

    const birthYear = TOOLS.get_birth_year(target);
    steps.push({
        type: 'observation',
        content: birthYear
    });

    // Step 5: Action - Math
    steps.push({
        type: 'thought',
        content: `I have both years: ${currentYear} and ${birthYear}. I will subtract them.`
    });

    steps.push({
        type: 'action',
        content: `Calling subtract(${currentYear}, ${birthYear})`,
        tool: 'subtract',
        toolInput: `${currentYear}, ${birthYear}`
    });

    const age = TOOLS.subtract(currentYear, birthYear);
    steps.push({
        type: 'observation',
        content: age
    });

    // Step 6: Final Answer
    steps.push({
        type: 'answer',
        content: `${target} would be ${age} years old in ${currentYear}.`
    });

    // Simulate delay for realism
    await new Promise(r => setTimeout(r, 1500));

    return steps;
}
