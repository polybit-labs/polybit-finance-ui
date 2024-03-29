export const IPolybitLiquidPath = [
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "weth",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "PolybitSwapRouter",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "PancakeswapV2Factory",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "SushiswapV2Factory",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "BiswapFactory",
                        "type": "address"
                    }
                ],
                "internalType": "struct RouterParameters",
                "name": "params",
                "type": "tuple"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor",
        "name": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenIn",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "tokenOut",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "amountType",
                "type": "uint8"
            }
        ],
        "name": "getLiquidPath",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
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
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "tokenIn",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "tokenOut",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint8",
                                "name": "amountType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct PolybitLiquidPath.SwapOrder[]",
                        "name": "swapOrder",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct PolybitLiquidPath.SwapOrders[]",
                "name": "swapOrders",
                "type": "tuple[]"
            }
        ],
        "name": "getLiquidPaths",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            },
            {
                "internalType": "address[][]",
                "name": "",
                "type": "address[][]"
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
        "name": "weth",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const