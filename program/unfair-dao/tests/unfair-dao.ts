import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { UnfairDao } from "../target/types/unfair_dao";

describe("unfair_dao - full lifecycle", () => {
	const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);

	const program = anchor.workspace.UnfairDao as Program<UnfairDao>;

	let user: Keypair;

	let userMemberPDA: PublicKey;
	let proposalPDA: PublicKey;
	let votePDA: PublicKey;

	const proposalTitle = "Burn the Treasury";
	const proposalDdescription = "Proposal to move 10 SOL to the prize pool";
	const proposalScoreThreshold = 10;
	const proposalScoreLimit = 100;
	const proposalQuorum = 5;
	const proposalEndTime = new anchor.BN(
		Math.floor(Date.now() / 1000) + 86400,
	);

	const username = "SolanaSurfer";
	const fairScoreData = {
		fairScore: 50,
		walletScore: 30,
		socialScore: 20,
		tier: { gold: {} },
	};
	const newFairScoreData = {
		fairScore: 85,
		walletScore: 40,
		socialScore: 45,
		tier: { platinum: {} },
	};

	before(async () => {
		user = Keypair.generate();

		// Airdrop SOL to test wallets
		const signature = await provider.connection.requestAirdrop(
			user.publicKey,
			2 * anchor.web3.LAMPORTS_PER_SOL,
		);
		await provider.connection.confirmTransaction(signature);

		[userMemberPDA] = PublicKey.findProgramAddressSync(
			[Buffer.from("member"), user.publicKey.toBuffer()],
			program.programId,
		);

		[proposalPDA] = PublicKey.findProgramAddressSync(
			[
				Buffer.from("proposal"),
				Buffer.from(proposalTitle),
				userMemberPDA.toBuffer(),
			],
			program.programId,
		);

		[votePDA] = PublicKey.findProgramAddressSync(
			[
				Buffer.from("vote"),
				proposalPDA.toBuffer(),
				userMemberPDA.toBuffer(),
			],
			program.programId,
		);
	});

	it("Registers a new member", async () => {
		await program.methods
			.registerMember(
				fairScoreData.fairScore,
				fairScoreData.socialScore,
				fairScoreData.walletScore,
				fairScoreData.tier,
				username,
			)
			.accountsStrict({
				signer: user.publicKey,
				newMember: userMemberPDA,
				systemProgram: SystemProgram.programId,
			})
			.signers([user])
			.rpc();

		const memberAccount = await program.account.member.fetch(userMemberPDA);
		expect(memberAccount.username).to.equal(username);
		expect(memberAccount.fairScore).to.equal(50);
		expect(memberAccount.tier).to.have.property("gold");
	});

	it("Updates a member's scores", async () => {
		const newFairScore = 85;

		await program.methods
			.updateMember(
				newFairScoreData.fairScore,
				newFairScoreData.socialScore,
				newFairScoreData.walletScore,
				newFairScoreData.tier,
			)
			.accountsStrict({
				signer: user.publicKey,
				memberAccount: userMemberPDA,
			})
			.signers([user])
			.rpc();

		const memberAccount = await program.account.member.fetch(userMemberPDA);
		expect(memberAccount.fairScore).to.equal(newFairScore);
		expect(memberAccount.tier).to.have.property("platinum");
	});

	it("Submits a proposal", async () => {
		await program.methods
			.submitProposal(
				proposalTitle,
				proposalDdescription,
				proposalScoreLimit,
				proposalScoreThreshold,
				proposalQuorum,
				proposalEndTime,
			)
			.accountsStrict({
				signer: user.publicKey,
				member: userMemberPDA,
				newProposal: proposalPDA,
				systemProgram: SystemProgram.programId,
			})
			.signers([user])
			.rpc();

		const proposal = await program.account.proposal.fetch(proposalPDA);
		expect(proposal.title).to.equal(proposalTitle);
		expect(proposal.author.toString()).to.equal(userMemberPDA.toString());
		expect(proposal.status).to.have.property("active");
	});

	it("Casts a vote on the proposal", async () => {
		await program.methods
			.voteProposal({ approve: {} }) // VoteType Enum
			.accountsStrict({
				signer: user.publicKey,
				member: userMemberPDA,
				proposal: proposalPDA,
				newVote: votePDA,
				systemProgram: SystemProgram.programId,
			})
			.signers([user])
			.rpc();

		const proposal = await program.account.proposal.fetch(proposalPDA);
		expect(proposal.votesFor).to.equal(1);

		const vote = await program.account.vote.fetch(votePDA);
		expect(vote.member.toString()).to.equal(userMemberPDA.toString());
		expect(vote.vote).to.have.property("approve");
		expect(vote.weight).to.equal(85);
	});
});
