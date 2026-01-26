import type { FairScoreResponse } from "./types";

const FAIRSCALE_API_URL = "https://api.fairscale.xyz";
const FAIRSCALE_API_KEY = import.meta.env.VITE_FAIRSCALE_API_KEY;

export const fetchFairScore = async (
	walletAddress: string,
	username: string,
) => {
	try {
		const response = await fetch(
			`${FAIRSCALE_API_URL}/score?wallet=${walletAddress}&twitter=${username}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					fairkey: FAIRSCALE_API_KEY,
				},
			},
		);

		if (!response.ok) {
			throw new Error(
				`Error: ${response.status} - ${response.statusText}`,
			);
		}

		const data: FairScoreResponse = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to fetch user score:", error);
		return null;
	}
};
