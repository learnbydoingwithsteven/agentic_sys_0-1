'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export type ConfigurationStrategy = 'minimal' | 'balanced' | 'advanced' | 'custom';

export interface AgentConfig {
    temperature: number;
    maxTokens: number;
    topP: number;
    topK: number;
    repeatPenalty: number;
    systemPrompt: string;
    streaming: boolean;
}

export interface ConfigurationRequest {
    query: string;
    strategy: ConfigurationStrategy;
    customConfig?: Partial<AgentConfig>;
}

export interface ConfigurationResponse {
    success: boolean;
    answer: string;
    config: AgentConfig;
    metadata: {
        strategy: ConfigurationStrategy;
        processingTime: number;
        tokensUsed?: number;
        configRationale?: string;
    };
    error?: string;
}

// Predefined configuration strategies
const CONFIGURATION_PRESETS: Record<ConfigurationStrategy, Partial<AgentConfig>> = {
    minimal: {
        temperature: 0.1,
        maxTokens: 256,
        topP: 0.9,
        topK: 10,
        repeatPenalty: 1.0,
        systemPrompt: "You are a helpful assistant. Be concise and factual.",
        streaming: false
    },
    balanced: {
        temperature: 0.5,
        maxTokens: 512,
        topP: 0.95,
        topK: 40,
        repeatPenalty: 1.1,
        systemPrompt: "You are a knowledgeable AI assistant. Provide clear, well-structured responses with examples when helpful.",
        streaming: false
    },
    advanced: {
        temperature: 0.8,
        maxTokens: 1024,
        topP: 0.98,
        topK: 80,
        repeatPenalty: 1.15,
        systemPrompt: "You are an expert AI assistant with deep knowledge across multiple domains. Provide comprehensive, nuanced responses with detailed explanations, examples, and relevant context. Think step-by-step and consider multiple perspectives.",
        streaming: false
    },
    custom: {
        temperature: 0.7,
        maxTokens: 512,
        topP: 0.95,
        topK: 50,
        repeatPenalty: 1.1,
        systemPrompt: "You are a customizable AI assistant.",
        streaming: false
    }
};

// Configuration rationale for each strategy
const CONFIG_RATIONALE: Record<ConfigurationStrategy, string> = {
    minimal: "Low temperature (0.1) for deterministic, factual responses. Small token limit for concise answers. Minimal creativity, maximum consistency.",
    balanced: "Moderate temperature (0.5) balancing creativity and consistency. Standard token limit for comprehensive but focused responses. Good for general-purpose tasks.",
    advanced: "High temperature (0.8) for creative, diverse responses. Large token limit for detailed explanations. Ideal for complex reasoning and exploration.",
    custom: "User-defined configuration allowing fine-tuned control over all parameters. Flexibility for specific use cases."
};

export async function runConfigurableAgent(
    request: ConfigurationRequest,
    model: string = "llama3.2"
): Promise<ConfigurationResponse> {

    const startTime = Date.now();

    try {
        // Step 1: Build configuration
        const baseConfig = CONFIGURATION_PRESETS[request.strategy];
        const finalConfig: AgentConfig = {
            ...baseConfig,
            ...request.customConfig
        } as AgentConfig;

        // Step 2: Initialize LLM with configuration
        const llm = new ChatOllama({
            baseUrl: "http://127.0.0.1:11434",
            model: model,
            temperature: finalConfig.temperature,
            numPredict: finalConfig.maxTokens,
            topP: finalConfig.topP,
            topK: finalConfig.topK,
            repeatPenalty: finalConfig.repeatPenalty,
        });

        // Step 3: Create prompt with system message
        const promptTemplate = PromptTemplate.fromTemplate(`
System: {systemPrompt}

User Query: {query}

Assistant Response:`);

        // Step 4: Execute agent
        const chain = promptTemplate.pipe(llm).pipe(new StringOutputParser());
        const answer = await chain.invoke({
            systemPrompt: finalConfig.systemPrompt,
            query: request.query
        });

        const processingTime = Date.now() - startTime;

        return {
            success: true,
            answer,
            config: finalConfig,
            metadata: {
                strategy: request.strategy,
                processingTime,
                configRationale: CONFIG_RATIONALE[request.strategy]
            }
        };

    } catch (error) {
        return {
            success: false,
            answer: "",
            config: CONFIGURATION_PRESETS[request.strategy] as AgentConfig,
            metadata: {
                strategy: request.strategy,
                processingTime: Date.now() - startTime,
                configRationale: CONFIG_RATIONALE[request.strategy]
            },
            error: String(error)
        };
    }
}

// Compare multiple configurations
export async function compareConfigurations(
    query: string,
    strategies: ConfigurationStrategy[],
    model: string = "llama3.2"
): Promise<ConfigurationResponse[]> {

    const results = await Promise.all(
        strategies.map(strategy =>
            runConfigurableAgent({ query, strategy }, model)
        )
    );

    return results;
}
