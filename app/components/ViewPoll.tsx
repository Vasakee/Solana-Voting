"use client";

import { useState } from "react";
import { useVotingProgram } from "@/hooks/useVotingProgram";

type Candidate = { candidateName: string; candidateVotes: { toNumber: () => number } };

export function ViewPoll() {
  const { fetchPoll, fetchCandidates, vote } = useVotingProgram();
  const [pollId, setPollId] = useState("");
  const [poll, setPoll] = useState<{ pollName: string; pollDescription: string } | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [status, setStatus] = useState("");

  const load = async () => {
    setStatus("Loading...");
    try {
      const id = parseInt(pollId);
      const p = await fetchPoll(id);
      const cs = await fetchCandidates(id, 0);
      setPoll(p as never);
      setCandidates(cs as never);
      setStatus("");
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleVote = async (candidateName: string) => {
    setStatus(`Voting for ${candidateName}...`);
    try {
      await vote(parseInt(pollId), candidateName);
      setStatus("Vote cast!");
      await load();
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg">
      <h2 className="text-lg font-bold">View & Vote</h2>
      <div className="flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Poll ID" value={pollId} onChange={(e) => setPollId(e.target.value)} />
        <button onClick={load} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Load</button>
      </div>

      {poll && (
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">{poll.pollName}</h3>
          <p className="text-sm text-gray-500">{poll.pollDescription}</p>
          <div className="flex flex-col gap-2 mt-2">
            {candidates.map((c) => (
              <div key={c.candidateName} className="flex items-center justify-between border p-2 rounded">
                <span>{c.candidateName} — {c.candidateVotes.toNumber()} votes</span>
                <button
                  onClick={() => handleVote(c.candidateName)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
