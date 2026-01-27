use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Eq)]
pub enum TierType {
    Bronze,
    Silver,
    Gold,
    Platinum,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Eq)]
pub enum StatusType {
    Active,
    Approved,
    Rejected,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Eq)]
pub enum VoteType {
    Approve,
    Reject,
}

#[account]
#[derive(InitSpace)]
pub struct Member {
    pub bump: u8,
    pub fair_score: u16,
    pub social_score: u16,
    pub wallet_score: u16,
    pub tier: TierType,
    #[max_len(16)]
    pub username: String,
    #[max_len(16)]
    pub x_username: String,
    pub wallet: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct Proposal {
    pub bump: u8,
    pub score_limit: u16,
    pub score_threshold: u16,
    pub votes_against: u32,
    pub votes_for: u32,
    pub quorum: u32,
    pub end_time: i64,
    pub status: StatusType,
    #[max_len(64)]
    pub title: String,
    #[max_len(1028)]
    pub description: String,
    pub author: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub bump: u8,
    pub weight: u16,
    pub vote: VoteType,
    pub proposal: Pubkey,
    pub member: Pubkey,
}
