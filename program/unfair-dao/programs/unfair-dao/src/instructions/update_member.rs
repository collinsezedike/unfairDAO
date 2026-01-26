use anchor_lang::prelude::*;

use crate::state::{Member, TierType};

#[derive(Accounts)]
pub struct UpdateMember<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"member", signer.key().as_ref()],
        bump = member_account.bump,
    )]
    pub member_account: Account<'info, Member>,
}

impl<'info> UpdateMember<'info> {
    pub fn update_member(
        &mut self,
        fair_score: u16,
        social_score: u16,
        wallet_score: u16,
        tier: TierType,
    ) -> Result<()> {
        let member = &mut self.member_account;

        member.fair_score = fair_score;
        member.social_score = social_score;
        member.wallet_score = wallet_score;
        member.tier = tier;

        Ok(())
    }
}
