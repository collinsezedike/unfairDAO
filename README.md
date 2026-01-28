# UnfairDAO - Decentralized Autonomous Reputation

## About

**UnfairDAO** is a decentralized autonomous organization that replaces the broken "one-token-one-vote" system with a **weighted meritocracy**.

In most DAOs, whales rule. In UnfairDAO, **reputation is the only currency that matters.** By utilizing the Fairscale API and custom on-chain programs, we've built a governance layer where your influence is earned through long-term conviction, on-chain activity, and social presence.

## Overview

### 1. Governance Architecture

UnfairDAO operates on a weighted-meritocracy model. Unlike traditional "1-token-1-vote" systems, voting power is derived from a user's Fairscore—a composite metric of on-chain reputation and social conviction.

The Fairscore Equation

$$\text{Voting Power} = (\text{On-Chain Activity} + \text{Social Weight})$$

The protocol calculates eligibility based on the following threshold logic:

| Tier | Range  (FS) | Governance Rights |
| :--- | :--- | :--- |
| Bronze | 0  – 249 | New entrants, restricted to "Common" proposals. |
| Silver | 250  – 499 | Proven contributors, access to "Growth" proposals. |
| Gold | 500  – 749 | DAO OGs, high-weight voting power. |
| Platinum | 750+ | Council level, full governance access. |

### 2. On-Chain Caching

#### The Bottleneck Problem

Fairscale API, like any high-fidelity data provider, enforces rate limits to prevent Sybil attacks and infrastructure strain. If the frontend queried the API for every "Approve" or "Reject" click across thousands of active users, the DAO would grind to a halt due to 429 Too Many Requests errors.

#### The Solution: State Persistence

When a user first registers or "refreshes" their profile, the frontend performs a single, authenticated handshake with the Fairscale API. The resulting data—the fairscore and the tier—is then saved in the program account state.

#### The MemberAccount Structure

The score is stored in a PDA, making the data "warm" and globally available to the blockchain without further API calls:

```rust
#[account]
pub struct Member {
    pub fair_score: u16,        // Total aggregated Fairscore
    pub social_score: u16,      // Cached Social component
    pub wallet_score: u16,      // Cached Wallet/On-chain component
    pub tier: TierType,         // Enum representing Bronze, Silver, Gold, Platinum
    pub username: String,       // Internal DAO handle
    pub x_username: String,     // Verified X (Twitter) handle
    pub wallet: Pubkey,         // Owner's public key
}
```

#### 4. Implementation Logic

* **On-Chain Dominance:** Once a user is logged in, every component in the application (Proposals, Leaderboard, Profile) reads directly from the `Member` account state. This prevents "API Waterfall" effects where multiple components trigger redundant Fairscale requests upon rendering.
* **Manual Sync Strategy:** The system employs a "Manual Refresh" pattern. The Fairscale API is only engaged when the user explicitly triggers the **Sync** button.
* **Discrepancy Check & Write-Back:**
    1. User triggers `Sync`.
    2. The application fetches the latest profile data from the Fairscale API.
    3. The system compares the API's `fair_score` against the currently persisted `fair_score` in the `Member` account.
    4. **Update State:** If a discrepancy is found (e.g., the user's reputation has increased), a transaction is pushed to update the on-chain state.
    5. **Persist State:** If the scores match, the on-chain state is maintained, and no transaction is required, saving the user gas fees.
* **Zero-Latency UX:** Because the frontend never waits for an API handshake during standard navigation, the interface feels immediate and "local," and components can call connection.getProgramAccounts() to instantly determine eligibility for all proposals in a single batch.

### 3. The Voting Lifecycle

1. **Validation:** The system checks your `MemberAccount` to verify your current FS Tier.
2. **Commitment:** Votes are recorded on-chain. Once a ballot is cast, the weight is locked for the duration of that proposal to prevent "score-hopping."
3. **Execution:** If a proposal meets its **Quorum** and passing requirements, the DAO Treasury or Program executes the instruction permissionlessly.

## Demo Video
