import React, { useCallback, useEffect, useState } from "react";
import ProposalCard from "./ProposalCard";
import NewProposalForm from "./NewProposalForm";
import ProposalDetails from "./ProposalDetails";
import { fetchAllProposalAccounts } from "../lib/program/utils";
import { Ghost } from "lucide-react";

interface ProposalsViewProps {
	userFairscore: number;
	walletAddress: string;
}

const ProposalsView: React.FC<ProposalsViewProps> = ({
	userFairscore,
	walletAddress,
}) => {
	const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
		null,
	);
	const [proposals, setProposals] = useState<
		Awaited<ReturnType<typeof fetchAllProposalAccounts>>
	>([]);

	const loadProposalAccountsData = useCallback(async () => {
		if (!walletAddress) return;
		const proposals = await fetchAllProposalAccounts();
		setProposals(proposals);
	}, [walletAddress]);

	useEffect(() => {
		loadProposalAccountsData();
	}, [loadProposalAccountsData]);

	const activeProposal = proposals.find(
		(p) => p.publicKey === selectedProposalId,
	);

	if (activeProposal) {
		return (
			<ProposalDetails
				userFairscore={userFairscore}
				onBack={() => setSelectedProposalId(null)}
				proposal={activeProposal}
				walletAddress={walletAddress}
			/>
		);
	}

	return (
		<div className="space-y-8">
			<NewProposalForm onSubmit={loadProposalAccountsData} />

			<div className="space-y-4">
				{proposals.length > 0 ? (
					proposals.map((proposal) => (
						<ProposalCard
							key={proposal.publicKey}
							proposal={proposal}
							userFairscore={userFairscore}
							onClick={() =>
								setSelectedProposalId(proposal.publicKey)
							}
						/>
					))
				) : (
					<div className="border border-white bg-black p-16 text-center flex flex-col items-center justify-center space-y-4">
						<div className="p-4 rounded-full">
							<Ghost
								size={60}
								className="text-white"
								strokeWidth={1.5}
							/>
						</div>
						<div className="max-w-xs">
							<h3 className="text-white text-xl mb-3">
								The DAO is Silent
							</h3>
							<p className="text-zinc-500 mt-2">
								No active proposals found. Use the form above to
								submit a new proposal.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProposalsView;
