import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import WalletConnection from "../components/WalletConnection";
import Sidebar from "../components/Sidebar";
import ProposalsView from "../components/ProposalsView";
import ProfileView from "../components/ProfileView";
import LeaderboardView from "../components/LeaderboardView";
import { fetchMemberAccount } from "../lib/program/utils";

export default function Home() {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setWalletAddress] = useState("");
	const [username, setUsername] = useState("");
	const [activeView, setActiveView] = useState("proposals");
	const [memberAccountData, setMemberAccountData] =
		useState<Awaited<ReturnType<typeof fetchMemberAccount>>>(null);

	const loadMemberAccountData = useCallback(async () => {
		if (!walletAddress || !username) return;
		const memberAccount = await fetchMemberAccount(walletAddress);
		if (!memberAccount) return toast.error("Could not retrieve score");
		setMemberAccountData(memberAccount);
	}, [walletAddress]);

	useEffect(() => {
		if (isConnected) loadMemberAccountData();
	}, [isConnected, loadMemberAccountData]);

	const handlePostWalletConnect = async (
		address: string,
		username: string,
		xHandle: string,
	) => {
		setWalletAddress(address);
		setUsername(username);
		setIsConnected(true);
	};

	if (!isConnected) {
		return <WalletConnection onComplete={handlePostWalletConnect} />;
	}

	const renderMainContent = () => {
		switch (activeView) {
			case "proposals":
				return (
					<ProposalsView
						userFairscore={memberAccountData?.fairScore || 0}
						walletAddress={walletAddress}
					/>
				);
			case "profile":
				return (
					<ProfileView
						walletAddress={walletAddress}
						userFairscore={memberAccountData?.fairScore || 0}
						username={username}
					/>
				);
			case "leaderboard":
				return <LeaderboardView />;
			default:
				return (
					<ProposalsView
						userFairscore={memberAccountData?.fairScore || 0}
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
								{memberAccountData?.fairScore}
							</p>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}
