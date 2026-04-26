"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CreatePoll } from "@/components/CreatePoll";
import { ViewPoll } from "@/components/ViewPoll";

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto bg-[#0f1117] text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Solana Voting</h1>
        <WalletMultiButton />
      </div>
      <div className="flex flex-col gap-6">
        <CreatePoll />
        <ViewPoll />
      </div>
    </main>
  );
}
