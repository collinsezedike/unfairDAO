use anchor_lang::prelude::*;

use crate::state::{Member, TierType};

#[derive(Accounts)]
pub struct RegisterMember<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        seeds = [b"member", signer.key().as_ref()],
        bump,
        space = Member::INIT_SPACE + 8
    )]
    pub new_member: Account<'info, Member>,

    pub system_program: Program<'info, System>,
}

impl<'info> RegisterMember<'info> {
    pub fn register_member(
        &mut self,
        fair_score: u16,
        social_score: u16,
        wallet_score: u16,
        tier: TierType,
        username: String,
        x_username: String,
        bumps: &RegisterMemberBumps,
    ) -> Result<()> {
        self.new_member.set_inner(Member {
            bump: bumps.new_member,
            fair_score,
            social_score,
            wallet_score,
            tier,
            username,
            x_username,
            wallet: self.signer.key(),
        });
        Ok(())
    }
}
