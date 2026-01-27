import * as anchor from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import IDL from "./idl.json";
import type { UnfairDao } from "./types";

// export const connection = new Connection(clusterApiUrl("devnet"), {
// 	commitment: "confirmed",
// });

export const connection = new Connection("http://127.0.0.1:8899", {
	commitment: "confirmed",
});

export const program = new anchor.Program<UnfairDao>(IDL, { connection });

export const getMemberPDA = (user: PublicKey) => {
	const [pda] = PublicKey.findProgramAddressSync(
		[Buffer.from("member"), user.toBuffer()],
		program.programId,
	);
	return pda;
};

export const getProposalPDA = (title: string, memberPDA: PublicKey) => {
	const [pda] = PublicKey.findProgramAddressSync(
		[Buffer.from("proposal"), Buffer.from(title), memberPDA.toBuffer()],
		program.programId,
	);
	return pda;
};

export const getVotePDA = (proposalPDA: PublicKey, memberPDA: PublicKey) => {
	const [pda] = PublicKey.findProgramAddressSync(
		[Buffer.from("vote"), proposalPDA.toBuffer(), memberPDA.toBuffer()],
		program.programId,
	);
	return pda;
};

export const fetchMemberAccount = async (walletAddress: string) => {
	try {
		const walletPubKey = new PublicKey(walletAddress);
		const memberPDA = getMemberPDA(walletPubKey);
		return await program.account.member.fetch(memberPDA);
	} catch (error) {
		console.error("Error when fetching member account: ", error);
		return null;
	}
};

export const fetchProposalAccount = async (proposalPDA: PublicKey) => {
	return await program.account.proposal.fetch(proposalPDA);
};

export const fetchVoteAccount = async (votePDA: PublicKey) => {
	return await program.account.vote.fetch(votePDA);
};
