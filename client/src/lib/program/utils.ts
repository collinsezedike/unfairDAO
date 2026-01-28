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

export const fetchAllMemberAccounts = async () => {
	const members = await program.account.member.all();
	return members.map((m) => {
		return {
			publicKey: m.publicKey.toBase58(),
			...m.account,
			wallet: m.account.wallet.toBase58(),
			tier: Object.keys(m.account.tier)[0],
		};
	});
};

export const fetchAllProposalAccounts = async () => {
	const proposals = await program.account.proposal.all();
	return proposals.map((p) => {
		return {
			publicKey: p.publicKey.toBase58(),
			...p.account,
			author: p.account.author.toBase58(),
			endTime: p.account.endTime.toNumber(),
			status: Object.keys(p.account.status)[0],
		};
	});
};

export const fetchAllProposalAccountsByUser = async (walletAddress: string) => {
	try {
		const walletPubKey = new PublicKey(walletAddress);
		const memberPDA = getMemberPDA(walletPubKey);
		const allProposals = await fetchAllProposalAccounts();
		if (!allProposals) return [];
		else {
			return allProposals.filter(
				(p) => p.author === memberPDA.toBase58(),
			);
		}
	} catch (error) {
		console.error("Error while fetching all user proposals: ", error);
		return [];
	}
};

export const fetchAllVoteAccountsByUser = async (walletAddress: string) => {
	try {
		const walletPubKey = new PublicKey(walletAddress);
		const memberPDA = getMemberPDA(walletPubKey);
		const votes = await program.account.vote.all();
		const userVotes = votes.filter(
			(v) => v.account.member.toBase58() === memberPDA.toBase58(),
		);
		return userVotes.map((v) => {
			return {
				publicKey: v.publicKey.toBase58(),
				...v.account,
				member: v.account.member.toBase58(),
				proposal: v.account.proposal.toBase58(),
				vote: Object.keys(v.account.vote)[0],
			};
		});
	} catch (error) {
		console.error("Error while fetching all user votes: ", error);
		return [];
	}
};
