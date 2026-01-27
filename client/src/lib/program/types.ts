/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/unfair_dao.json`.
 */
export type UnfairDao = {
	address: "9M2SG9z7A4S4hmrU4fDFjzLBAGw4A8LFRjK13E5BupN7";
	metadata: {
		name: "unfairDao";
		version: "0.1.0";
		spec: "0.1.0";
		description: "Created with Anchor";
	};
	instructions: [
		{
			name: "registerMember";
			discriminator: [44, 19, 160, 59, 17, 122, 38, 16];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "newMember";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [109, 101, 109, 98, 101, 114];
							},
							{
								kind: "account";
								path: "signer";
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "fairScore";
					type: "u16";
				},
				{
					name: "socialScore";
					type: "u16";
				},
				{
					name: "walletScore";
					type: "u16";
				},
				{
					name: "tier";
					type: {
						defined: {
							name: "tierType";
						};
					};
				},
				{
					name: "username";
					type: "string";
				},
				{
					name: "xUsername";
					type: "string";
				},
			];
		},
		{
			name: "submitProposal";
			discriminator: [224, 38, 210, 52, 167, 150, 221, 150];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "member";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [109, 101, 109, 98, 101, 114];
							},
							{
								kind: "account";
								path: "signer";
							},
						];
					};
				},
				{
					name: "newProposal";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 114, 111, 112, 111, 115, 97, 108];
							},
							{
								kind: "arg";
								path: "title";
							},
							{
								kind: "account";
								path: "member";
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "title";
					type: "string";
				},
				{
					name: "description";
					type: "string";
				},
				{
					name: "scoreLimit";
					type: "u16";
				},
				{
					name: "scoreThreshold";
					type: "u16";
				},
				{
					name: "quorum";
					type: "u32";
				},
				{
					name: "endTime";
					type: "i64";
				},
			];
		},
		{
			name: "updateMember";
			discriminator: [46, 229, 3, 194, 47, 105, 211, 28];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "memberAccount";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [109, 101, 109, 98, 101, 114];
							},
							{
								kind: "account";
								path: "signer";
							},
						];
					};
				},
			];
			args: [
				{
					name: "fairScore";
					type: "u16";
				},
				{
					name: "socialScore";
					type: "u16";
				},
				{
					name: "walletScore";
					type: "u16";
				},
				{
					name: "tier";
					type: {
						defined: {
							name: "tierType";
						};
					};
				},
			];
		},
		{
			name: "voteProposal";
			discriminator: [247, 104, 114, 240, 237, 41, 200, 36];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "member";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [109, 101, 109, 98, 101, 114];
							},
							{
								kind: "account";
								path: "signer";
							},
						];
					};
				},
				{
					name: "proposal";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 114, 111, 112, 111, 115, 97, 108];
							},
							{
								kind: "account";
								path: "proposal.title";
								account: "proposal";
							},
							{
								kind: "account";
								path: "member";
							},
						];
					};
				},
				{
					name: "newVote";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [118, 111, 116, 101];
							},
							{
								kind: "account";
								path: "proposal";
							},
							{
								kind: "account";
								path: "member";
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "vote";
					type: {
						defined: {
							name: "voteType";
						};
					};
				},
			];
		},
	];
	accounts: [
		{
			name: "member";
			discriminator: [54, 19, 162, 21, 29, 166, 17, 198];
		},
		{
			name: "proposal";
			discriminator: [26, 94, 189, 187, 116, 136, 53, 33];
		},
		{
			name: "vote";
			discriminator: [96, 91, 104, 57, 145, 35, 172, 155];
		},
	];
	errors: [
		{
			code: 6000;
			name: "countOutOfRange";
			msg: "Count overflow or underflow";
		},
		{
			code: 6001;
			name: "unqualified";
			msg: "Fair score not within proposal boundaries";
		},
	];
	types: [
		{
			name: "member";
			type: {
				kind: "struct";
				fields: [
					{
						name: "bump";
						type: "u8";
					},
					{
						name: "fairScore";
						type: "u16";
					},
					{
						name: "socialScore";
						type: "u16";
					},
					{
						name: "walletScore";
						type: "u16";
					},
					{
						name: "tier";
						type: {
							defined: {
								name: "tierType";
							};
						};
					},
					{
						name: "username";
						type: "string";
					},
					{
						name: "xUsername";
						type: "string";
					},
					{
						name: "wallet";
						type: "pubkey";
					},
				];
			};
		},
		{
			name: "proposal";
			type: {
				kind: "struct";
				fields: [
					{
						name: "bump";
						type: "u8";
					},
					{
						name: "scoreLimit";
						type: "u16";
					},
					{
						name: "scoreThreshold";
						type: "u16";
					},
					{
						name: "votesAgainst";
						type: "u32";
					},
					{
						name: "votesFor";
						type: "u32";
					},
					{
						name: "quorum";
						type: "u32";
					},
					{
						name: "endTime";
						type: "i64";
					},
					{
						name: "status";
						type: {
							defined: {
								name: "statusType";
							};
						};
					},
					{
						name: "title";
						type: "string";
					},
					{
						name: "description";
						type: "string";
					},
					{
						name: "author";
						type: "pubkey";
					},
				];
			};
		},
		{
			name: "statusType";
			type: {
				kind: "enum";
				variants: [
					{
						name: "active";
					},
					{
						name: "approved";
					},
					{
						name: "rejected";
					},
				];
			};
		},
		{
			name: "tierType";
			type: {
				kind: "enum";
				variants: [
					{
						name: "bronze";
					},
					{
						name: "silver";
					},
					{
						name: "gold";
					},
					{
						name: "platinum";
					},
				];
			};
		},
		{
			name: "vote";
			type: {
				kind: "struct";
				fields: [
					{
						name: "bump";
						type: "u8";
					},
					{
						name: "weight";
						type: "u16";
					},
					{
						name: "vote";
						type: {
							defined: {
								name: "voteType";
							};
						};
					},
					{
						name: "proposal";
						type: "pubkey";
					},
					{
						name: "member";
						type: "pubkey";
					},
				];
			};
		},
		{
			name: "voteType";
			type: {
				kind: "enum";
				variants: [
					{
						name: "approve";
					},
					{
						name: "reject";
					},
				];
			};
		},
	];
	constants: [
		{
			name: "seed";
			type: "string";
			value: '"anchor"';
		},
	];
};
