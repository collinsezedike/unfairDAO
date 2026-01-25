import React from "react";
import {
	ArrowLeft,
	User,
	Clock,
	CheckCircle2,
	XCircle,
	Info,
} from "lucide-react";

interface ProposalDetailsProps {
	proposal: {
		id: string;
		title: string;
		description: string;
		author: string;
		status: "Active" | "Passed" | "Failed";
		endTime: string;
		votesFor: number;
		votesAgainst: number;
		quorum: number;
		scoreThreshold: number;
		scoreLimit: number;
	};
	onBack: () => void;
	userFairscore: number;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({
	proposal,
	onBack,
	userFairscore,
}) => {
	const totalVotes = proposal.votesFor + proposal.votesAgainst;
	const forPercentage =
		totalVotes === 0 ? 0 : (proposal.votesFor / totalVotes) * 100;

	const isTooLow = userFairscore < proposal.scoreThreshold;
	const isTooHigh = userFairscore > proposal.scoreLimit;
	const canVote = !isTooLow && !isTooHigh;

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Navigation & Status Header */}
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

			{/* Title Block */}
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
								{proposal.author.slice(0, 12)}...
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-3 text-gray-400">
						<Clock size={18} />
						<div>
							<p className="font-serif text-[10px] uppercase tracking-widest">
								Ending In
							</p>
							<p className="font-mono text-white text-sm">
								{proposal.endTime}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-3 text-gray-400">
						<Info size={18} />
						<div>
							<p className="font-serif text-[10px] uppercase tracking-widest">
								Quorum
							</p>
							<p className="font-mono text-white text-sm">
								{proposal.quorum} FS Required
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
						{totalVotes} FS Total Weight
					</p>
				</div>

				{/* Custom Progress Bar */}
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
							{proposal.votesFor} FS
						</p>
					</div>
					<div className="border border-white p-4">
						<p className="font-serif text-gray-400 text-xs uppercase mb-1">
							Oppose
						</p>
						<p className="font-mono text-3xl font-bold text-white">
							{proposal.votesAgainst} FS
						</p>
					</div>
				</div>
			</section>

			{/* Main Content & Description */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 border border-white bg-black p-8">
					<h3 className="font-serif text-2xl font-bold text-white mb-6 border-b border-white pb-2 inline-block">
						Description
					</h3>
					<div className="font-serif text-white leading-relaxed text-lg whitespace-pre-line">
						{proposal.description}
					</div>
				</div>

				{/* Vote Action Box */}
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

					{canVote ? (
						/* QUALIFIED STATE */
						<div className="space-y-4">
							<p className="font-serif text-black text-sm mb-4">
								You are eligible to vote on this proposal. Your
								weight of {userFairscore} will be applied.
							</p>
							<button className="w-full flex items-center justify-center gap-2 bg-black text-white font-serif py-4 border border-black hover:bg-zinc-800 transition-colors uppercase tracking-widest">
								<CheckCircle2 size={18} /> Support
							</button>
							<button className="w-full flex items-center justify-center gap-2 bg-transparent text-black font-serif py-4 border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest">
								<XCircle size={18} /> Oppose
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
							<button
								disabled
								className="w-full bg-black/10 text-black/40 font-serif py-4 border border-black/20 cursor-not-allowed uppercase tracking-widest"
							>
								Locked
							</button>
						</div>
					)}
				</aside>
			</div>
		</div>
	);
};

export default ProposalDetails;
