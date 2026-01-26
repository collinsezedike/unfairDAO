use anchor_lang::prelude::*;

use crate::{
    error::UnfairDaoError,
    state::{Member, Proposal, Vote, VoteType},
};

#[derive(Accounts)]
pub struct VoteProposal<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        seeds = [b"member", signer.key().as_ref()],
        bump = member.bump
    )]
    pub member: Account<'info, Member>,

    #[account(
        mut,
        seeds = [b"proposal", proposal.title.as_bytes().as_ref(), member.key().as_ref()],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(
        init,
        payer = signer,
        seeds = [b"vote", proposal.key().as_ref(), member.key().as_ref()],
        bump,
        space = Vote::INIT_SPACE
    )]
    pub new_vote: Account<'info, Vote>,

    pub system_program: Program<'info, System>,
}

impl<'info> VoteProposal<'info> {
    pub fn vote_proposal(&mut self, vote: VoteType, bumps: &VoteProposalBumps) -> Result<()> {
        require!(
            self.member.fair_score > self.proposal.score_threshold,
            UnfairDaoError::Unqualified
        );
        require!(
            self.member.fair_score < self.proposal.score_limit,
            UnfairDaoError::Unqualified
        );

        match vote {
            VoteType::Approve => {
                self.proposal.votes_for = self
                    .proposal
                    .votes_for
                    .checked_add(1)
                    .ok_or(UnfairDaoError::CountOutOfRange)?
            }

            VoteType::Reject => {
                self.proposal.votes_against = self
                    .proposal
                    .votes_against
                    .checked_add(1)
                    .ok_or(UnfairDaoError::CountOutOfRange)?
            }
        };

        self.new_vote.set_inner(Vote {
            bump: bumps.new_vote,
            weight: self.member.fair_score,
            vote,
            proposal: self.proposal.key(),
            member: self.member.key(),
        });

        Ok(())
    }
}
