'use server';

export interface VoiceResponse {
    transcript: string;
    reply: string;
    audio: boolean; // Just a flag to trigger frontend visualizer
}

export async function processVoiceInput(isSpeaking: boolean): Promise<VoiceResponse> {
    // Simulate latency of STT -> LLM -> TTS pipeline
    await new Promise(r => setTimeout(r, 2000));

    // Mock Conversation
    const phrases = [
        { in: "What time is it?", out: "It's currently 2:45 PM." },
        { in: "Tell me a joke.", out: "Why did the robot go on a diet? It had too many bytes." },
        { in: "Turn on the lights.", out: "Okay, turning on living room lights." },
    ];

    const pick = phrases[Math.floor(Math.random() * phrases.length)];

    return {
        transcript: pick.in,
        reply: pick.out,
        audio: true
    };
}
