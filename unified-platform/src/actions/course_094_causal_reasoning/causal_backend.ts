'use server';

export interface CausalNode {
    id: string;
    label: string;
    value: boolean; // Happened or Not
    causedBy?: string[];
}

export async function runIntervention(targetNode: string, action: boolean): Promise<CausalNode[]> {
    // Scenario: {Rain} -> {WetGrass}, {Sprinkler} -> {WetGrass}
    // "WetGrass" is true. We want to know WHY.

    // Default world: Rain=True, Sprinkler=False -> WetGrass=True.

    // Intervention: DO(Sprinkler=True). 
    // Does it change Rain? No.
    // Does it change WetGrass? Yes.

    const rain = { id: 'rain', label: 'Rain', value: false, causedBy: [] }; // Assume no rain in this intervention test
    const sprinkler = { id: 'sprinkler', label: 'Sprinkler', value: action, causedBy: [] };

    // Structural Equation
    const wetGrassVal = rain.value || sprinkler.value;

    const wetGrass = {
        id: 'wet_grass',
        label: 'Wet Grass',
        value: wetGrassVal,
        causedBy: [
            ...(rain.value ? ['rain'] : []),
            ...(sprinkler.value ? ['sprinkler'] : [])
        ]
    };

    return [rain, sprinkler, wetGrass];
}
