import React, { useState } from "react";
import { PlusCircle, XSquare } from "lucide-react";

interface NewProposalFormProps {
	onSubmit: (proposal: {
		title: string;
		description: string;
		scoreThreshold: number;
		scoreLimit: number;
	}) => void;
}

const NewProposalForm: React.FC<NewProposalFormProps> = ({ onSubmit }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		scoreThreshold: 0,
		scoreLimit: 100,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({
			title: "",
			description: "",
			scoreThreshold: 0,
			scoreLimit: 100,
		});
		setIsOpen(false);
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
						<div className="grid grid-cols-2 gap-4">
							<input
								type="number"
								min={0}
								max={1000}
								placeholder="Score Threshold"
								value={formData.scoreThreshold}
								onChange={(e) =>
									setFormData({
										...formData,
										scoreThreshold:
											parseInt(e.target.value) || 0,
									})
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
									setFormData({
										...formData,
										scoreLimit:
											parseInt(e.target.value) || 100,
									})
								}
								className="bg-black border border-white text-white font-serif px-3 py-2 focus:outline-none rounded-none"
								required
							/>
						</div>
					</div>

					<div className="mt-6 grid grid-cols-2 gap-3">
						<button
							type="submit"
							className="w-full bg-white text-black font-serif px-3 py-3 border border-white rounded-none"
						>
							Submit
						</button>
						<button
							type="button"
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
