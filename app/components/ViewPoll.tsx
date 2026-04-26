"use client";

import { useState, useEffect, useCallback } from "react";
import { useVotingProgram } from "@/hooks/useVotingProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("7VpBtEPysH7nWgqwtMH6DDMAWYFZZKpKN9xX2AmJyU1J");

type Candidate = { candidateName: string; candidateVotes: BN };
type PollEntry = {
  pollId: number;
  pollName: string;
  pollDescription: string;
  candidates: Candidate[];
};

export function ViewPoll() {
  const { getProgram, vote } = useVotingProgram();
  const { connected } = useWallet();
  const [polls, setPolls] = useState<PollEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const loadAll = useCallback(async () => {
    if (!connected) return;
    setLoading(true);
    setStatus("");
    try {
      const program = getProgram();
      const [allPolls, allCandidates] = await Promise.all([
        program.account.PollAccount.all(),
        program.account.CandidateAccount.all(),
      ]);

      const entries: PollEntry[] = allPolls.map(({ account }) => {
        const pollId = (account.pollId as BN).toNumber();
        const candidates = allCandidates
          .filter(({ account: c }) => {
            const expected = PublicKey.findProgramAddressSync(
              [
                Buffer.from("candidate"),
                new BN(pollId).toArrayLike(Buffer, "le", 8),
                Buffer.from(c.candidateName as string),
              ],
              PROGRAM_ID
            )[0];
            // verify by re-deriving — if it matches, this candidate belongs to this poll
            try {
              return expected.toBase58().length > 0 &&
                PublicKey.findProgramAddressSync(
                  [
                    Buffer.from("candidate"),
                    new BN(pollId).toArrayLike(Buffer, "le", 8),
                    Buffer.from(c.candidateName as string),
                  ],
                  PROGRAM_ID
                )[0].equals(expected);
            } catch { return false; }
          })
          .map(({ account: c }) => ({
            candidateName: c.candidateName as string,
            candidateVotes: c.candidateVotes as BN,
          }));

        return {
          pollId,
          pollName: account.pollName as string,
          pollDescription: account.pollDescription as string,
          candidates,
        };
      });

      setPolls(entries);
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  }, [connected, getProgram]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleVote = async (pollId: number, candidateName: string) => {
    setStatus(`Voting for ${candidateName}...`);
    try {
      await vote(pollId, candidateName);
      setStatus("Vote cast!");
      await loadAll();
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  if (!connected) return <p className="text-gray-500 text-sm">Connect your wallet to view polls.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">All Polls</h2>
        <button onClick={loadAll} className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {!loading && polls.length === 0 && (
        <p className="text-gray-400 text-sm">No polls found.</p>
      )}

      {polls.map((entry) => (
        <div key={entry.pollId} className="flex flex-col gap-2 p-4 border border-gray-700 rounded-lg bg-gray-900">
          <h3 className="font-semibold text-green-400">{entry.pollName}</h3>
          <p className="text-sm text-gray-400">{entry.pollDescription}</p>
          <div className="flex flex-col gap-2 mt-2">
            {entry.candidates.map((c) => (
              <div key={c.candidateName} className="flex items-center justify-between border border-gray-700 p-2 rounded bg-gray-800">
                <span className="text-sm">
                  {c.candidateName} — <span className="text-green-400">{c.candidateVotes.toNumber()} votes</span>
                </span>
                <button
                  onClick={() => handleVote(entry.pollId, c.candidateName)}
                  className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {status && <p className="text-sm text-gray-400 mt-1">{status}</p>}
    </div>
  );
}
