use anchor_lang::prelude::*;

#[error_code]
pub enum UnfairDaoError {
    #[msg("Count overflow or underflow")]
    CountOutOfRange,

    #[msg("Fair score not within proposal boundaries")]
    Unqualified,
}
