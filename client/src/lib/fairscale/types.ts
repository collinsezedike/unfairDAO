type Tier = "bronze" | "silver" | "gold" | "platinum";

export interface Badge {
	id: string;
	label: string;
	description: string;
	tier: Tier;
}

export interface Features {
	lst_percentile_score: number;
	major_percentile_score: number;
	native_sol_percentile: number;
	stable_percentile_score: number;
	tx_count: number;
	active_days: number;
	median_gap_hours: number;
	tempo_cv: number;
	burst_ratio: number;
	net_sol_flow_30d: number;
	median_hold_days: number;
	no_instant_dumps: number;
	conviction_ratio: number;
	platform_diversity: number;
	wallet_age_days: number;
}

export interface FairScoreResponse {
	wallet: string;
	fairscore_base: number;
	social_score: number;
	fairscore: number;
	badges: Badge[];
	actions: any[];
	tier: Tier;
	timestamp: string;
	features: Features;
}
