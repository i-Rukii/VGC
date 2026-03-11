import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-extrabold text-blue-400 mb-4">VGC HUB</h1>
      <p className="text-xl text-slate-300 mb-8">Base established. Ready for the Team Builder.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h2 className="font-bold text-xl mb-2">Team Builder</h2>
          <p className="text-slate-400">Save teams to your private database.</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h2 className="font-bold text-xl mb-2">Meta Trends</h2>
          <p className="text-slate-400">View usage stats from PokeAPI.</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h2 className="font-bold text-xl mb-2">Saved Notes</h2>
          <p className="text-slate-400">Keep track of your VGC strategies.</p>
        </div>
      </div>
    </div>
  );
}
