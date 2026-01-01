'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface ResearchResult {
    sources: { title: string, snippet: string, url: string }[];
    synthesis: string;
}

export async function runResearch(topic: string, modelName: string = 'auto'): Promise<ResearchResult> {
    try {
        // 1. Generate Simulated Search Results (Content-Aware)
        // In a real app, this would be replaced by a call to Tavily, Serper, or Google Search API
        const searchPrompt = `You are a Search Engine Simulator.
        Generate 3 plausible search results for the user's query.
        
        CRITICAL: Return ONLY valid JSON array.
        
        Format:
        [
            { 
                "title": "Title of article", 
                "snippet": "A brief, relevant text snippet related to the topic (~30 words).", 
                "url": "plausible-domain.com/path" 
            }
        ]
        
        Make the results sound diverse (e.g., one news, one dictionary/wiki, one analysis).`;

        const searchUserPrompt = `Query: ${topic}`;

        const searchRaw = await queryLLM(searchPrompt, searchUserPrompt, modelName, false);
        const sources = await extractJSON(searchRaw);

        // Fallback if JSON fails or is empty
        const finalSources = (Array.isArray(sources) && sources.length > 0) ? sources : [
            {
                title: `${topic} - Wikipedia`,
                snippet: `${topic} is a complex subject that has evolved significantly in recent years...`,
                url: `en.wikipedia.org/wiki/${topic.replace(/\s+/g, '_')}`
            },
            {
                title: `Latest Analysis on ${topic}`,
                snippet: `Experts discuss the implications of ${topic} in the modern era, highlighting key trends...`,
                url: `news.example.com/${topic.replace(/\s+/g, '-')}`
            },
            {
                title: `Understanding ${topic}`,
                snippet: `A comprehensive guide to understanding the fundamentals and advanced concepts of ${topic}.`,
                url: `edu.example.org/courses/${topic.replace(/\s+/g, '_')}`
            }
        ];

        // 2. Synthesize Report
        const synthesisSystemPrompt = `You are a Research Analyst. 
        Synthesize the provided search snippets into a cohesive, professional executive summary.
        
        Rules:
        - Use a professional tone.
        - Cite the sources implicitly (e.g., "According to recent reports...").
        - Keep it under 200 words.
        - Focus on the content provided in the snippets.`;

        const synthesisUserPrompt = `Topic: ${topic}

        Search Results:
        ${JSON.stringify(finalSources, null, 2)}
        
        Write the synthesis report.`;

        const synthesis = await queryLLM(synthesisSystemPrompt, synthesisUserPrompt, modelName, false);

        return {
            sources: finalSources,
            synthesis
        };

    } catch (error) {
        console.error("Research failed:", error);
        return {
            sources: [],
            synthesis: "Failed to conduct research. Please try again."
        };
    }
}
