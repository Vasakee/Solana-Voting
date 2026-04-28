"use client";

import { useState } from "react";
import { useVotingProgram } from "@/hooks/useVotingProgram";
import toast from "react-hot-toast";

export function CreatePoll() {
  const { initPoll, addCandidate } = useVotingProgram();
  const [pollId, setPollId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [candidates, setCandidates] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating poll...");
    try {
      const id = parseInt(pollId);
      // datetime-local gives local time, convert to UTC timestamp
      const start = startTime 
        ? Math.floor(new Date(startTime).getTime() / 1000) 
        : Math.floor(Date.now() / 1000);
      const end = endTime 
        ? Math.floor(new Date(endTime).getTime() / 1000) 
        : start + 60 * 60 * 24 * 7;
      
      console.log("Start timestamp:", start, "Current:", Math.floor(Date.now() / 1000));
      
      await initPoll(id, name, description, start, end);
      for (const c of candidates.split(",").map((s) => s.trim()).filter(Boolean)) {
        await addCandidate(id, c);
      }
      toast.success("Poll created successfully!", { id: loadingToast });
      setPollId("");
      setName("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setCandidates("");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : String(e), { id: loadingToast });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-gray-700 rounded-lg bg-gray-900">
      <h2 className="text-lg font-bold text-green-400">Create Poll</h2>
      <input className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded placeholder-gray-500" placeholder="Poll ID (number)" value={pollId} onChange={(e) => setPollId(e.target.value)} required />
      <input className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded placeholder-gray-500" placeholder="Poll name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded placeholder-gray-500" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Start Time (optional)</label>
        <input type="datetime-local" className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">End Time (optional)</label>
        <input type="datetime-local" className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <input className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded placeholder-gray-500" placeholder="Candidates (comma-separated)" value={candidates} onChange={(e) => setCandidates(e.target.value)} required />
      <button type="submit" className="bg-green-700 text-white p-2 rounded hover:bg-green-600">Create</button>
    </form>
  );
}
