
import { NextRequest, NextResponse } from 'next/server';
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Force dynamic to allow streaming
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { prompt, model } = await req.json();

        const llm = new ChatOllama({
            baseUrl: "http://127.0.0.1:11434",
            model: model || "llama3.2",
            temperature: 0.7,
        });

        const template = ChatPromptTemplate.fromMessages([
            ["system", "You are a poetic assistant. Answer the user's question with a short poem."],
            ["user", "{input}"]
        ]);

        const chain = template.pipe(llm).pipe(new StringOutputParser());

        // Create a stream
        const stream = await chain.stream({ input: prompt });

        // Convert the async generator to a ReadableStream
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    controller.enqueue(new TextEncoder().encode(chunk));
                }
                controller.close();
            }
        });

        return new NextResponse(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
