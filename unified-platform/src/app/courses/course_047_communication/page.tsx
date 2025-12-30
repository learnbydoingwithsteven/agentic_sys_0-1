import React from 'react';
import { ProtocolLab } from '@/components/demos/course_047_communication/ProtocolLab';

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
          Agent Communication Protocols
        </h1>
        <p className="text-zinc-500 text-lg">
          Why Natural Language fails for Agent-to-Agent comms. See the difference between fuzzy text and strict JSON Schemas.
        </p>
      </div>

      <ProtocolLab />
    </div>
  );
}
