import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FileText, RefreshCw, User, Vote, Wallet } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import ProposalDetails from "./ProposalDetails";
import { fetchFairScore } from "../lib/fairscale/utils";
import { updateMember } from "../lib/program/instructions";
import {
	fetchAllProposalAccountsByUser,
	fetchAllVoteAccountsByUser,
	fetchMemberAccount,
} from "../lib/program/utils";

interface ProfileViewProps {
	username: string;
	walletAddress: string;
	userFairscore: number;
	isReadOnly?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({
	username,
	walletAddress,
	userFairscore,
	isReadOnly = false,
}) => {
	const { connection } = useConnection();
	const { wallet, signTransaction } = useWallet();

	const [isReSyncing, setIsReSyncing] = useState(false);
	const [activeTab, setActiveTab] = useState<"proposals" | "votes">(
		"proposals",
	);
	const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
		null,
	);
	const [proposalAccountsData, setProposalAccountsData] = useState<
		Awaited<ReturnType<typeof fetchAllProposalAccountsByUser>>
	>([]);
	const [voteAccountsData, setVoteAccountsData] = useState<
		Awaited<ReturnType<typeof fetchAllVoteAccountsByUser>>
	>([]);

	const loadUserAccountsData = useCallback(async () => {
		if (!walletAddress || !username) return;
		const proposals = await fetchAllProposalAccountsByUser(walletAddress);
		const votes = await fetchAllVoteAccountsByUser(walletAddress);
		setProposalAccountsData(proposals);
		setVoteAccountsData(votes);
	}, [walletAddress]);

	useEffect(() => {
		loadUserAccountsData();
	}, [loadUserAccountsData]);

	const activeProposal = proposalAccountsData.find(
		(p) => p.publicKey === selectedProposalId,
	);

	const getProposalTitleFromVoteProposalAddress = (
		voteProposalAddress: string,
	) => {
		const proposal = proposalAccountsData.find(
			(p) => p.publicKey === voteProposalAddress,
		);
		if (!proposal) return null;
		return proposal.title;
	};

	if (activeProposal) {
		return (
			<ProposalDetails
				proposal={activeProposal}
				userFairscore={userFairscore}
				walletAddress={walletAddress}
				onBack={() => setSelectedProposalId(null)}
			/>
		);
	}

	const renderProposalsTable = () => {
		if (proposalAccountsData.length === 0) {
			return (
				<div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
					<FileText size={48} className="text-zinc-700" />
					<div>
						<p className="text-white text-xl mb-2">
							No Proposals Found
						</p>
					</div>
				</div>
			);
		}

		return (
			<section className="border border-white bg-black">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-zinc-900 border-b border-white">
								<th className="font-serif text-gray-400 text-xs uppercase tracking-widest text-left p-4">
									Proposal Title
								</th>
								<th className="font-serif text-gray-400 text-xs uppercase tracking-widest text-center p-4">
									Proposal Status
								</th>
								<th className="font-serif text-gray-400 text-xs uppercase tracking-widest text-right p-4">
									Total Votes
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-800 text-white">
							{proposalAccountsData.map((proposal) => (
								<tr
									key={proposal.publicKey}
									className="cursor-pointer hover:bg-zinc-950 transition-colors group"
									onClick={() =>
										setSelectedProposalId(
											proposal.publicKey,
										)
									}
								>
									<td className="p-4 text-lg">
										{proposal.title}
									</td>
									<td className="p-4 text-center capitalize">
										{proposal.status}
									</td>
									<td className="p-4 text-right">
										{proposal.votesFor +
											proposal.votesAgainst}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		);
	};

	const renderVotesTable = () => {
		if (voteAccountsData.length === 0) {
			return (
				<div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
					<Vote size={48} className="text-zinc-700" />
					<div>
						<p className="text-white text-xl mb-2">
							No Voting History
						</p>
					</div>
				</div>
			);
		}

		return (
			<section className="border border-white bg-black">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-zinc-900 border-b border-white">
								<th className="font-serif text-gray-400 text-xs uppercase tracking-widest text-left p-4">
									Proposal Title
								</th>
								<th className="font-serif text-gray-400 text-xs uppercase tracking-widest text-center p-4">
									Vote Type
								</th>
								<th className="font-serif text-gray-400 text-xs uppercase tracking-widest text-right p-4">
									Vote Weight
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-800 text-white">
							{voteAccountsData.map((vote) => (
								<tr
									key={vote.publicKey}
									className="cursor-pointer hover:bg-zinc-950 transition-colors group"
									onClick={() =>
										setSelectedProposalId(vote.proposal)
									}
								>
									<td className="p-4 text-lg">
										{getProposalTitleFromVoteProposalAddress(
											vote.proposal,
										)}
									</td>
									<td className="p-4 text-center capitalize">
										{vote.vote}
									</td>
									<td className="p-4 text-right">
										{vote.weight}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		);
	};

	const handleReSyncMemberAccountData = async () => {
		setIsReSyncing(true);
		try {
			if (!wallet?.adapter.publicKey || !signTransaction) {
				return toast.error("Wallet does not support signing");
			}

			// Fetch fairscale data
			const fairScoreResult = await fetchFairScore(
				wallet.adapter.publicKey.toBase58(),
				username,
			);

			if (!fairScoreResult) {
				return toast.error("Could not retrieve fair score");
			}

			// Fetch member account data
			const memberAccountData = await fetchMemberAccount(
				wallet.adapter.publicKey.toBase58(),
			);
			if (!memberAccountData) {
				return toast.error("Missing member account data");
			}

			// Compare both. If there's a difference, build and sign the update member transaction
			if (
				memberAccountData.fairScore !=
					Math.floor(fairScoreResult.fairscore) ||
				memberAccountData.socialScore !=
					Math.floor(fairScoreResult.social_score) ||
				memberAccountData.walletScore !=
					Math.floor(fairScoreResult.fairscore_base)
			) {
				const tx = await updateMember(
					fairScoreResult.fairscore,
					fairScoreResult.social_score,
					fairScoreResult.fairscore_base,
					fairScoreResult.tier,
					wallet.adapter.publicKey,
				);

				const signedTx = await signTransaction(tx);
				const signature = await connection.sendRawTransaction(
					signedTx.serialize(),
				);
				const latestBlockhash = await connection.getLatestBlockhash();
				await connection.confirmTransaction({
					blockhash: latestBlockhash.blockhash,
					lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
					signature: signature,
				});
			}
		} catch (error) {
			console.error("Error occured while resyncing: ", error);
			toast.error("Error occured while resyncing account data");
		} finally {
			setIsReSyncing(false);
		}
	};

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<section className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white bg-black">
				<div className="md:col-span-2 p-8 border-b md:border-b-0 md:border-r border-white flex flex-col justify-center">
					<div className="flex items-center space-x-2 text-gray-400 mb-1">
						<User size={14} />
						<span className="font-serif text-xs uppercase tracking-widest">
							{isReadOnly ? "Member Profile" : "Your Profile"}
						</span>
					</div>
					<h2 className="font-serif text-5xl font-bold text-white mb-4 truncate">
						{username || "Anonymous"}
					</h2>
					<div className="flex items-center space-x-3 text-gray-400">
						<Wallet size={16} />
						<p className="font-mono text-sm tracking-tighter truncate">
							{walletAddress}
						</p>
					</div>
				</div>

				<div className="p-8 flex flex-col items-center justify-center bg-white text-black">
					<p className="font-serif text-xs uppercase tracking-widest font-bold mb-2">
						Fairscore
					</p>
					<div
						className={`font-mono text-7xl font-bold leading-none ${!isReadOnly && isReSyncing ? "animate-pulse" : ""} ${isReadOnly ? "" : "mb-4"}`}
					>
						{userFairscore}
					</div>

					{/* Only show sync if not read-only */}
					{!isReadOnly && (
						<button
							onClick={handleReSyncMemberAccountData}
							className="flex items-center space-x-2 border border-black px-3 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors"
						>
							<RefreshCw
								size={10}
								className={isReSyncing ? "animate-spin" : ""}
							/>
							<span>
								{isReSyncing ? "Syncing" : "Re-Sync Score"}
							</span>
						</button>
					)}
				</div>
			</section>

			{/* --- NAVIGATION --- */}
			<div className="flex border-b border-white">
				<button
					onClick={() => setActiveTab("proposals")}
					className={`px-8 py-4 font-serif text-sm uppercase tracking-widest flex items-center gap-2 ${activeTab === "proposals" ? "bg-white text-black" : "text-white"}`}
				>
					<FileText size={16} /> Proposals
				</button>
				<button
					onClick={() => setActiveTab("votes")}
					className={`px-8 py-4 font-serif text-sm uppercase tracking-widest flex items-center gap-2 ${activeTab === "votes" ? "bg-white text-black" : "text-white"}`}
				>
					<Vote size={16} /> Voting History
				</button>
			</div>

			{/* --- MAIN CONTENT: NO TERNARY --- */}
			<section className="border border-white bg-black overflow-hidden">
				<div className="overflow-x-auto">
					{activeTab === "proposals" && renderProposalsTable()}
					{activeTab === "votes" && renderVotesTable()}
				</div>
			</section>
		</div>
	);
};

export default ProfileView;
