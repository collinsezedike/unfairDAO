import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { fetchFairScore } from "../lib/fairscale/utils";
import { registerMember } from "../lib/program/instructions";
import { fetchMemberAccount } from "../lib/program/utils";

interface WalletConnectionProps {
	onComplete: (address: string, username: string, xUsername: string) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onComplete }) => {
	const { connection } = useConnection();
	const { setVisible } = useWalletModal();
	const { wallet, signTransaction, connected } = useWallet();

	const [username, setUsername] = useState("");
	const [xUsername, setXUsername] = useState("");
	const [useAsX, setUseAsX] = useState(true);
	const [isRegistering, setIsRegistering] = useState(false);

	const fetchMemberAccountDataIfAny = useCallback(async () => {
		if (!wallet?.adapter.publicKey) return;

		const memberAccount = await fetchMemberAccount(
			wallet.adapter.publicKey.toBase58(),
		);
		if (memberAccount) {
			return onComplete(
				wallet.adapter.publicKey.toBase58(),
				memberAccount.username,
				memberAccount.username,
			);
		}
	}, [wallet?.adapter.publicKey]);

	useEffect(() => {
		if (connected) fetchMemberAccountDataIfAny();
	}, [connected, fetchMemberAccountDataIfAny]);

	const handleFinalize = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!wallet?.adapter.publicKey || !signTransaction) {
			return toast.error("Wallet does not support signing");
		}

		setIsRegistering(true);
		try {
			const fairScoreResult = await fetchFairScore(
				wallet.adapter.publicKey.toBase58(),
				username,
			);

			if (!fairScoreResult) {
				return toast.error("Could not retrieve fair score");
			}

			const tx = await registerMember(
				fairScoreResult.fairscore,
				fairScoreResult.social_score,
				fairScoreResult.fairscore_base,
				fairScoreResult.tier,
				username,
				xUsername,
				wallet.adapter.publicKey,
			);

			const signedTx = await signTransaction(tx);
			const signature = await connection.sendRawTransaction(
				signedTx.serialize(),
			);
			const latestBlockhash = await connection.getLatestBlockhash();
			await connection.confirmTransaction({
				blockhash: latestBlockhash.blockhash,
				lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
				signature: signature,
			});

			return onComplete(
				wallet.adapter.publicKey.toBase58(),
				username,
				useAsX ? username.trim() : xUsername.trim(),
			);
		} catch (error) {
			console.error("Failed to register member:", error);
			toast.error("Failed to register member");
		} finally {
			setIsRegistering(false);
		}
	};

	return (
		<div className="min-h-screen bg-black flex items-center justify-center p-6">
			<div className="w-full max-w-lg border border-white bg-black p-8">
				<h1 className="font-serif text-6xl font-bold text-white mb-6">
					UnfairDAO
				</h1>

				{!wallet?.adapter.publicKey ? (
					<div className="space-y-6">
						<p className="font-serif text-white">
							Welcome. Connect your wallet to get started.
						</p>
						<Button
							onClick={() => setVisible(true)}
							className="cursor-pointer w-full bg-white text-black font-serif px-4 py-5 rounded-none border border-white hover:bg-gray-200 transition-colors"
						>
							Connect Wallet
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
								{wallet.adapter.publicKey
									.toBase58()
									.slice(0, 6)}
								...
								{wallet.adapter.publicKey.toBase58().slice(-4)}
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
										value={xUsername}
										onChange={(e) =>
											setXUsername(e.target.value)
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
							disabled={isRegistering}
							className="cursor-pointer w-full mt-3 bg-white text-black font-serif px-4 py-5 rounded-none border border-white disabled:bg-white/10 disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{isRegistering
								? "Registering..."
								: "Complete Registration"}
						</Button>
					</form>
				)}
			</div>
		</div>
	);
};

export default WalletConnection;
