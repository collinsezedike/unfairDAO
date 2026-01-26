use anchor_lang::prelude::*;

use crate::state::{Member, Proposal, StatusType};

#[derive(Accounts)]
#[instruction(title: String)]
pub struct SubmitProposal<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        seeds = [b"member", signer.key().as_ref()],
        bump = member.bump
    )]
    pub member: Account<'info, Member>,

    #[account(
        init,
        payer = signer,
        seeds = [b"proposal", title.as_bytes().as_ref(), member.key().as_ref()],
        bump,
        space = Proposal::INIT_SPACE + 8
    )]
    pub new_proposal: Account<'info, Proposal>,

    pub system_program: Program<'info, System>,
}

impl<'info> SubmitProposal<'info> {
    pub fn submit_proposal(
        &mut self,
        title: String,
        description: String,
        score_limit: u16,
        score_threshold: u16,
        quorum: u32,
        end_time: i64,
        bumps: &SubmitProposalBumps,
    ) -> Result<()> {
        self.new_proposal.set_inner(Proposal {
            bump: bumps.new_proposal,
            score_limit,
            score_threshold,
            votes_against: 0,
            votes_for: 0,
            quorum,
            end_time,
            status: StatusType::Active,
            title,
            description,
            author: self.member.key(),
        });

        Ok(())
    }
}
