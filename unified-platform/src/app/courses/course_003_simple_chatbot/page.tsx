import React from 'react';
import { ChatBotLab } from '@/components/demos/course_003_simple_chatbot/ChatBotLab';
import { MessageSquare, Cpu, Database, Server, GitBranch, Shield, Terminal } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">


      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">Module 1.3</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Simple Chatbot Agent
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Learn how to build conversational agents that can maintain context, understand intent, and respond intelligently to user inputs.
            </p>
          </header>

          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-600" /> The Conversational Interface
              </h4>
              <p className="text-emerald-800 dark:text-emerald-200/80 mb-4 leading-relaxed">
                Chatbots are the most common interface for AI agents. They require managing state (history), parsing inputs (NLU), and generating appropriate responses (NLG).
              </p>
            </div>
          </section>

          <section id="foundations" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm">01</span>
              Chatbot Foundations
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <ConceptCard
                icon={<Database className="text-blue-500" />}
                title="State Management"
                desc="Keeping track of the conversation history (context window) so the bot 'remembers' previous interactions."
              />
              <ConceptCard
                icon={<Cpu className="text-purple-500" />}
                title="Inference Loop"
                desc="The process of taking user input + history, sending it to the LLM, and receiving a token stream."
              />
              <ConceptCard
                icon={<Server className="text-orange-500" />}
                title="System Prompting"
                desc="Defining the bot's persona (e.g., 'You are a helpful assistant') to guide its behavior."
              />
              <ConceptCard
                icon={<GitBranch className="text-pink-500" />}
                title="Tools & Actions"
                desc="Advanced bots can call external functions (APIs) to perform tasks beyond just talking."
              />
            </div>
          </section>

          <section id="architecture" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm">02</span>
              Architecture Patterns
            </h2>


            <div className="space-y-6">
              <PatternCard title="Stateless (One-off)" badge="Basic">
                Simple Q&A bots that treat every message as a new query. No memory of past turns.
              </PatternCard>
              <PatternCard title="Stateful (Session-based)" badge="Standard">
                Maintains a history of the current session. The most common pattern for chatbots like ChatGPT.
              </PatternCard>
              <PatternCard title="System Prompting" badge="Intermediate">
                Uses a hidden instruction (persona) to guide the bot's behavior and tone throughout the conversation.
              </PatternCard>
              <PatternCard title="RAG (Retrieval Augmented)" badge="Advanced">
                Fetches external data (documents, databases) to answer questions with domain-specific knowledge.
              </PatternCard>
            </div>
          </section>

          <section id="best-practices" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm">03</span>
              Best Practices
            </h2>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-6">
              <ul className="space-y-4">
                <PracticeItem text="Always define a clear system prompt to set boundaries." />
                <PracticeItem text="handle errors gracefully (e.g., API timeouts)." />
                <PracticeItem text="Truncate history to manage token limits." />
                <PracticeItem text="Implement streaming for better perceived latency (UX)." />
              </ul>
            </div>
          </section>
        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <ChatBotLab />
          </div>
        </aside>
      </div>
    </div>
  );
}

function ConceptCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 w-fit">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function PatternCard({ title, badge, children }: { title: string, badge: string, children: React.ReactNode }) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold">
        <MessageSquare className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-indigo-600 border border-indigo-200 dark:border-indigo-800 uppercase tracking-widest">{badge}</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{children}</p>
      </div>
    </div>
  );
}

function PracticeItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">{text}</span>
    </li>
  );
}
