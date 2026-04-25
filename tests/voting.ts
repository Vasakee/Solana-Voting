import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Voting } from "../target/types/voting";
import { assert } from "chai";

describe("voting", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Voting as Program<Voting>;
  const provider = anchor.getProvider() as anchor.AnchorProvider;

  const POLL_ID = new BN(1);
  const now = Math.floor(Date.now() / 1000);

  function pollPda(pollId: BN) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
      program.programId
    )[0];
  }

  function candidatePda(pollId: BN, candidate: string) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("candidate"), pollId.toArrayLike(Buffer, "le", 8), Buffer.from(candidate)],
      program.programId
    )[0];
  }

  it("initializes a poll", async () => {
    await program.methods
      .initPoll(POLL_ID, new BN(now - 10), new BN(now + 86400), "Test Poll", "A test poll")
      .rpc();

    const poll = await program.account.pollAccount.fetch(pollPda(POLL_ID));
    assert.equal(poll.pollName, "Test Poll");
    assert.equal(poll.pollOptionIndex.toNumber(), 0);
  });

  it("adds candidates", async () => {
    await program.methods.initializeCandidate(POLL_ID, "Alice").rpc();
    await program.methods.initializeCandidate(POLL_ID, "Bob").rpc();

    const alice = await program.account.candidateAccount.fetch(candidatePda(POLL_ID, "Alice"));
    const bob = await program.account.candidateAccount.fetch(candidatePda(POLL_ID, "Bob"));

    assert.equal(alice.candidateName, "Alice");
    assert.equal(alice.candidateVotes.toNumber(), 0);
    assert.equal(bob.candidateName, "Bob");

    const poll = await program.account.pollAccount.fetch(pollPda(POLL_ID));
    assert.equal(poll.pollOptionIndex.toNumber(), 2);
  });

  it("casts a vote", async () => {
    await program.methods.vote(POLL_ID, "Alice").rpc();

    const alice = await program.account.candidateAccount.fetch(candidatePda(POLL_ID, "Alice"));
    assert.equal(alice.candidateVotes.toNumber(), 1);
  });

  it("rejects vote after poll ends", async () => {
    const pastPollId = new BN(2);
    await program.methods
      .initPoll(pastPollId, new BN(now - 200), new BN(now - 100), "Past Poll", "Ended poll")
      .rpc();
    await program.methods.initializeCandidate(pastPollId, "Alice").rpc();

    try {
      await program.methods.vote(pastPollId, "Alice").rpc();
      assert.fail("Expected error for ended poll");
    } catch (e: unknown) {
      assert.include((e as Error).toString(), "VotingEnded");
    }
  });

  it("rejects vote before poll starts", async () => {
    const futurePollId = new BN(3);
    await program.methods
      .initPoll(futurePollId, new BN(now + 3600), new BN(now + 7200), "Future Poll", "Not started")
      .rpc();
    await program.methods.initializeCandidate(futurePollId, "Alice").rpc();

    try {
      await program.methods.vote(futurePollId, "Alice").rpc();
      assert.fail("Expected error for poll not started");
    } catch (e: unknown) {
      assert.include((e as Error).toString(), "VotingNotStarted");
    }
  });
});
