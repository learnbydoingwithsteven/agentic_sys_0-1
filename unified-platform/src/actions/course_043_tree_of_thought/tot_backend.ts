'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface TotNode {
    id: string;
    content: string;
    score: number;
    parentId?: string;
    children: TotNode[];
    type: 'root' | 'thought' | 'evaluation' | 'winner';
}

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.8, // High temp for diversity
});

const scorer = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0, // Deterministic scoring
});

export async function runTreeOfThought(topic: string): Promise<TotNode> {
    const root: TotNode = {
        id: 'root',
        content: `Topic: ${topic}`,
        score: 0,
        children: [],
        type: 'root'
    };

    // --- Step 1: Generate 3 Candidates (Expansion) ---
    const expansionPrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a creative writer. Write ONE distinct opening sentence for a story about the given topic."],
        ["user", `Topic: ${topic}\nVariation: {variation}`]
    ]);

    const candidates = await Promise.all([1, 2, 3].map(async (i) => {
        const text = await expansionPrompt.pipe(llm).pipe(new StringOutputParser()).invoke({ variation: i.toString() });
        return { id: `step1_node_${i}`, content: text.replace(/"/g, ''), parentId: 'root' };
    }));

    // --- Step 2: Eval Candidates ---
    const evalPrompt = ChatPromptTemplate.fromMessages([
        ["system", "Rate the following story opener for intrigue and creativity on a scale of 1-10. Return ONLY the number."],
        ["user", "{text}"]
    ]);

    const evaluatedCandidates = await Promise.all(candidates.map(async (node) => {
        const scoreStr = await evalPrompt.pipe(scorer).pipe(new StringOutputParser()).invoke({ text: node.content });
        const score = parseInt(scoreStr.match(/\d+/)?.[0] || "5");
        return {
            ...node,
            score,
            children: [],
            type: 'thought' as const
        };
    }));

    root.children = evaluatedCandidates;

    // --- Step 3: Selection & winner ---
    const bestNode = evaluatedCandidates.reduce((prev, current) => (prev.score > current.score) ? prev : current);

    // Mark the winner visually
    const winnerNode: TotNode = {
        id: 'winner',
        content: "SELECTED PATH: Continuing story generation...",
        score: bestNode.score,
        parentId: bestNode.id,
        children: [],
        type: 'winner'
    };

    // Find the actual object in the tree to attach the winner
    const target = root.children.find(c => c.id === bestNode.id);
    if (target) target.children.push(winnerNode);

    return root;
}
