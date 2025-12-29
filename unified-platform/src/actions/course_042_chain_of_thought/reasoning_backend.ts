'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const REASONING_SYSTEM_PROMPT = `You are a deep-thinking AI assistant.
Before verifying your answer, you MUST think step-by-step to ensure correctness.

FORMAT:
<thinking>
[Step 1] Analyze the user's request...
[Step 2] Retrieve relevant knowledge...
[Step 3] Formulate the logic...
...
</thinking>
<answer>
Your final, concise response here.
</answer>
`;

export async function generateWithReasoning(prompt: string) {
    const llm = new ChatOllama({
        model: "qwen2.5:1.5b",
        baseUrl: "http://127.0.0.1:11434",
        temperature: 0.7,
    });

    const chain = ChatPromptTemplate.fromMessages([
        ["system", REASONING_SYSTEM_PROMPT],
        ["user", "{input}"]
    ]).pipe(llm).pipe(new StringOutputParser());

    const rawResponse = await chain.invoke({ input: prompt });

    // Parse it manually to separate thought from answer
    const thinkingMatch = rawResponse.match(/<thinking>([\s\S]*?)<\/thinking>/);
    const answerMatch = rawResponse.match(/<answer>([\s\S]*?)<\/answer>/);

    // Initial fallback if model misbehaves
    const thinking = thinkingMatch ? thinkingMatch[1].trim() : "No internal monologue generated.";
    let answer = answerMatch ? answerMatch[1].trim() : rawResponse.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();

    return {
        raw: rawResponse,
        thinking,
        answer
    };
}
