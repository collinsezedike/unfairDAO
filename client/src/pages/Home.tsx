import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import WalletConnection from "../components/WalletConnection";
import Sidebar from "../components/Sidebar";
import ProposalsView from "../components/ProposalsView";
import ProfileView from "../components/ProfileView";
import LeaderboardView from "../components/LeaderboardView";
import { fetchFairScore } from "../lib/fairscale/utils";

export default function Home() {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setWalletAddress] = useState("");
	const [username, setUsername] = useState("");
	const [userFairscore, setUserFairscore] = useState(0);
	const [activeView, setActiveView] = useState("proposals");
	const [isFetchingFairscore, setIsFetchingFairscore] = useState(false);

	const loadFairscore = useCallback(async () => {
		if (!walletAddress || !username) return;

		setIsFetchingFairscore(true);

		const result = await fetchFairScore(walletAddress, username);
		if (result && result.fairscore !== undefined) {
			setUserFairscore(result.fairscore);
		} else toast.error("Could not retrieve score");

		setIsFetchingFairscore(false);
	}, [walletAddress]);

	useEffect(() => {
		if (isConnected) {
			loadFairscore();
		}
	}, [isConnected, loadFairscore]);

	const handleWalletConnect = (
		address: string,
		username: string,
		xHandle: string,
	) => {
		setWalletAddress(address);
		setUsername(username);
		setIsConnected(true);
	};

	if (!isConnected) {
		return <WalletConnection onComplete={handleWalletConnect} />;
	}

	const renderMainContent = () => {
		switch (activeView) {
			case "proposals":
				return (
					<ProposalsView
						userFairscore={userFairscore}
						walletAddress={walletAddress}
					/>
				);
			case "profile":
				return (
					<ProfileView
						walletAddress={walletAddress}
						userFairscore={userFairscore}
						username={username}
						isRefetching={isFetchingFairscore}
						onRefetchFairscore={loadFairscore}
					/>
				);
			case "leaderboard":
				return <LeaderboardView />;
			default:
				return (
					<ProposalsView
						userFairscore={userFairscore}
						walletAddress={walletAddress}
					/>
				);
		}
	};

	return (
		<div className="min-h-screen bg-black flex">
			<Sidebar activeView={activeView} onViewChange={setActiveView} />

			{/* Middle pane */}
			<div className="flex-1 border-r border-white">
				<main className="flex-1 p-8 max-w-4xl mx-auto">
					{renderMainContent()}
				</main>
			</div>

			{/* Right pane */}
			<aside className="w-80 bg-black border-l border-white p-8">
				<div className="border border-white bg-black p-6">
					<h3 className="font-serif text-2xl font-bold text-white mb-4">
						@{username || "—"}
					</h3>
					<div className="space-y-4">
						<div>
							<p className="font-serif text-white text-sm">
								Wallet
							</p>
							<p className="font-mono text-white font-bold">
								{walletAddress.slice(0, 10)}...
								{walletAddress.slice(-4)}
							</p>
						</div>
						<div>
							<p className="font-serif text-white text-sm">
								Fairscore
							</p>
							<p className="font-mono text-xl font-bold text-white">
								{userFairscore}
							</p>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}
