import React, { useState } from "react";
import { ArrowRight, ArrowLeft, SearchX, ChevronLeft } from "lucide-react";
import SearchBar from "./SearchBar";
import ProfileView from "./ProfileView";

interface IUser {
	rank: number;
	address: string;
	score: number;
	name: string;
}

const LeaderboardView: React.FC = () => {
	const mockLeaderboard = [
		{
			rank: 1,
			address: "0x742d35Cc6634C0532925a3b8D4",
			score: 150,
			name: "CryptoWhale",
		},
		{
			rank: 2,
			address: "0x8f3e2a1b9c7d6e5f4a3b2c1d0e9f8",
			score: 142,
			name: "DAOBuilder",
		},
		{
			rank: 3,
			address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5",
			score: 138,
			name: "GovernanceGuru",
		},
		{
			rank: 4,
			address: "0x9f8e7d6c5b4a3928374650192837",
			score: 125,
			name: "TokenMaster",
		},
		{
			rank: 5,
			address: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9",
			score: 118,
			name: "VoteValidator",
		},
		{
			rank: 6,
			address: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
			score: 112,
			name: "ProposalPro",
		},
		{
			rank: 7,
			address: "0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1",
			score: 105,
			name: "ConsensusKing",
		},
		{
			rank: 8,
			address: "0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6",
			score: 98,
			name: "DecentralizedDev",
		},
		{
			rank: 9,
			address: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
			score: 92,
			name: "SmartContractor",
		},
		{
			rank: 10,
			address: "0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4",
			score: 87,
			name: "BlockchainBoss",
		},
	];

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
	const [page, setPage] = useState(1);
	const pageSize = 5;

	// 1. Filter Logic
	const filteredItems = mockLeaderboard.filter((user) =>
		user.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// 2. Pagination Logic (on filtered results)
	const totalPages = Math.ceil(filteredItems.length / pageSize);
	const pageItems = filteredItems.slice(
		(page - 1) * pageSize,
		page * pageSize,
	);

	if (selectedUser) {
		return (
			<div>
				<button
					onClick={() => setSelectedUser(null)}
					className="flex items-center gap-2 text-white font-serif mb-6 hover:underline"
				>
					<ChevronLeft size={20} /> Back to Leaderboard
				</button>
				<ProfileView
					username={selectedUser.name}
					walletAddress={selectedUser.address}
					userFairscore={selectedUser.score}
					isReadOnly={true}
				/>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-500">
			<div className="border border-white bg-black p-8 mb-8">
				<h2 className="font-serif text-4xl font-bold text-white">
					Leaderboard
				</h2>
				<p className="font-serif text-lg text-white mt-2">
					Top OGs in the DAO
				</p>
			</div>

			<SearchBar
				value={searchTerm}
				onSearch={(val) => {
					setSearchTerm(val);
					setPage(1);
				}}
			/>

			{filteredItems.length > 0 ? (
				<div className="space-y-4">
					{pageItems.map((user) => (
						<div
							key={user.address}
							onClick={() => setSelectedUser(user)}
							className={`cursor-pointer border border-white p-6 flex items-center justify-between transition-colors ${
								user.rank === 1
									? "bg-white text-black"
									: "bg-black text-white"
							}`}
						>
							<div className="flex items-center space-x-6">
								<div className="font-serif text-3xl font-bold w-12">
									#{user.rank}
								</div>
								<div>
									<h3 className="font-serif text-xl font-bold">
										{user.name}
									</h3>
									<p className="font-mono text-sm opacity-70">
										{user.address.slice(0, 10)}...
										{user.address.slice(-4)}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-mono text-4xl font-bold">
									{user.score}
								</p>
								<p className="font-serif text-lg">Fairscore</p>
							</div>
						</div>
					))}

					{/* Pagination - Only show if there are results */}
					<div className="mt-8 flex justify-between items-center border-t border-white pt-6">
						<button
							onClick={() => setPage(Math.max(1, page - 1))}
							disabled={page === 1}
							className="font-serif text-white disabled:opacity-30 flex items-center gap-2 hover:underline"
						>
							<ArrowLeft size={18} /> Prev
						</button>
						<div className="font-serif text-white">
							Page {page} of {Math.max(1, totalPages)}
						</div>
						<button
							onClick={() =>
								setPage(Math.min(totalPages, page + 1))
							}
							disabled={page === totalPages || totalPages === 0}
							className="font-serif text-white disabled:opacity-30 flex items-center gap-2 hover:underline"
						>
							Next <ArrowRight size={18} />
						</button>
					</div>
				</div>
			) : (
				/* 4. Not Found Screen */
				<div className="border border-white bg-black p-12 flex flex-col items-center justify-center text-center">
					<SearchX size={48} className="text-white mb-4 opacity-50" />
					<h3 className="font-serif text-2xl font-bold text-white mb-2">
						No Member Found
					</h3>
					<p className="font-serif text-gray-400 max-w-xs">
						We couldn't find anyone matching "
						<span className="text-white italic">{searchTerm}</span>
						". Try checking the spelling or use a different name.
					</p>
					<button
						onClick={() => setSearchTerm("")}
						className="mt-6 font-serif text-black bg-white px-6 py-2 border border-white hover:bg-black hover:text-white transition-colors"
					>
						Clear Search
					</button>
				</div>
			)}
		</div>
	);
};

export default LeaderboardView;
