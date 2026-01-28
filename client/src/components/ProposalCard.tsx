import React from "react";
import type { fetchAllProposalAccounts } from "../lib/program/utils";
import { getTierFromScore } from "../lib/fairscale/utils";

interface ProposalCardProps {
	proposal: Awaited<ReturnType<typeof fetchAllProposalAccounts>>[0];
	userFairscore: number;
	onClick: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
	proposal,
	userFairscore,
	onClick,
}) => {
	const canVote =
		userFairscore > proposal.scoreThreshold &&
		userFairscore < proposal.scoreLimit;

	return (
		<div
			className="relative border border-white bg-black p-6 mb-4"
			onClick={onClick}
		>
			{!canVote && (
				<div className="absolute inset-0 bg-white/10 z-10"></div>
			)}

			<div className="relative z-20 cursor-pointer">
				<h3 className="font-serif text-2xl font-bold text-white mb-3">
					{proposal.title}
				</h3>
				<p className="font-serif text-white mb-4 leading-relaxed">
					{proposal.description}
				</p>

				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
					<div className="text-white">
						<p className="font-serif text-sm">Author:</p>
						<p className="font-mono text-sm text-white">
							{proposal.author}
						</p>
					</div>

					<div className="mt-3 md:mt-0 text-white">
						<p className="font-serif text-sm">Tier Threshold:</p>
						<p className="font-mono text-sm text-white">
							{getTierFromScore(proposal.scoreThreshold)}
						</p>
						<p className="font-serif text-sm mt-2">Tier Limit:</p>
						<p className="font-mono text-sm text-white">
							{getTierFromScore(proposal.scoreLimit)}
						</p>
					</div>
				</div>

				{canVote ? (
					<button className="w-full bg-white text-black font-serif text-lg py-3 border border-white rounded-none hover:bg-black hover:text-white">
						Vote
					</button>
				) : (
					<button
						disabled
						className="w-full bg-transparent text-white font-mono text-sm uppercase py-3 border border-white rounded-none opacity-70 cursor-not-allowed tracking-wide"
						title={`Fairscore must be up to ${proposal.scoreThreshold} and less than ${proposal.scoreLimit}`}
					>
						FAIRSCORE DOES NOT QUALIFY
					</button>
				)}
			</div>
		</div>
	);
};

export default ProposalCard;
