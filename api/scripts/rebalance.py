from web3 import Web3
from scripts.polybit_chain_info import get_polybit_addresses, get_polybit_abis
from scripts.detf_functions import get_owned_assets, get_target_assets
import os
from pathlib import Path
import json


def rebalance(provider, detf_address, weth_input_amount):
    orderData = [
        [
            [],
            [],
            [
                [
                    [],
                    [],
                    [],
                    [],
                ]
            ],
            [],
            [
                [
                    [],
                    [],
                    [],
                    [],
                ]
            ],
            [],
            [],
            [
                [
                    [],
                    [],
                    [],
                    [],
                ]
            ],
            [],
            [],
            [],
            [
                [
                    [],
                    [],
                    [],
                    [],
                ]
            ],
            [],
            [],
            [],
            [
                [
                    [],
                    [],
                    [],
                    [],
                ]
            ],
        ]
    ]

    w3 = Web3(Web3.HTTPProvider(provider))

    (rebalancer_address, router_address, detf_factory_address) = get_polybit_addresses()
    print("ROUTER ADDRESS", router_address)
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()

    detf = w3.eth.contract(address=detf_address, abi=detf_abi)
    weth_balances = detf.functions.getWethBalance().call() + int(weth_input_amount)
    print(weth_balances)

    rebalancer = w3.eth.contract(address=rebalancer_address, abi=rebalancer_abi)
    router = w3.eth.contract(address=router_address, abi=router_abi)

    weth_address = router.functions.getWethAddress().call()

    (owned_assets, owned_assets_prices) = get_owned_assets(provider, detf_address)
    (
        target_assets,
        target_assets_weights,
        target_assets_prices,
    ) = get_target_assets(provider, detf_address)

    (sellList, sellListPrices) = rebalancer.functions.createSellList(
        owned_assets, owned_assets_prices, target_assets
    ).call()
    print("Sell List", sellList)
    print("Sell List Prices", sellListPrices)

    (
        adjustList,
        adjustListWeights,
        adjustListPrices,
    ) = rebalancer.functions.createAdjustList(
        owned_assets, owned_assets_prices, target_assets, target_assets_weights
    ).call()
    print("Adjust List", adjustList)
    print("Adjust List Weights", adjustListWeights)
    print("Adjust List Prices", adjustListPrices)

    (
        adjustToSellList,
        adjustToSellWeights,
        adjustToSellPrices,
    ) = rebalancer.functions.createAdjustToSellList(
        detf_address,
        owned_assets_prices,
        adjustList,
        adjustListWeights,
        adjustListPrices,
    ).call()
    print("Adjust To Sell List", adjustToSellList)
    print("Adjust To Sell List Weights", adjustToSellWeights)
    print("Adjust To Sell List Prices", adjustToSellPrices)

    (
        adjustToBuyList,
        adjustToBuyWeights,
        adjustToBuyPrices,
    ) = rebalancer.functions.createAdjustToBuyList(
        detf_address,
        owned_assets_prices,
        adjustList,
        adjustListWeights,
        adjustListPrices,
    ).call()
    print("Adjust To Buy List", adjustToBuyList)
    print("Adjust To Buy List Weights", adjustToBuyWeights)
    print("Adjust To Buy List Prices", adjustToBuyPrices)

    (buyList, buyListWeights, buyListPrices) = rebalancer.functions.createBuyList(
        owned_assets, target_assets, target_assets_weights, target_assets_prices
    ).call()
    print("Buy List", buyList)
    print("Buy List Weights", buyListWeights)
    print("Buy List Prices", buyListPrices)

    wethBalance = detf.functions.getWethBalance().call() + int(
        weth_input_amount
    )  # pre for amount selected

    sellOrder = [
        [
            [],
            [],
            [],
            [],
        ]
    ]
    if len(sellList) > 0:
        (sellListAmountsIn, sellListAmountsOut,) = rebalancer.functions.createSellOrder(
            sellList, sellListPrices, detf_address
        ).call()

        for i in range(0, len(sellList)):
            if sellList[i] != "0x0000000000000000000000000000000000000000":
                path = router.functions.getLiquidPath(
                    sellList[i],
                    weth_address,
                    sellListAmountsIn[i],
                    sellListAmountsOut[i],
                ).call()
                if len(path) > 0:
                    print("Sell", sellListAmountsIn[i], sellListAmountsOut[i], path)
                    sellOrder[0][0].append("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73")
                    sellOrder[0][1].append(path)
                    sellOrder[0][2].append(str(sellListAmountsIn[i]))
                    sellOrder[0][3].append(str(sellListAmountsOut[i]))
                    wethBalance = wethBalance + sellListAmountsOut[i]  # simulate SELL
                else:
                    print("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY")

    adjustToSellOrder = [
        [
            [],
            [],
            [],
            [],
        ]
    ]
    if len(adjustToSellList) > 0:
        (
            adjustToSellListAmountsIn,
            adjustToSellListAmountsOut,
        ) = rebalancer.functions.createAdjustToSellOrder(
            owned_assets_prices,
            adjustToSellList,
            adjustToSellWeights,
            adjustToSellPrices,
            detf_address,
        ).call()

        for i in range(0, len(adjustToSellList)):
            if adjustToSellList[i] != "0x0000000000000000000000000000000000000000":
                path = router.getLiquidPath(
                    adjustToSellList[i],
                    weth_address,
                    adjustToSellListAmountsIn[i],
                    adjustToSellListAmountsOut[i],
                )
                if len(path) > 0:
                    print(
                        "Adjust To Sell",
                        adjustToSellListAmountsIn[i],
                        adjustToSellListAmountsOut[i],
                        path,
                    )
                    adjustToSellOrder[0][0].append(
                        "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
                    )
                    adjustToSellOrder[0][1].append(path)
                    adjustToSellOrder[0][2].append(str(adjustToSellListAmountsIn[i]))
                    adjustToSellOrder[0][3].append(str(adjustToSellListAmountsOut[i]))
                    wethBalance = wethBalance + adjustToSellListAmountsOut[i]
                    # simulate SELL
                else:
                    print("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY")

    print("Sell orders passed")

    # Begin buy orders
    totalTargetPercentage = 0
    tokenBalances = 0
    totalBalance = 0

    if len(adjustList) > 0:
        for i in range(0, len(adjustList)):
            (tokenBalance, tokenBalanceInWeth) = detf.functions.getTokenBalance(
                adjustList[i], adjustListPrices[i]
            ).call()
            tokenBalances = tokenBalances + tokenBalanceInWeth
        totalBalance = tokenBalances + wethBalance

    for i in range(0, len(adjustToBuyList)):
        if adjustToBuyList[i] != "0x0000000000000000000000000000000000000000":
            (tokenBalance, tokenBalanceInWeth) = detf.functions.getTokenBalance(
                adjustToBuyList[i], adjustToBuyPrices[i]
            ).call()
            tokenBalancePercentage = (10**8 * tokenBalanceInWeth) / totalBalance
            targetPercentage = adjustToBuyWeights[i]
            totalTargetPercentage += targetPercentage - tokenBalancePercentage

    for i in range(0, len(buyList)):
        if buyList[i] != "0x0000000000000000000000000000000000000000":
            targetPercentage = buyListWeights[i]
            totalTargetPercentage += targetPercentage

    adjustToBuyOrder = [
        [
            [],
            [],
            [],
            [],
        ]
    ]

    if len(adjustToBuyList) > 0:
        (
            adjustToBuyListAmountsIn,
            adjustToBuyListAmountsOut,
        ) = rebalancer.functions.createAdjustToBuyOrder(
            totalBalance,
            wethBalance,
            adjustToBuyList,
            adjustToBuyWeights,
            adjustToBuyPrices,
            int(totalTargetPercentage),
            detf_address,
        ).call()

        for i in range(0, len(adjustToBuyList)):
            if adjustToBuyList[i] != "0x0000000000000000000000000000000000000000":
                path = router.functions.getLiquidPath(
                    weth_address,
                    adjustToBuyList[i],
                    adjustToBuyListAmountsIn[i],
                    adjustToBuyListAmountsOut[i],
                ).call()
                if len(path) > 0:
                    print(
                        "Adjust To Buy",
                        adjustToBuyListAmountsIn[i],
                        adjustToBuyListAmountsOut[i],
                        path,
                    )
                    adjustToBuyOrder[0][0].append(
                        "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
                    )
                    adjustToBuyOrder[0][1].append(path)
                    adjustToBuyOrder[0][2].append(str(adjustToBuyListAmountsIn[i]))
                    adjustToBuyOrder[0][3].append(str(adjustToBuyListAmountsOut[i]))

                else:
                    print("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY")

    print("Adjust to buy passed")
    buyOrder = [
        [
            [],
            [],
            [],
            [],
        ]
    ]
    print("totalTargetPercentage", totalTargetPercentage)
    print("wethBalance", wethBalance)
    if len(buyList) > 0:
        (buyListAmountsIn, buyListAmountsOut) = rebalancer.functions.createBuyOrder(
            buyList,
            buyListWeights,
            buyListPrices,
            wethBalance,
            int(totalTargetPercentage),
        ).call()
        print("buyListAmountsIn", buyListAmountsIn)
        print("buyListAmountsOut", buyListAmountsOut)

        for i in range(0, len(buyList)):
            print(buyList[i])
            if buyList[i] != "0x0000000000000000000000000000000000000000":
                print(weth_address)
                print(buyList[i])
                print(buyListAmountsIn[i])
                print(buyListAmountsOut[i])
                path = router.functions.getLiquidPath(
                    weth_address,
                    buyList[i],
                    buyListAmountsIn[i],
                    buyListAmountsOut[i],
                ).call()
                if len(path) > 0:
                    print(
                        "Buy",
                        buyListAmountsIn[i],
                        buyListAmountsOut[i],
                        path,
                    )
                    buyOrder[0][0].append("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73")
                    buyOrder[0][1].append(path)
                    buyOrder[0][2].append(str(buyListAmountsIn[i]))
                    buyOrder[0][3].append(str(buyListAmountsOut[i]))

                else:
                    print("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY")

    print("Buy list passed")

    # convert BigNumber prices to string
    sellListPricesStr = []
    for i in range(0, len(sellListPrices)):
        sellListPricesStr.append(str(sellListPrices[i]))

    adjustListPricesStr = []
    for i in range(0, len(adjustListPrices)):
        adjustListPricesStr.append(str(adjustListPrices[i]))

    adjustToSellListPricesStr = []
    for i in range(0, len(adjustToSellPrices)):
        adjustToSellListPricesStr.append(str(adjustToSellPrices[i]))

    adjustToBuyListPricesStr = []
    for i in range(0, len(adjustToBuyPrices)):
        adjustToBuyListPricesStr.append(str(adjustToBuyPrices[i]))

    buyListPricesStr = []
    for i in range(0, len(buyListPrices)):
        buyListPricesStr.append(str(buyListPrices[i]))

    orderData = [
        [
            sellList,
            sellListPricesStr,
            sellOrder,
            adjustList,
            adjustListPricesStr,
            adjustToSellList,
            adjustToSellListPricesStr,
            adjustToSellOrder,
            adjustToBuyList,
            adjustToBuyWeights,
            adjustToBuyListPricesStr,
            adjustToBuyOrder,
            buyList,
            buyListWeights,
            buyListPricesStr,
            buyOrder,
        ]
    ]

    return orderData
