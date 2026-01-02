# State-of-the-Art (SOTA) Agentic Development Practices
**Version 1.0 - Jan 2026**

This document summarizes the best practices and architectural patterns established during the development of the **Unified Agentic Platform**. Run this project as a reference implementation for future agent-based applications.

---

## 1. Architecture Patterns

### 1.1 Centralized LLM Interface (`llm_helper.ts`)
*   **Pattern**: Do not instantiate `LangChain` or `Ollama` clients directly in every backend file. Use a centralized helper.
*   **Why**:
    *   **Consistency**: Ensures all agents use the same configuration (timeouts, base URLs).
    *   **Model Agnostic**: Switching from Ollama to OpenAI/Anthropic only requires changing one file.
    *   **Features**: Centralized logging, error handling, and model discovery.
*   **Key Function**: `queryLLM(systemPrompt, userPrompt, modelName, jsonMode)`

### 1.2 Structured Output Reliability
*   **Pattern**: LLMs are text generators, not JSON generators. Always use a robust extraction layer.
*   **Implementation**:
    1.  **Prompting**: Explicitly instruct the LLM: *"Return ONLY valid JSON. No markdown."*
    2.  **Wrappers**: Use `extractJSON()` to parse the response, handling common errors like finding the first `[` or `{` and handling markdown backticks (` ```json `).
    3.  **Validation**: Always fallback to a safe default or retry logic if parsing fails.

### 1.3 The "Real vs. Simulated" Spectrum
*   **Real Tool Execution (The Gold Standard)**:
    *   Whenever possible, execute *real* code.
    *   **Example**: Module 53 uses `child_process.spawn` to run Python code locally.
    *   **Security check**: Ensure timeouts and resource limits (sandboxing).
*   **Environment Simulation (The Silver Standard)**:
    *   If APIs (e.g., Google Search) are unavailable or expensive, simulate the *environment* behaviors using an LLM, but **never hardcode data**.
    *   **Example**: Module 54 asks the LLM to *"Generate 3 plausible search results"* based on the topic. This keeps the agent content-aware and functional without dependencies.
    *   **Anti-Pattern**: Hardcoded arrays `const sources = [...]` (Avoid this!).

---

## 2. Agentic Workflow Patterns

### 2.1 The "Think-Do-Observe" Loop
*   Agents should not just "return an answer". They should:
    1.  **Think/Plan**: Decompose the Goal (Module 49/50).
    2.  **Act**: Use a tool (Search, Code, Memory).
    3.  **Observe**: Check the result of the tool.
    4.  **Refine**: Synthesize the final answer (Module 54).

### 2.2 Dynamic Model Selection
*   **User Control**: Always allow the user to select the underlying model (e.g., `qwen2.5`, `llama3`).
*   **Why**: Different models have different strengths. A coding agent needs a coding model; a creative writer needs a creative model.
*   **Implementation**: Frontend fetches `getAvailableModels()` -> Passes selection to Backend `runAgent(..., modelName)`.

### 2.3 Semantic Memory (RAG Lite)
*   **Pattern**: Don't rely on keyword search. Use vector embeddings or LLM-based relevance scoring.
*   **Implementation**:
    *   Store memories with metadata (Timestamp, ID).
    *   On retrieval, ask the LLM: *"Which of these memories is relevant to the current query?"* (Module 51).

### 2.4 Multi-Agent Loops
*   **Pattern**: Agents interacting with agents.
*   **Example (Debate - Module 55)**:
    *   Loop: `Agent A (Pro)` -> Output -> `Agent B (Con)` -> Output -> Repeat.
    *   **State Management**: Pass the `history` array to the LLM at each turn so it maintains context.

---

## 3. UI/UX Best Practices

### 3.1 Transparent State
*   Users must know what the agent is doing.
*   **Bad**: A spinning loader for 30 seconds.
*   **Good**: "Browsing web...", "Synthesizing report...", "Executing code...".

### 3.2 Streaming & Real-Time Feedback
*   For long-running tasks, simulate streaming or use steps.
*   **Example**: Debate agent shows messages appearing one by one.

### 3.3 Visualizing the "Brain"
*   Show the internal artifacts:
    *   Show the **Plan** (DAG graph).
    *   Show the **Code** being executed.
    *   Show the **Search Results** found.
*   This builds trust and debugging capability.

---

## 4. Code Quality Checklist

- [x] **No Hardcoded Mocks**: All data is generated dynamically by LLM or Tools.
- [x] **Error Handling**: `try/catch` blocks around every LLM call.
- [x] **Type Safety**: TypeScript interfaces for all LLM inputs/outputs.
- [x] **Independence**: Each module is self-contained (Backend Action + Frontend Component).

---

**Reference**:
*   `src/lib/llm_helper.ts` (Core Logic)
*   `src/actions/course_053_code_execution` (Real Tool Use)
*   `src/actions/course_050_goal_oriented` (Recursive Logic)
