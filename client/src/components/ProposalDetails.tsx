import React, { useCallback, useEffect, useState } from "react";
import {
	ArrowLeft,
	User,
	Clock,
	CheckCircle2,
	XCircle,
	Info,
} from "lucide-react";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fetchAllProposalAccountsByUser } from "../lib/program/utils";
import { voteProposal } from "../lib/program/instructions";
import { fetchAllVoteAccountsByUser } from "../lib/program/utils";

const getTimeRemaining = (endTimeSeconds: number) => {
	const totalMs = endTimeSeconds * 1000 - Date.now();

	if (totalMs <= 0) return "Expired";

	const seconds = Math.floor((totalMs / 1000) % 60);
	const minutes = Math.floor((totalMs / 1000 / 60) % 60);
	const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
	const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

	if (days > 0) return `${days}d ${hours}h`;
	if (hours > 0) return `${hours}h ${minutes}m`;
	return `${minutes}m ${seconds}s`;
};

interface ProposalDetailsProps {
	onBack: () => void;
	userFairscore: number;
	walletAddress: string;
	proposal: Awaited<ReturnType<typeof fetchAllProposalAccountsByUser>>[0];
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({
	onBack,
	userFairscore,
	walletAddress,
	proposal,
}) => {
	const { connection } = useConnection();
	const { wallet, signTransaction } = useWallet();

	const [isVoting, setIsVoting] = useState<string | null>(null);
	const [hasVoted, setHasVoted] = useState<
		Awaited<ReturnType<typeof fetchAllVoteAccountsByUser>>[0] | null
	>(null);

	const loadHasUserVoted = useCallback(async () => {
		if (!walletAddress) return;
		const votes = await fetchAllVoteAccountsByUser(walletAddress);
		const vote = votes.find((v) => v.proposal === proposal.publicKey);
		if (!!vote) setHasVoted(vote);
	}, [walletAddress]);

	useEffect(() => {
		loadHasUserVoted();
	}, [loadHasUserVoted]);

	const isTooLow = userFairscore < proposal.scoreThreshold;
	const isTooHigh = userFairscore > proposal.scoreLimit;
	const canVote = !isTooLow && !isTooHigh;
	const totalVotes = proposal.votesFor + proposal.votesAgainst;
	const forPercentage =
		totalVotes === 0 ? 0 : (proposal.votesFor / proposal.quorum) * 100;

	const handleVoteProposal = async (vote: "approve" | "reject") => {
		setIsVoting(vote);
		try {
			if (!wallet?.adapter.publicKey || !signTransaction) {
				return toast.error("Wallet does not support signing");
			}

			const tx = await voteProposal(
				vote,
				proposal.publicKey,
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
		} catch (error) {
			console.error("Error occured while voting: ", error);
			toast.error("Error occured while voting");
		} finally {
			setIsVoting(null);
		}
	};

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-2 text-white font-serif hover:underline"
				>
					<ArrowLeft size={20} /> Back
				</button>
				<div
					className={`px-4 py-1 font-mono text-sm font-bold uppercase border ${
						proposal.status === "Passed"
							? "border-green-500 text-green-500"
							: proposal.status === "Failed"
								? "border-red-500 text-red-500"
								: "border-white text-white"
					}`}
				>
					{proposal.status}
				</div>
			</div>

			<header className="border border-white bg-black p-8">
				<h1 className="font-serif text-5xl font-bold text-white mb-6 leading-tight">
					{proposal.title}
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="flex items-center space-x-3 text-gray-400">
						<User size={18} />
						<div>
							<p className="font-serif text-[10px] uppercase tracking-widest">
								Proposed by
							</p>
							<p className="font-mono text-white text-sm">
								{proposal.author.slice(0, 12)}
								...
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-3 text-gray-400">
						<Clock size={18} />
						<div>
							<p className="font-serif text-[10px] uppercase tracking-widest">
								Ending In
							</p>
							<div className="flex items-center gap-2">
								<span
									className={`font-mono text-sm ${
										proposal.endTime * 1000 < Date.now()
											? "text-red-500"
											: "text-white"
									}`}
								>
									{getTimeRemaining(proposal.endTime)}
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-3 text-gray-400">
						<Info size={18} />
						<div>
							<p className="font-serif text-[10px] uppercase tracking-widest">
								Quorum
							</p>
							<p className="font-mono text-white text-sm">
								{proposal.quorum} Votes Required
							</p>
						</div>
					</div>
				</div>
			</header>

			{/* Voting Progress Visualization */}
			<section className="border border-white bg-black p-8">
				<div className="flex justify-between items-end mb-4">
					<h3 className="font-serif text-2xl font-bold text-white uppercase tracking-tight">
						Current Standing
					</h3>
					<p className="font-mono text-white text-sm">
						{totalVotes} Total Votes
					</p>
				</div>

				<div className="h-4 w-full bg-zinc-900 border border-white flex">
					<div
						className="h-full bg-white transition-all duration-1000"
						style={{ width: `${forPercentage}%` }}
					/>
				</div>

				<div className="grid grid-cols-2 mt-4 gap-4">
					<div className="border border-white p-4">
						<p className="font-serif text-gray-400 text-xs uppercase mb-1">
							Support
						</p>
						<p className="font-mono text-3xl font-bold text-white">
							{proposal.votesFor} Votes
						</p>
					</div>
					<div className="border border-white p-4">
						<p className="font-serif text-gray-400 text-xs uppercase mb-1">
							Oppose
						</p>
						<p className="font-mono text-3xl font-bold text-white">
							{proposal.votesAgainst} Votes
						</p>
					</div>
				</div>
			</section>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 border border-white bg-black p-8">
					<h3 className="font-serif text-2xl font-bold text-white mb-6 border-b border-white pb-2 inline-block">
						Description
					</h3>
					<div className="font-serif text-white leading-relaxed text-lg whitespace-pre-line">
						{proposal.description}
					</div>
				</div>

				<aside className="border border-white bg-white p-8 h-fit relative overflow-hidden">
					<h3 className="font-serif text-2xl font-bold text-black mb-2 uppercase tracking-tighter">
						Cast Your Vote
					</h3>

					<div className="bg-black text-white p-4 mb-6 mt-4">
						<p className="font-serif text-[10px] uppercase tracking-widest opacity-70">
							Your Weight
						</p>
						<p className="font-mono text-2xl font-bold">
							{userFairscore} FS
						</p>
					</div>

					{hasVoted ? (
						<div className="space-y-4 animate-in fade-in duration-700">
							<div
								className={`border-2 p-4 ${
									hasVoted.vote === "approve"
										? "border-green-600 bg-green-50"
										: "border-red-600 bg-red-50"
								}`}
							>
								<p className="font-serif text-[10px] uppercase tracking-widest text-black/60 mb-1">
									Your Vote
								</p>
								<div className="flex items-center justify-between text-black">
									<span className="font-serif font-bold text-xl uppercase">
										{hasVoted.vote === "approve"
											? "Approved"
											: "Rejected"}
									</span>
									{hasVoted.vote === "approve" ? (
										<CheckCircle2 size={24} />
									) : (
										<XCircle size={24} />
									)}
								</div>
								<p className="font-mono text-xs text-black/70 mt-2">
									Weight Applied: {hasVoted.weight} FS
								</p>
							</div>
						</div>
					) : canVote ? (
						/* QUALIFIED STATE */
						<div className="space-y-4">
							<p className="font-serif text-black text-sm mb-4">
								You are eligible to vote on this proposal. Your
								weight of {userFairscore} will be applied.
							</p>
							<button
								disabled={!!isVoting}
								className="cursor-pointer w-full flex items-center justify-center gap-2 bg-black text-white font-serif py-4 border border-black hover:bg-zinc-800 transition-colors uppercase tracking-widest disabled:bg-zinc-800 disabled:cursor-not-allowed"
								onClick={() => {
									handleVoteProposal("approve");
								}}
							>
								<CheckCircle2 size={18} />{" "}
								{isVoting == "approve"
									? "Approving..."
									: "Approve"}
							</button>
							<button
								disabled={!!isVoting}
								className="cursor-pointer w-full flex items-center justify-center gap-2 bg-transparent text-black font-serif py-4 border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest disabled:bg-zinc-800 disabled:text-white disabled:cursor-not-allowed"
								onClick={() => {
									handleVoteProposal("reject");
								}}
							>
								<XCircle size={18} />{" "}
								{isVoting == "reject"
									? "Rejecting..."
									: "Reject"}
							</button>
						</div>
					) : (
						/* UNQUALIFIED STATE */
						<div className="space-y-4">
							<div className="border-2 border-dashed border-black p-4 text-black">
								<p className="font-serif font-bold uppercase text-xs mb-2 flex items-center gap-2">
									<Info size={14} /> Access Restricted
								</p>
								<p className="font-serif text-sm leading-tight">
									{isTooLow
										? `Your Fairscore is too low. A minimum of ${proposal.scoreThreshold + 1} FS is required to participate.`
										: `Your Fairscore is too high. This proposal is restricted to members below ${proposal.scoreLimit} FS.`}
								</p>
							</div>
						</div>
					)}
				</aside>
			</div>
		</div>
	);
};

export default ProposalDetails;
