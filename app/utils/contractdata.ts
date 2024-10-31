export const CONTRACT_ADDRESS = "0x2Fe28e60d6272e833CeC32F6b1cdC9D4eE8744bd";
export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_programId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_storeId",
				"type": "string"
			}
		],
		"name": "createGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getGames",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "programId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "storeId",
						"type": "string"
					}
				],
				"internalType": "struct Wordle.Game[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];