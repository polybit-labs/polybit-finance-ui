export const IPolybitTheme = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "msg",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ref",
                "type": "uint256"
            }
        ],
        "name": "Deposited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "asset",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "EmergencyWithdrawToken",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "EthBalance",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "msg",
                "type": "string"
            }
        ],
        "name": "LiquidityTest",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "msg",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "name": "OwnedAssets",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "ProcessFee",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "msg",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ref",
                "type": "uint256"
            }
        ],
        "name": "Withdraw",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "emergencyWithdrawTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCloseTimestamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCreationTimestamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDeposits",
        "outputs": [
            {
                "internalType": "uint256[][]",
                "name": "",
                "type": "uint256[][]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getEthBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFeesPaid",
        "outputs": [
            {
                "internalType": "uint256[][]",
                "name": "",
                "type": "uint256[][]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFinalAssets",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFinalBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLastRebalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOwnedAssets",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getProductCategory",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getProductDimension",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStatus",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTimeLock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTimeLockRemaining",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenPrice",
                "type": "uint256"
            }
        ],
        "name": "getTokenBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "ownedAssetsPrices",
                "type": "uint256[]"
            }
        ],
        "name": "getTotalBalanceInWeth",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalDeposited",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWethBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_polybitThemeAccessAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_polybitThemeConfigAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_walletOwnerAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_polybitThemeFactoryAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_productId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_productCategory",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_productDimension",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "address[]",
                        "name": "sellList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "sellListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "sellOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustToSellList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToSellPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "adjustToSellOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustToBuyList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToBuyWeights",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToBuyPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "adjustToBuyOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "buyList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "buyListWeights",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "buyListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "buyOrders",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct PolybitTheme.SwapOrders[]",
                "name": "_orderData",
                "type": "tuple[]"
            },
            {
                "internalType": "uint256",
                "name": "_lockTimestamp",
                "type": "uint256"
            }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "polybitThemeAccessAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "polybitThemeConfigAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "polybitThemeFactoryAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address[]",
                        "name": "sellList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "sellListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "sellOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustToSellList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToSellPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "adjustToSellOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustToBuyList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToBuyWeights",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToBuyPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "adjustToBuyOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "buyList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "buyListWeights",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "buyListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "buyOrders",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct PolybitTheme.SwapOrders[]",
                "name": "orderData",
                "type": "tuple[]"
            }
        ],
        "name": "rebalanceThemeContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "unixTimeLock",
                "type": "uint256"
            }
        ],
        "name": "setTimeLock",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "walletOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address[]",
                        "name": "sellList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "sellListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "sellOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustToSellList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToSellPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "adjustToSellOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adjustToBuyList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToBuyWeights",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "adjustToBuyPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "adjustToBuyOrders",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "buyList",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "buyListWeights",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "buyListPrices",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address[]",
                                "name": "factory",
                                "type": "address[]"
                            },
                            {
                                "internalType": "address[][]",
                                "name": "path",
                                "type": "address[][]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsIn",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "amountsOut",
                                "type": "uint256[]"
                            }
                        ],
                        "internalType": "struct PolybitTheme.SwapOrder[]",
                        "name": "buyOrders",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct PolybitTheme.SwapOrders[]",
                "name": "orderData",
                "type": "tuple[]"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
] as const