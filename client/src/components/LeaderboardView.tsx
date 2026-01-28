import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, SearchX, ChevronLeft } from "lucide-react";
import SearchBar from "./SearchBar";
import ProfileView from "./ProfileView";
import { fetchAllMemberAccounts } from "../lib/program/utils";

const LeaderboardView: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [selectedUser, setSelectedUser] = useState<
		Awaited<ReturnType<typeof fetchAllMemberAccounts>>[0] | null
	>(null);
	const [members, setMembers] = useState<
		Awaited<ReturnType<typeof fetchAllMemberAccounts>>
	>([]);
	const pageSize = 5;

	const loadAllMembers = useCallback(async () => {
		const members = await fetchAllMemberAccounts();
		const sorted = [...members].sort((a, b) => b.fairScore - a.fairScore);
		setMembers(sorted);
	}, []);

	useEffect(() => {
		loadAllMembers();
	}, [loadAllMembers]);
	// 1. Filter Logic
	const filteredItems = members.filter((user) =>
		user.username.toLowerCase().includes(searchTerm.toLowerCase()),
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
					username={selectedUser.username}
					walletAddress={selectedUser.wallet}
					userFairscore={selectedUser.fairScore}
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
							key={user.publicKey}
							onClick={() => setSelectedUser(user)}
							className={`cursor-pointer border border-white p-6 flex items-center justify-between transition-colors ${
								members.indexOf(user) === 0
									? "bg-white text-black"
									: "bg-black text-white"
							}`}
						>
							<div className="flex items-center space-x-6">
								<div className="font-serif text-3xl font-bold w-12">
									#{members.indexOf(user) + 1}
								</div>
								<div>
									<h3 className="font-serif text-xl font-bold">
										{user.username}
									</h3>
									<p className="font-mono text-sm opacity-70">
										{user.publicKey.slice(0, 10)}...
										{user.publicKey.slice(-4)}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-mono text-4xl font-bold">
									{user.fairScore}
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
