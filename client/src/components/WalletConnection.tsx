import React, { useState } from "react";
import { Button } from "@radix-ui/themes";

interface WalletConnectionProps {
	onComplete: (address: string, username: string, xHandle: string) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onComplete }) => {
	// State Management
	const [isConnecting, setIsConnecting] = useState(false);
	const [walletAddress, setWalletAddress] = useState<string | null>(null);

	// Form State
	const [username, setUsername] = useState("");
	const [xHandle, setXHandle] = useState("");
	const [useAsX, setUseAsX] = useState(true);

	// Phase 1: Connect Wallet
	const handleConnectWallet = async () => {
		setIsConnecting(true);
		// Mock wallet connection delay
		setTimeout(() => {
			const mockAddress = "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4";
			setWalletAddress(mockAddress);
			setIsConnecting(false);
		}, 1000);
	};

	// Phase 2: Submit Profile
	const handleFinalize = (e: React.FormEvent) => {
		e.preventDefault();
		if (!walletAddress) return;

		const profile = {
			username: username.trim(),
			xHandle: useAsX ? `@${username.trim()}` : xHandle.trim(),
		};

		onComplete(walletAddress, username, xHandle);
	};

	return (
		<div className="min-h-screen bg-black flex items-center justify-center p-6">
			<div className="w-full max-w-lg border border-white bg-black p-8">
				<h1 className="font-serif text-6xl font-bold text-white mb-6">
					UnfairDAO
				</h1>

				{!walletAddress ? (
					<div className="space-y-6">
						<p className="font-serif text-white">
							Welcome. Connect your wallet to get started.
						</p>
						<Button
							onClick={handleConnectWallet}
							disabled={isConnecting}
							className="cursor-pointer w-full bg-white text-black font-serif px-4 py-5 rounded-none border border-white hover:bg-gray-200 transition-colors"
						>
							{isConnecting ? "Connecting..." : "Connect Wallet"}
						</Button>
					</div>
				) : (
					<form
						onSubmit={handleFinalize}
						className="space-y-4 animate-in fade-in duration-500"
					>
						<p className="font-serif text-gray-400 text-sm mb-4">
							Connected:{" "}
							<span className="font-mono text-white">
								{walletAddress.slice(0, 6)}...
								{walletAddress.slice(-4)}
							</span>
						</p>

						<label className="block">
							<div className="font-serif text-white mb-3">
								Username
							</div>
							<input
								autoFocus
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="w-full bg-black border border-white text-white px-3 py-3 rounded-none font-serif focus:outline-none focus:ring-1 focus:ring-white"
								placeholder="Enter your username"
								required
							/>
						</label>

						<label className="flex items-center space-x-3 cursor-pointer">
							<input
								type="checkbox"
								checked={useAsX}
								onChange={(e) => setUseAsX(e.target.checked)}
								className="w-4 h-4 bg-black border border-white rounded-none accent-white"
							/>
							<span className="font-serif text-white text-sm">
								Username is the same as X (Twitter) handle
							</span>
						</label>

						{!useAsX && (
							<div className="animate-in slide-in-from-top-2 duration-300">
								<label className="block mt-2">
									<div className="font-serif text-white mb-2">
										X Handle
									</div>
									<input
										autoFocus
										value={xHandle}
										onChange={(e) =>
											setXHandle(e.target.value)
										}
										className="w-full bg-black border border-white text-white px-3 py-3 rounded-none font-serif focus:outline-none focus:ring-1 focus:ring-white"
										placeholder="Enter your X handle"
										required={!useAsX}
									/>
								</label>
							</div>
						)}

						<Button
							type="submit"
							disabled={!username.trim()}
							className="cursor-pointer w-full mt-3 bg-white text-black font-serif px-4 py-5 rounded-none border border-white"
						>
							Complete Sign Up
						</Button>
					</form>
				)}
			</div>
		</div>
	);
};

export default WalletConnection;
