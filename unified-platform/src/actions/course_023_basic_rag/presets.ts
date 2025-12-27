
export const RAG_PRESETS = {
    first_aid: {
        title: "Wilderness First Aid Guide",
        description: "Emergency protocols for outdoor injuries.",
        content: `
WILDERNESS FIRST AID PROTOCOLS

1. PRIMARY ASSESSMENT (The ABCDE approach)
   - Airway: Check for obstructions.
   - Breathing: Look, listen, and feel for breath.
   - Circulation: Check pulse and bleeding.
   - Disability: Assess level of consciousness (AVPU scale).
   - Exposure: Check for environmental injuries (hypothermia/heat stroke).

2. TREATING CUTS AND LACERATIONS
   - Control bleeding with direct pressure for 10-15 minutes.
   - Irrigate wound with huge amounts of drinking-quality water.
   - Apply antiseptic ointment if available.
   - Dress wih sterile gauze.
   - Monitor for signs of infection (redness, heat, pus).

3. FRACTURE MANAGEMENT
   - Immobilize the limb using a splint (sticks, trekking poles).
   - Check circulation (CMS: Circulation, Motion, Sensation) distal to the injury.
   - If open fracture (bone visible), cover with moist sterile dressing.
   - Evacuate immediately if there is nerve damage or loss of circulation.

4. HYPOTHERMIA
   - Mild (Shivering): Get dry, add layers, sugary warm drinks.
   - Moderate (Violent shivering stops, confusion): Handle gently, insulate, heat packs to core (armpits, groin).
   - Severe (Unconscious): Evacuate immediately. Handle incredibly gently to avoid cardiac arrest.

5. SNAKE BITES
   - Keep victim calm and still.
   - Immobilize the bitten limb below the heart level.
   - Do NOT suck out venom.
   - Do NOT apply a tourniquet.
   - Mark the edge of swelling every 15 mins.
   - Evacuate to antivenom facility.
        `,
        questions: ["How do I treat a cut?", "What is the protocol for snake bites?", "How to handle a broken leg?"]
    },
    mars_colony: {
        title: "Mars Colony Operations Manual",
        description: "Technical instructions for Ares Base.",
        content: `
ARES BASE OPERATIONS MANUAL v4.2

SECTION 1: AIRLOCK PROCEDURES
1.1 Entry
   - Cycle time: 180 seconds.
   - Decontamination: Nitrogen shower must be active for 45s to remove perchlorates.
   - Outer door lockout: Enabled until pressure equalization reaches 0.1 atm difference.
   - WARNING: Never force manual override unless Fire Alarm is active.

SECTION 2: HYDROPONICS
2.1 Nutrient Mix
   - NPK Ratio: 15-5-25 for potatoes.
   - pH Target: 5.8 - 6.2.
   - Light Cycle: 18h ON / 6h OFF to simulate Earth summer.
2.2 Water Recycling
   - Sabatier Reactor must be checked daily for carbon buildup.
   - Condensate from crew quarters is filtered through Tier 3 membranes.

SECTION 3: POWER MANAGEMENT
3.1 Solar Arrays
   - Dust clearing protocol: Automated electrostatic sweep at 0400 daily.
   - Tilt Adjustment: Seasonal adjustment only (every 6 months).
3.2 RTG (Radioisotope Thermoelectric Generator)
   - Core Temp safe range: 400C - 600C.
   - Emergency Shutdown: Engage graphite control rods fully.
   - Radiation Zone: No EVA within 50 meters of Array B.

SECTION 4: EMERGENCY COMMS
   - Primary Uplink: ODIN Sat (Window: 0400-0800 MST).
   - Backup: High-Gain Antenna (Requires manual pointing to Earth coordinates).
   - Distress Frequency: 121.5 MHz (universal).
        `,
        questions: ["How long is the airlock cycle?", "What is the NPK ratio for potatoes?", "How do I clear dust from solar panels?"]
    },
    quantum_mechanics: {
        title: "Quantum Physics for Toddlers",
        description: "A simplified explanation of the universe.",
        content: `
QUANTUM PHYSICS BASICS (SIMPLIFIED)

1. The Cat is Both Alive and Dead
   Imagine a cat in a box. Until you open it, quantum mechanics says the cat is in a "superposition" of states. It's sleeping AND awake. It's only when you LOOK (observe) that it picks one. This is the Schrödinger's Cat thought experiment.

2. Spooky Action at a Distance
   Keywords: Entanglement.
   If two particles are "entangled", they share a connection. If you spin one particle up, the other instantly spins down, even if it's on the other side of the galaxy. Einstein hated this, calling it "spooky action".

3. The Uncertainty Principle
   Heisenberg discovered you can't know everything.
   You can know where a particle is (Position).
   OR where it's going (Momentum).
   But never both perfectly. The more you measure one, the fuzzier the other gets.

4. Light: Wave or Particle?
   It's both! Light travels like a wave (ripples in a pond) but hits like a particle (a photon bullet). This is called Wave-Particle Duality.
        `,
        questions: ["What is entanglement?", "Explain the uncertainty principle", "Is light a wave?"]
    }
};
