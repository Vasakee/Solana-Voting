"use client";

import { useState } from "react";
import { useVotingProgram } from "@/hooks/useVotingProgram";

export function CreatePoll() {
  const { initPoll, addCandidate } = useVotingProgram();
  const [pollId, setPollId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [candidates, setCandidates] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Creating poll...");
    try {
      const id = parseInt(pollId);
      const now = Math.floor(Date.now() / 1000);
      await initPoll(id, name, description, now, now + 60 * 60 * 24 * 7); // 7 days
      for (const c of candidates.split(",").map((s) => s.trim()).filter(Boolean)) {
        await addCandidate(id, c);
      }
      setStatus("Poll created!");
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-gray-700 rounded-lg bg-gray-900">
      <h2 className="text-lg font-bold text-green-400">Create Poll</h2>
      <input className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded placeholder-gray-500" placeholder="Poll ID (number)" value={pollId} onChange={(e) => setPollId(e.target.value)} required />
      <input className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded placeholder-gray-500" placeholder="Poll name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded placeholder-gray-500" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded placeholder-gray-500" placeholder="Candidates (comma-separated)" value={candidates} onChange={(e) => setCandidates(e.target.value)} required />
      <button type="submit" className="bg-green-700 text-white p-2 rounded hover:bg-green-600">Create</button>
      {status && <p className="text-sm text-gray-400">{status}</p>}
    </form>
  );
}
