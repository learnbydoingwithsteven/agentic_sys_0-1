import React from 'react';
import { PromptLab } from '@/components/demos/course_002_prompt_engineering/PromptLab';
import { Lightbulb, Code, Target, List, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">


      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase mb-3">Module 1.2</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Prompt Engineering Fundamentals
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Prompt engineering is the art and science of crafting effective instructions for Large Language Models (LLMs) to generate desired outputs.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" /> Why It Matters
              </h4>
              <p className="text-purple-800 dark:text-purple-200/80 mb-4 leading-relaxed">
                As LLMs become more powerful, the ability to direct them precisely is becoming a critical skill. Good prompts lead to accurate, reliable, and safe outputs.
              </p>
            </div>
          </section>

          <section id="principles" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm">01</span>
              Core Principles
            </h2>

            <div className="space-y-6">
              <PrincipleCard
                icon={<Target className="text-red-500" />}
                title="1. Clarity and Specificity"
                desc="Be explicit about what you want. Vague prompts lead to unpredictable results."
              >
                <CodeBlock title="Example">
                  {`Bad: "Write about dogs"
Good: "Write a 200-word informative paragraph about Golden Retrievers, focusing on their temperament and suitability as family pets."`}
                </CodeBlock>
              </PrincipleCard>

              <PrincipleCard
                icon={<Layers className="text-blue-500" />}
                title="2. Context Provision"
                desc="Provide relevant background information to guide the model."
              />

              <PrincipleCard
                icon={<List className="text-emerald-500" />}
                title="3. Format Specification"
                desc="Clearly define the desired output format (JSON, bullet points, essay, etc.)."
              />
            </div>
          </section>

          <section id="techniques" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm">02</span>
              Advanced Techniques
            </h2>

            <div className="grid gap-6">
              <TechniqueCard title="Few-Shot Learning" desc="Provide examples of input-output pairs to guide the model's behavior.">
                <CodeBlock title="Example">
                  {`Input: "The movie was fantastic!"
Output: Positive

Input: "I hated every minute of it."
Output: Negative

Now classify: "It was okay, nothing special."`}
                </CodeBlock>
              </TechniqueCard>

              <TechniqueCard title="Chain-of-Thought (CoT)" desc="Encourage step-by-step reasoning by asking the model to think through problems.">
                <CodeBlock title="Example">
                  {`"Let's solve this step by step:
1. First, identify the key information
2. Then, apply the relevant formula
3. Finally, calculate the result"`}
                </CodeBlock>
              </TechniqueCard>


              <TechniqueCard title="Role Assignment" desc="Assign a specific role or persona to the model for better context.">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  &quot;You are an expert Python developer with 10 years of experience. Explain list comprehensions to a beginner.&quot;
                </div>
              </TechniqueCard>

              <TechniqueCard title="Socratic Method" desc="Guide the user to the answer through questions rather than providing it directly.">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  &quot;Do not give the answer. Instead, ask guiding questions to help the user discover the answer themselves.&quot;
                </div>
              </TechniqueCard>

              <TechniqueCard title="Self-Reflection" desc="Ask the model to critique its own output to identify biases or errors.">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  &quot;After generating the response, critique it for potential assumptions or limitations.&quot;
                </div>
              </TechniqueCard>
            </div>
          </section>

          <section id="best-practices" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm">03</span>
              Best Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <PracticeItem text="Start simple, then iterate" />
              <PracticeItem text="Use delimiters to separate sections" />
              <PracticeItem text="Specify constraints (length, tone, style)" />
              <PracticeItem text="Test with edge cases" />
              <PracticeItem text="Version control your prompts" />
            </div>
          </section>
        </main>

        <aside className="lg:w-96 xl:w-[28rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <PromptLab />
        </aside>
      </div>
    </div>
  );
}

function PrincipleCard({ icon, title, desc, children }: { icon: React.ReactNode, title: string, desc: string, children?: React.ReactNode }) {
  return (
    <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">{icon}</div>
        {title}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">{desc}</p>
      {children}
    </div>
  );
}

function CodeBlock({ title, children }: { title: string, children: string }) {
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-zinc-500 uppercase mb-1 flex items-center gap-1">
        <Code className="w-3 h-3" /> {title}
      </div>
      <pre className="p-3 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-sm overflow-x-auto border border-zinc-800 shadow-inner">
        {children}
      </pre>
    </div>
  );
}

function TechniqueCard({ title, desc, children }: { title: string, desc: string, children: React.ReactNode }) {
  return (
    <div className="border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-6 bg-emerald-50/50 dark:bg-emerald-900/10">
      <h3 className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-emerald-500" />
        {title}
      </h3>
      <p className="text-sm text-emerald-800 dark:text-emerald-200/80 mb-4">{desc}</p>
      {children}
    </div>
  );
}

function PracticeItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30">
      <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
      <span className="text-orange-900 dark:text-orange-100 font-medium text-sm">{text}</span>
    </div>
  );
}
