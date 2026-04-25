"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { IDL, Voting } from "@/idl";
import { useCallback } from "react";

const PROGRAM_ID = new PublicKey("7VpBtEPysH7nWgqwtMH6DDMAWYFZZKpKN9xX2AmJyU1J");

export function useVotingProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getProgram = useCallback(() => {
    const provider = new AnchorProvider(connection, wallet as never, {
      commitment: "confirmed",
    });
    return new Program<Voting>(IDL, provider);
  }, [connection, wallet]);

  const pollPda = (pollId: number) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new BN(pollId).toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    )[0];

  const candidatePda = (pollId: number, candidate: string) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("candidate"),
        new BN(pollId).toArrayLike(Buffer, "le", 8),
        Buffer.from(candidate),
      ],
      PROGRAM_ID
    )[0];

  const initPoll = async (
    pollId: number,
    name: string,
    description: string,
    start: number,
    end: number
  ) => {
    const program = getProgram();
    return program.methods
      .initPoll(new BN(pollId), new BN(start), new BN(end), name, description)
      .rpc();
  };

  const addCandidate = async (pollId: number, candidate: string) => {
    const program = getProgram();
    return program.methods
      .initializeCandidate(new BN(pollId), candidate)
      .rpc();
  };

  const vote = async (pollId: number, candidateName: string) => {
    const program = getProgram();
    return program.methods.vote(new BN(pollId), candidateName).rpc();
  };

  const fetchPoll = async (pollId: number) => {
    const program = getProgram();
    return program.account.pollAccount.fetch(pollPda(pollId));
  };

  const fetchCandidates = async (pollId: number, count: number) => {
    const program = getProgram();
    // fetch all candidate accounts for this poll by fetching each by index name
    // Since we store by name, we fetch all CandidateAccount accounts and filter
    const all = await program.account.candidateAccount.all();
    return all
      .map((a) => a.account)
      .filter((a) => {
        // verify the PDA belongs to this poll
        try {
          const expected = candidatePda(pollId, a.candidateName);
          const actual = PublicKey.findProgramAddressSync(
            [
              Buffer.from("candidate"),
              new BN(pollId).toArrayLike(Buffer, "le", 8),
              Buffer.from(a.candidateName),
            ],
            PROGRAM_ID
          )[0];
          return expected.equals(actual);
        } catch {
          return false;
        }
      });
  };

  return { initPoll, addCandidate, vote, fetchPoll, fetchCandidates, pollPda, candidatePda };
}
