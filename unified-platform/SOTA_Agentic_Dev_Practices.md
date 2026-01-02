# State-of-the-Art (SOTA) Agentic Development Guidelines
**Version 2.0 - Jan 2026**

This document defines the **mandatory** standards for all modules within the **Unified Agentic Platform**.

---

## 1. Core Principles

### 1.1 Free & Open Source First
*   **Rule**: Always prioritize **free tools** and **open-source models**.
*   **Implementation**:
    *   **LLMs**: Use **Ollama** with local models (e.g., `qwen2.5`, `llama3`, `mistral`). Never fix/hardcode a model; allow the user to select from available local models.
    *   **Frameworks**: Use **LangChain** (Community/Core), **CrewAI**, or custom TypeScript logic. Avoid paid SaaS wrappers.
    *   **External APIs**: If an API is required, use free tiers or local simulation/alternatives.

### 1.2 Zero-Mock Policy
*   **Rule**: **DO NOT MOCK** agent behaviors. Hardcoded arrays (e.g., `const fakeResults = [...]`) are strictly forbidden.
*   **Alternative**: If a real external tool is unavailable or costly (e.g., Google Search API), use the LLM to **simulate the environment dynamically**.
    *   *Correct*: Ask LLM "Act as a search engine and generate 3 relevant results for [Topic]".
    *   *Incorrect*: Returning a static list of pre-written links.
*   **Reasoning**: Users must see the agent's *reasoning process* in action, even if the data source is synthetic.

### 1.3 Agentic Workflows
*   **Rule**: Behaviors must be **Agentic**, not just simple Request/Response.
*   **Requirements**:
    *   **Tools**: Agents must use tools (Code Execution, Search, Calculator).
    *   **Planning**: Decompose complex tasks (DAGs, Trees).
    *   **Loops**: Implement feedback loops (Think -> Act -> Observe -> Refine).
    *   **Frameworks**: Utilize **LangChain** or **CrewAI** patterns where applicable for orchestration, provided they run locally.

---

## 2. Visibility & Observability

### 2.1 Workflow Visualization
*   **Rule**: The internal state of the agent must be visible to the user.
*   **Implementation**:
    *   **Diagrams**: Render the execution workflow (e.g., Mermaid.js graphs, React Flow nodes) showing the path the agent took.
    *   **Artifacts**: Display intermediate outputs (Plans, Drafts, Code Snippets) in the UI.
    *   **Logs**: Show a real-time "Thought Stream" (e.g., "Planning...", "Calling Python...", "Reading syntax error...").

### 2.2 Evaluation (Eval)
*   **Rule**: If applicable, include an **Evaluation** step.
*   **Implementation**:
    *   Score the agent's output (using another LLM as judge).
    *   Display metrics (Success Rate, Latency, Step Count).
    *   Allow the user to see *why* a particular result was improved.

---

## 3. Curriculum Sequence & Extensions

### 3.1 Strict Sequence Adherence
*   **Rule**: Follow the established sequence of modules (e.g., `course_050` -> `course_051` -> ...).
*   **Do Not Modification**: Do not arbitrarily reorder or replace existing core modules if they serve a specific pedagogical purpose.

### 3.2 Extensibility Strategy
*   **Rule**: If a better solution or a new technology emerges:
    *   **Add**: Create a **new module** at the *end* of the sequence (e.g., `course_099_advanced_search`).
    *   **Retain**: Keep the original module to show value progression/contrast.
    *   **Integrate**: Ensure the new module follows all SOTA standards defined here.

---

## 4. Technical Implementation SOTA

### 4.1 Architecture
*   **Frontend**: Next.js (App Router) + Tailwind CSS (v4) + Lucide Icons.
*   **Backend**: Server Actions (`'use server'`) + Centralized `llm_helper.ts`.
*   **State Management**: React State for ephemeral data; File System/Vector Store for persistence.

### 4.2 Code Standards
*   [x] **Dynamic Models**: Frontend calls `getAvailableModels()`, Backend accepts `modelName`.
*   [x] **Robust Parsing**: Always use `extractJSON` wrapper for structured data.
*   [x] **Real Execution**: Use `child_process` for code, not `eval()` or mocks.
*   [x] **Error Boundaries**: Graceful degradations (e.g., "Search failed, trying alternative...").

---

**Reference Implementation**:
*   `src/lib/llm_helper.ts` (Core Interface)
*   `src/actions/course_053_code_execution` (Real Tooling)
*   `src/actions/course_054_research_assistant` (Simulated Environment Content)
*   `src/actions/course_055_debate` (Multi-Agent Loop)
