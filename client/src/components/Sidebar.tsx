import React from "react";
import { FileText, Trophy, User } from "lucide-react";

interface SidebarProps {
	activeView: string;
	onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
	const navItems = [
		{ id: "proposals", icon: FileText, label: "Proposals" },
		{ id: "leaderboard", icon: Trophy, label: "Leaderboard" },
		{ id: "profile", icon: User, label: "Profile" },
	];

	return (
		<div className="w-20 bg-black border-r border-white flex flex-col items-center py-8">
			<div className="mt-6 mb-12">
				<h1 className="font-serif text-white text-2xl font-bold transform -rotate-90 whitespace-nowrap">
					UnfairDAO
				</h1>
			</div>
			<nav className="flex flex-col space-y-5 mt-5">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<button
							key={item.id}
							onClick={() => onViewChange(item.id)}
							className={`p-3 transition-colors ${
								activeView === item.id
									? "bg-white text-black"
									: "text-white hover:bg-white hover:text-black"
							}`}
							aria-label={item.label}
						>
							<Icon size={24} />
						</button>
					);
				})}
			</nav>
		</div>
	);
};

export default Sidebar;
