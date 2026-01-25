import React, { useState } from "react";
import ProposalCard from "./ProposalCard";
import NewProposalForm from "./NewProposalForm";
import ProposalDetails from "./ProposalDetails";

interface ProposalsViewProps {
	userFairscore: number;
	walletAddress: string;
}

interface Proposal {
	id: string;
	title: string;
	description: string;
	author: string;
	scoreThreshold: number;
	scoreLimit: number;
}

const ProposalsView: React.FC<ProposalsViewProps> = ({
	userFairscore,
	walletAddress,
}) => {
	const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
		null,
	);
	const [proposals, setProposals] = useState<Proposal[]>([
		{
			id: "1",
			title: "Implement Quadratic Voting",
			description:
				"Proposal to implement quadratic voting mechanism for more democratic decision making in the DAO.",
			author: "0x742d35Cc...3b8D4",
			scoreThreshold: 25,
			scoreLimit: 100,
		},
		{
			id: "2",
			title: "Treasury Diversification",
			description:
				"Diversify DAO treasury across multiple assets to reduce risk and increase long-term sustainability.",
			author: "0x8f3e2a1b...9c7d6",
			scoreThreshold: 75,
			scoreLimit: 150,
		},
		{
			id: "3",
			title: "Community Rewards Program",
			description:
				"Launch a comprehensive rewards program to incentivize active participation and contribution.",
			author: "0x1a2b3c4d...5e6f7",
			scoreThreshold: 40,
			scoreLimit: 120,
		},
	]);

	const handleNewProposal = (proposalData: {
		title: string;
		description: string;
		scoreThreshold: number;
		scoreLimit: number;
	}) => {
		const newProposal = {
			id: Date.now().toString(),
			...proposalData,
			author: `${walletAddress.slice(0, 10)}...${walletAddress.slice(-4)}`,
		};
		setProposals([newProposal, ...proposals]);
	};

	const activeProposal = proposals.find((p) => p.id === selectedProposalId);

	// If a proposal is clicked, show the details screen
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

	return (
		<div>
			<NewProposalForm onSubmit={handleNewProposal} />
			<div className="space-y-4">
				{proposals.map((proposal) => (
					<ProposalCard
						key={proposal.id}
						proposal={proposal}
						userFairscore={userFairscore}
						onClick={() => setSelectedProposalId(proposal.id)}
					/>
				))}
			</div>
		</div>
	);
};

export default ProposalsView;
