'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface CausalNode {
    id: string;
    label: string;
    value: boolean;
    causedBy?: string[];
    reasoning?: string;
}

export async function runIntervention(scenario: string, modelName: string = 'auto'): Promise<{ nodes: CausalNode[], explanation: string }> {
    // Causal Scenario: Rain and Sprinkler both can cause Wet Grass
    // We use LLM to reason about counterfactuals

    const causalPrompt = `You are a Causal Reasoning Agent.

Scenario: "${scenario}"

Causal Graph:
- Rain → Wet Grass
- Sprinkler → Wet Grass

Task: Analyze this scenario and determine:
1. Is Rain happening? (true/false)
2. Is Sprinkler on? (true/false)
3. Is Grass wet? (true/false)
4. What caused the grass to be wet? (rain, sprinkler, both, or neither)
5. Provide causal reasoning

Return JSON: {
  "rain": boolean,
  "sprinkler": boolean,
  "wet_grass": boolean,
  "caused_by": ["rain" | "sprinkler"],
  "explanation": "string explaining the causal chain"
}`;

    let rain = false;
    let sprinkler = false;
    let wetGrass = false;
    let causedBy: string[] = [];
    let explanation = "Analyzing causal relationships...";

    try {
        const raw = await queryLLM(causalPrompt, "Reason causally.", modelName, true);
        const res = await extractJSON(raw);
        rain = res.rain;
        sprinkler = res.sprinkler;
        wetGrass = res.wet_grass;
        causedBy = res.caused_by || [];
        explanation = res.explanation;
    } catch { }

    const nodes: CausalNode[] = [
        { id: 'rain', label: 'Rain', value: rain, causedBy: [] },
        { id: 'sprinkler', label: 'Sprinkler', value: sprinkler, causedBy: [] },
        { id: 'wet_grass', label: 'Wet Grass', value: wetGrass, causedBy }
    ];

    return { nodes, explanation };
}
