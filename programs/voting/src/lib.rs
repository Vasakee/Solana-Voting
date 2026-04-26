use anchor_lang::prelude::*;

declare_id!("7VpBtEPysH7nWgqwtMH6DDMAWYFZZKpKN9xX2AmJyU1J");

#[program]
pub mod voting {
    use super::*;

    pub fn init_poll(ctx: Context<InitPoll>, poll_id: u64, start: u64, end: u64, name: String, description: String) -> Result<()> {
        let poll = &mut ctx.accounts.poll_account;
        poll.poll_id = poll_id;
        poll.poll_description = description;
        poll.poll_name = name;
        poll.poll_voting_start = start;
        poll.poll_voting_end = end;
        poll.poll_option_index = 0;
        Ok(())
    }

    pub fn initialize_candidate(ctx: Context<InitializeCandidate>, _poll_id: u64, candidate: String) -> Result<()> {
        let candidate_account = &mut ctx.accounts.candidate_account;
        candidate_account.candidate_name = candidate;
        candidate_account.candidate_index = ctx.accounts.poll_account.poll_option_index;
        candidate_account.candidate_votes = 0;
        ctx.accounts.poll_account.poll_option_index += 1;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, _poll_id: u64, _candidate_name: String) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate_account;
        let current_time = Clock::get()?.unix_timestamp;

        if current_time > (ctx.accounts.poll_account.poll_voting_end as i64) {
            return Err(VotingError::VotingEnded.into());
        }
        if current_time <= (ctx.accounts.poll_account.poll_voting_start as i64) {
            return Err(VotingError::VotingNotStarted.into());
        }
        candidate.candidate_votes += 1;
        Ok(())
    }
}

#[error_code]
pub enum VotingError {
    #[msg("Voting has ended")]
    VotingEnded,
    #[msg("Voting has not started yet")]
    VotingNotStarted,
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitPoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + PollAccount::INIT_SPACE,
        seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll_account: Account<'info, PollAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate: String)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll_account: Account<'info, PollAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + CandidateAccount::INIT_SPACE,
        seeds = [b"candidate".as_ref(), poll_id.to_le_bytes().as_ref(), candidate.as_bytes().as_ref()],
        bump,
    )]
    pub candidate_account: Account<'info, CandidateAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_name: String)]
pub struct Vote<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll_account: Account<'info, PollAccount>,

    #[account(
        mut,
        seeds = [b"candidate".as_ref(), poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes().as_ref()],
        bump,
    )]
    pub candidate_account: Account<'info, CandidateAccount>,
}

#[account]
#[derive(InitSpace)]
pub struct PollAccount {
    pub poll_id: u64,
    #[max_len(32)]
    pub poll_name: String,
    #[max_len(280)]
    pub poll_description: String,
    pub poll_voting_start: u64,
    pub poll_voting_end: u64,
    pub poll_option_index: u64,
}

#[account]
#[derive(InitSpace)]
pub struct CandidateAccount {
    pub candidate_index: u64,
    #[max_len(32)]
    pub candidate_name: String,
    pub candidate_votes: u64,
}
