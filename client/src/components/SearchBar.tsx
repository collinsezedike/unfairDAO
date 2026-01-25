import React from "react";

interface SearchBarProps {
	value: string;
	onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onSearch }) => {
	return (
		<div className="relative mb-8">
			<input
				type="text"
				placeholder="Search username..."
				value={value}
				onChange={(e) => onSearch(e.target.value)}
				className="w-full bg-black text-white font-serif text-lg py-2 px-0 border-0 border-b border-white focus:outline-none focus:ring-0 placeholder-white/60 rounded-none"
			/>
		</div>
	);
};

export default SearchBar;
