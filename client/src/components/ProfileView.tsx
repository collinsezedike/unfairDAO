import React, { useState } from "react";
import { FileText, RefreshCw, User, Vote, Wallet } from "lucide-react";
import ProposalDetails from "./ProposalDetails";

interface ProfileViewProps {
	username: string;
	walletAddress: string;
	userFairscore: number;
	onRefetchFairscore?: () => Promise<void>;
	isRefetching?: boolean;
	isReadOnly?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({
	username,
	walletAddress,
	userFairscore,
	onRefetchFairscore,
	isRefetching = false,
	isReadOnly = false,
}) => {
	const [activeTab, setActiveTab] = useState<"proposals" | "votes">(
		"proposals",
	);
	const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
		null,
	);

	const mockProposals = [
		{
			id: "1",
			title: "Implement Quadratic Voting",
			description:
				"Proposal to implement quadratic voting mechanism for more democratic decision making in the DAO.",
			author: "0x742d35Cc...3b8D4",
			status: "Active",
			date: "2024-03-01",
			scoreThreshold: 75,
			scoreLimit: 150,
			totalVotes: 42,
		},
		{
			id: "2",
			title: "Treasury Diversification",
			description:
				"Proposal to implement quadratic voting mechanism for more democratic decision making in the DAO.",
			author: "0x742d35Cc...3b8D4",
			status: "Passed",
			date: "2024-02-15",
			scoreThreshold: 20,
			scoreLimit: 40,
			totalVotes: 78,
		},
	];

	const mockVotes = [
		{
			id: "v1",
			proposalID: "1",
			title: "Expand Core Team",
			action: "Support",
			weight: 50,
			timestamp: "2 hrs ago",
		},
		{
			id: "v2",
			proposalID: "2",
			title: "Monthly Burn Rate",
			action: "Oppose",
			weight: 50,
			timestamp: "1 day ago",
		},
		{
			id: "v3",
			proposalID: "3",
			title: "New UI Paradigm",
			action: "Support",
			weight: 42,
			timestamp: "3 days ago",
		},
	];

	const getProposalIDFromVote = (voteProposalID: string) => {
		const proposal = mockProposals.find((p) => p.id === voteProposalID);
		if (!proposal) return null;
		return proposal.id;
	};

	const activeProposal = mockProposals.find(
		(p) => p.id === selectedProposalId,
	);
	// || mockVotes.find((p) => p.id === selectedProposalId);

	if (activeProposal) {
		return (
			<ProposalDetails
				userFairscore={userFairscore}
				onBack={() => setSelectedProposalId(null)}
				proposal={{
					...activeProposal,
					// Adding mock data that Details needs but Card doesn't
					status: "Active",
					endTime: "4d 12h",
					votesFor: 1240,
					votesAgainst: 450,
					quorum: 2000,
				}}
			/>
		);
	}

	const renderProposalsTable = () => {
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
							{mockProposals.map((proposal) => (
								<tr
									key={proposal.id}
									className="cursor-pointer hover:bg-zinc-950 transition-colors group"
									onClick={() =>
										setSelectedProposalId(proposal.id)
									}
								>
									<td className="p-4 text-lg">
										{proposal.title}
									</td>
									<td className="p-4 text-center">
										{proposal.status}
									</td>
									<td className="p-4 text-right">
										{proposal.totalVotes}
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
							{mockVotes.map((vote) => (
								<tr
									key={vote.id}
									className="cursor-pointer hover:bg-zinc-950 transition-colors group"
									onClick={() =>
										// For now, let's find by Title
										setSelectedProposalId(
											getProposalIDFromVote(
												vote.proposalID,
											),
										)
									}
								>
									<td className="p-4 text-lg">
										{vote.title}
									</td>
									<td className="p-4 text-center">
										{vote.action}
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
						className={`font-mono text-7xl font-bold leading-none ${!isReadOnly && isRefetching ? "animate-pulse" : ""} ${isReadOnly ? "" : "mb-4"}`}
					>
						{userFairscore}
					</div>

					{/* Only show sync if not read-only */}
					{!isReadOnly && onRefetchFairscore && (
						<button
							onClick={onRefetchFairscore}
							className="flex items-center space-x-2 border border-black px-3 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors"
						>
							<RefreshCw
								size={10}
								className={isRefetching ? "animate-spin" : ""}
							/>
							<span>
								{isRefetching ? "Syncing" : "Re-Sync Score"}
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
