pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("9M2SG9z7A4S4hmrU4fDFjzLBAGw4A8LFRjK13E5BupN7");

#[program]
pub mod unfair_dao {
    use super::*;

    pub fn register_member(
        ctx: Context<RegisterMember>,
        fair_score: u16,
        social_score: u16,
        wallet_score: u16,
        tier: TierType,
        username: String,
    ) -> Result<()> {
        ctx.accounts.register_member(
            fair_score,
            social_score,
            wallet_score,
            tier,
            username,
            &ctx.bumps,
        )
    }

    pub fn update_member(
        ctx: Context<UpdateMember>,
        fair_score: u16,
        social_score: u16,
        wallet_score: u16,
        tier: TierType,
    ) -> Result<()> {
        ctx.accounts
            .update_member(fair_score, social_score, wallet_score, tier)
    }

    pub fn submit_proposal(
        ctx: Context<SubmitProposal>,
        title: String,
        description: String,
        score_limit: u16,
        score_threshold: u16,
        quorum: u32,
        end_time: i64,
    ) -> Result<()> {
        ctx.accounts.submit_proposal(
            title,
            description,
            score_limit,
            score_threshold,
            quorum,
            end_time,
            &ctx.bumps,
        )
    }

    pub fn vote_proposal(ctx: Context<VoteProposal>, vote: VoteType) -> Result<()> {
        ctx.accounts.vote_proposal(vote, &ctx.bumps)
    }
}
