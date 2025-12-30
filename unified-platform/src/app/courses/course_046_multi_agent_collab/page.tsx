import React from 'react';
import { MultiAgentLab } from '@/components/demos/course_046_multi_agent_collab/MultiAgentLab';

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
          Multi-Agent Collaboration
        </h1>
        <p className="text-zinc-500 text-lg">
          Orchestrate a hierarchical crew of specialized agents (Manager, Researcher, Writer) to execute complex workflows.
        </p>
      </div>

      <MultiAgentLab />
    </div>
  );
}
