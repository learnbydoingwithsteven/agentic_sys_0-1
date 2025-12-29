'use server';

export interface TraceSpan {
    id: string;
    parent?: string;
    name: string;
    startTime: number;
    endTime: number;
    metadata?: any;
    status: 'success' | 'error';
}

export async function runObservedRequest(input: string): Promise<TraceSpan[]> {
    const traceId = 'trace_' + Date.now();
    const spans: TraceSpan[] = [];
    const t0 = 0;

    // Root Span
    spans.push({
        id: 'span_root',
        name: 'AgentExecution',
        startTime: t0,
        endTime: t0 + 2500, // placeholder
        metadata: { input },
        status: 'success'
    });

    // Child 1: Planner
    spans.push({
        id: 'span_planner',
        parent: 'span_root',
        name: 'PlanningStep',
        startTime: t0 + 100,
        endTime: t0 + 800,
        metadata: { strategy: 'CoT' },
        status: 'success'
    });

    // Child 2: Tool Call (Weather)
    spans.push({
        id: 'span_tool_weather',
        parent: 'span_root',
        name: 'Tool:WeatherAPI',
        startTime: t0 + 900,
        endTime: t0 + 1400,
        metadata: { location: 'Paris' },
        status: 'success'
    });

    // Child 3: Tool Call (Booking) -> Error simulation
    if (input.includes("fail")) {
        spans.push({
            id: 'span_tool_booking',
            parent: 'span_root',
            name: 'Tool:BookingSystem',
            startTime: t0 + 1500,
            endTime: t0 + 1800,
            metadata: { error: 'Timeout' },
            status: 'error'
        });
        // Update root to error
        spans[0].status = 'error';
    } else {
        spans.push({
            id: 'span_tool_booking',
            parent: 'span_root',
            name: 'Tool:BookingSystem',
            startTime: t0 + 1500,
            endTime: t0 + 1800,
            metadata: { status: 'Confirmed' },
            status: 'success'
        });
    }

    // Child 4: Final Generation
    spans.push({
        id: 'span_generation',
        parent: 'span_root',
        name: 'LLMCall:Summarize',
        startTime: t0 + 1900,
        endTime: t0 + 2400,
        metadata: { tokens: 150 },
        status: 'success'
    });

    // Wait to simulate network
    await new Promise(r => setTimeout(r, 1000));

    return spans;
}
