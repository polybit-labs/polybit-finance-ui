from web3 import Web3
from scripts.polybit_chain_info import get_polybit_addresses, get_polybit_abis
from scripts.detf_functions import get_owned_assets, get_target_assets
import os
from pathlib import Path
import json


def first_deposit(provider, detf_address, weth_input_amount):
    w3 = Web3(Web3.HTTPProvider(provider))

    (rebalancer_address, router_address, detf_factory_address) = get_polybit_addresses()
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()

    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    rebalancer = w3.eth.contract(address=rebalancer_address, abi=rebalancer_abi)
    router = w3.eth.contract(address=router_address, abi=router_abi)

    weth_address = router.functions.getWethAddress().call()

    owned_assets = []
    owned_assets_prices = []
    (
        target_assets,
        target_assets_weights,
        target_assets_prices,
    ) = get_target_assets(provider, detf_address)

    (buyList, buyListWeights, buyListPrices) = rebalancer.functions.createBuyList(
        owned_assets, target_assets, target_assets_weights, target_assets_prices
    ).call()
    print("Buy List", buyList)
    print("Buy List Weights", buyListWeights)
    print("Buy List Prices", buyListPrices)

    wethBalance = detf.functions.getWethBalance().call() + int(
        weth_input_amount
    )  # pre for amount selected

    # Begin buy orders
    totalTargetPercentage = 0
    tokenBalances = 0
    totalBalance = 0

    for i in range(0, len(buyList)):
        if buyList[i] != "0x0000000000000000000000000000000000000000":
            targetPercentage = buyListWeights[i]
            totalTargetPercentage += targetPercentage

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
                    print("PolybitRouter: CANNOT_GET_PATH_FOR_TOKEN")

    print("Buy list passed")

    # convert BigNumber prices to string
    buyListPricesStr = []
    for i in range(0, len(buyListPrices)):
        buyListPricesStr.append(str(buyListPrices[i]))

    orderData = [
        [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            buyList,
            buyListWeights,
            buyListPricesStr,
            buyOrder,
        ]
    ]

    return orderData
