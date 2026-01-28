import * as anchor from "@coral-xyz/anchor";
import {
	PublicKey,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

import {
	connection,
	getMemberPDA,
	getProposalPDA,
	getVotePDA,
	program,
} from "./utils";

const SYSTEM_PROGRAM_ID = anchor.web3.SystemProgram.programId;

const buildTransaction = async (
	feePayer: PublicKey,
	instructions: TransactionInstruction[],
): Promise<VersionedTransaction> => {
	const latestBlockhash = await connection.getLatestBlockhash();
	const message = new TransactionMessage({
		instructions,
		payerKey: feePayer,
		recentBlockhash: latestBlockhash.blockhash,
	}).compileToV0Message();
	return new VersionedTransaction(message);
};

export const registerMember = async (
	fairScore: number,
	socialScore: number,
	walletScore: number,
	tier: string,
	username: string,
	xUsername: string,
	user: PublicKey,
) => {
	const userMemberPDA = getMemberPDA(user);
	const tierEnum = { [tier.toLowerCase()]: {} };
	const ix = await program.methods
		.registerMember(
			fairScore,
			socialScore,
			walletScore,
			tierEnum,
			username,
			xUsername,
		)
		.accountsStrict({
			signer: user,
			newMember: userMemberPDA,
			systemProgram: SYSTEM_PROGRAM_ID,
		})
		.instruction();

	return await buildTransaction(user, [ix]);
};

export const updateMember = async (
	fairScore: number,
	socialScore: number,
	walletScore: number,
	tier: string,
	user: PublicKey,
) => {
	const userMemberPDA = getMemberPDA(user);
	const tierEnum = { [tier.toLowerCase()]: {} };
	const ix = await program.methods
		.updateMember(fairScore, socialScore, walletScore, tierEnum)
		.accountsStrict({
			signer: user,
			memberAccount: userMemberPDA,
		})
		.instruction();

	return await buildTransaction(user, [ix]);
};

export const submitProposal = async (
	title: string,
	description: string,
	scoreLimit: number,
	scoreThreshold: number,
	quorum: number,
	endTime: number,
	user: PublicKey,
) => {
	const userMemberPDA = getMemberPDA(user);
	const proposalPDA = getProposalPDA(title, userMemberPDA);

	const ix = await program.methods
		.submitProposal(
			title,
			description,
			scoreLimit,
			scoreThreshold,
			quorum,
			new anchor.BN(endTime),
		)
		.accountsStrict({
			signer: user,
			member: userMemberPDA,
			newProposal: proposalPDA,
			systemProgram: SYSTEM_PROGRAM_ID,
		})
		.instruction();

	return await buildTransaction(user, [ix]);
};

export const voteProposal = async (
	voteType: string,
	proposal: string,
	user: PublicKey,
) => {
	const userMemberPDA = getMemberPDA(user);
	const proposalPDA = new PublicKey(proposal);
	const votePDA = getVotePDA(proposalPDA, userMemberPDA);

	const voteEnum = { [voteType.toLowerCase()]: {} };

	const ix = await program.methods
		.voteProposal(voteEnum)
		.accountsStrict({
			signer: user,
			member: userMemberPDA,
			proposal: proposalPDA,
			newVote: votePDA,
			systemProgram: SYSTEM_PROGRAM_ID,
		})
		.instruction();

	return await buildTransaction(user, [ix]);
};
