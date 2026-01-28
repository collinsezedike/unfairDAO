import React, { useState } from "react";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ChevronDown, PlusCircle, XSquare } from "lucide-react";
import { submitProposal } from "../lib/program/instructions";
import { getTierFromScore, TIER_SCORES } from "../lib/fairscale/utils";

interface NewProposalFormProps {
	onSubmit: () => void;
}

const NewProposalForm: React.FC<NewProposalFormProps> = ({ onSubmit }) => {
	const { connection } = useConnection();
	const { wallet, signTransaction } = useWallet();

	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		scoreThreshold: 0,
		scoreLimit: 1000,
		quorum: 50,
		endTime: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!wallet?.adapter.publicKey || !signTransaction) {
			return toast.error("Wallet does not support signing");
		}

		setIsSubmitting(true);
		try {
			const endTimeSeconds = Math.floor(
				new Date(formData.endTime).getTime() / 1000,
			);

			if (isNaN(endTimeSeconds)) {
				return toast.error("Invalid end time selected");
			}

			const tx = await submitProposal(
				formData.title,
				formData.description,
				formData.scoreLimit,
				formData.scoreThreshold,
				formData.quorum,
				endTimeSeconds,
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
			onSubmit();
			setFormData({
				title: "",
				description: "",
				scoreThreshold: 0,
				scoreLimit: 1000,
				quorum: 50,
				endTime: "",
			});
			setIsOpen(false);
		} catch (error) {
			console.error("Failed to register member:", error);
			toast.error("Failed to register member");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleTierSelect = (
		type: "scoreThreshold" | "scoreLimit",
		tierName: string,
	) => {
		setFormData({
			...formData,
			[type]: TIER_SCORES[tierName],
		});
	};

	const handleScoreInput = (
		type: "scoreThreshold" | "scoreLimit",
		value: string,
	) => {
		setFormData({
			...formData,
			[type]: parseInt(value) || 0,
		});
	};

	return (
		<div className="mb-6">
			{!isOpen ? (
				<button
					onClick={() => setIsOpen(true)}
					className="w-full flex items-center justify-center gap-2 text-white font-serif text-lg py-3 border border-white bg-black rounded-none hover:bg-white hover:text-black transition-colors group"
				>
					<PlusCircle size={20} className="group-hover:text-black" />
					<span>Submit New Proposal</span>
				</button>
			) : (
				<form
					onSubmit={handleSubmit}
					className="border border-white bg-black p-6 mt-4"
				>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-serif text-2xl font-bold text-white">
							New Proposal
						</h3>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="text-white font-mono text-sm uppercase rounded-none px-3 py-1"
						>
							<XSquare />
						</button>
					</div>

					<div className="space-y-4">
						<input
							type="text"
							placeholder="Proposal Title"
							value={formData.title}
							onChange={(e) =>
								setFormData({
									...formData,
									title: e.target.value,
								})
							}
							className="w-full bg-black border border-white text-white font-serif px-3 py-2 focus:outline-none rounded-none"
							required
						/>
						<textarea
							placeholder="Proposal Description"
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							className="w-full bg-black border border-white text-white font-serif px-3 py-2 h-28 resize-none focus:outline-none rounded-none"
							required
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="font-serif text-xs text-zinc-500 uppercase tracking-widest">
									Minimum Tier
								</label>
								<div className="relative">
									<select
										value={getTierFromScore(
											formData.scoreThreshold,
										)}
										onChange={(e) =>
											handleTierSelect(
												"scoreThreshold",
												e.target.value,
											)
										}
										className="w-full bg-black border border-white text-white font-serif px-4 py-3 rounded-none appearance-none cursor-pointer focus:border-zinc-400 outline-none"
									>
										{Object.keys(TIER_SCORES).map(
											(tier) => (
												<option key={tier} value={tier}>
													{tier} (Score:{" "}
													{TIER_SCORES[tier]}+)
												</option>
											),
										)}
									</select>
									<ChevronDown
										size={16}
										className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label className="font-serif text-xs text-zinc-500 uppercase tracking-widest">
									Maximum Tier
								</label>
								<div className="relative">
									<select
										value={getTierFromScore(
											formData.scoreLimit,
										)}
										onChange={(e) =>
											handleTierSelect(
												"scoreLimit",
												e.target.value,
											)
										}
										className="w-full bg-black border border-white text-white font-serif px-4 py-3 rounded-none appearance-none cursor-pointer focus:border-zinc-400 outline-none"
									>
										{Object.keys(TIER_SCORES).map(
											(tier) => (
												<option key={tier} value={tier}>
													{tier} (Score:{" "}
													{TIER_SCORES[tier]}+)
												</option>
											),
										)}
									</select>
									<ChevronDown
										size={16}
										className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
									/>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<input
								type="number"
								min={0}
								max={1000}
								placeholder="Score Threshold"
								value={formData.scoreThreshold}
								onChange={(e) =>
									handleScoreInput(
										"scoreThreshold",
										e.target.value,
									)
								}
								className="bg-black border border-white text-white font-serif px-3 py-2 focus:outline-none rounded-none"
								required
							/>
							<input
								type="number"
								min={0}
								max={1000}
								placeholder="Score Limit"
								value={formData.scoreLimit}
								onChange={(e) =>
									handleScoreInput(
										"scoreLimit",
										e.target.value,
									)
								}
								className="bg-black border border-white text-white font-serif px-3 py-2 focus:outline-none rounded-none"
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="font-serif text-xs text-zinc-500 uppercase tracking-widest">
								Quorum (%)
							</label>
							<input
								type="number"
								min={1}
								value={formData.quorum}
								onChange={(e) =>
									setFormData({
										...formData,
										quorum: parseInt(e.target.value) || 0,
									})
								}
								className="w-full bg-black border border-white text-white font-serif px-3 py-2 focus:outline-none rounded-none"
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="font-serif text-xs text-zinc-500 uppercase tracking-widest">
								End Date & Time
							</label>
							<input
								type="datetime-local"
								value={formData.endTime}
								onChange={(e) =>
									setFormData({
										...formData,
										endTime: e.target.value,
									})
								}
								className="w-full bg-black border border-white text-white font-serif px-3 py-2 focus:outline-none rounded-none [color-scheme:dark]"
								required
							/>
						</div>
					</div>

					<div className="mt-6 grid grid-cols-2 gap-3">
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-white text-black font-serif px-3 py-3 border border-white rounded-none disabled:bg-white/10 disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</button>
						<button
							type="button"
							disabled={isSubmitting}
							onClick={() => {
								setIsOpen(false);
							}}
							className="w-full bg-transparent text-white font-serif px-3 py-3 border border-white rounded-none"
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default NewProposalForm;
