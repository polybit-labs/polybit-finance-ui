from web3 import Web3
import get_prices
import os
from pathlib import Path
import json


def get_addresses():
    path = str(Path(os.path.abspath(os.path.dirname(__file__))).parent)
    f = open(path + "/src/chain_info/map.json")
    json_file = json.load(f)
    rebalancer_address = json_file["56"]["rebalancer"]
    router_address = json_file["56"]["router"]
    detf_factory_address = json_file["56"]["detf_factory"]
    return rebalancer_address, router_address, detf_factory_address


def get_abis():
    abis = ["IPolybitDETF", "IPolybitRebalancer", "IPolybitRouter"]
    path = str(Path(os.path.abspath(os.path.dirname(__file__))).parent)

    # IPolybitDETF
    f = open(path + "/src/chain_info/IPolybitDETF.json")
    IPolybitDETF = json.load(f)

    # IPolybitRebalancer
    f = open(path + "/src/chain_info/IPolybitRebalancer.json")
    IPolybitRebalancer = json.load(f)

    # IPolybitRouter
    f = open(path + "/src/chain_info/IPolybitRouter.json")
    IPolybitRouter = json.load(f)

    return IPolybitDETF, IPolybitRebalancer, IPolybitRouter


def get_owned_assets(detf):
    owned_assets = detf.functions.getOwnedAssets().call()
    owned_assets_prices = get_prices.get_token_prices(owned_assets)

    return owned_assets, owned_assets_prices


def get_target_assets(detf):
    product_id = detf.functions.getProductId().call()

    path = str(Path(os.path.abspath(os.path.dirname(__file__))).parent)
    f = open(path + "/src/product/detfIndex.json")
    detfIndex = json.load(f)

    for i in range(0, len(detfIndex)):
        if detfIndex[i]["productId"] == product_id:
            urlChainId = detfIndex[i]["urlChainId"]
            urlCategoryId = detfIndex[i]["urlCategoryId"]
            urlDimensionId = detfIndex[i]["urlDimensionId"]

    f = open(
        path
        + "/src/product/detfs/"
        + str(urlChainId)
        + "/"
        + str(urlCategoryId)
        + "/"
        + str(urlDimensionId)
        + "/product-data.json"
    )
    product_data = json.load(f)

    target_assets = []
    target_assets_weights = []
    target_assets_prices = []

    for i in range(0, len(product_data["tokens"])):
        target_assets.append(product_data["tokens"][i]["address"])
        target_assets_weights.append(
            int(10**8 * product_data["tokens"][i]["dimension"]["weight"])
        )
        target_assets_prices.append(
            get_prices.get_token_price(product_data["tokens"][i]["address"])
        )
    return target_assets, target_assets_weights, target_assets_prices


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

    (rebalancer_address, router_address, detf_factory_address) = get_addresses()
    (detf_abi, rebalancer_abi, router_abi) = get_abis()

    # detf_address = "0xBe7985A4c9004CCF8b05a288bF10e5F87296f10a"
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)
    weth_balances = detf.functions.getWethBalance().call() + int(weth_input_amount)

    if weth_balances > 0:
        rebalancer = w3.eth.contract(address=rebalancer_address, abi=rebalancer_abi)
        router = w3.eth.contract(address=router_address, abi=router_abi)

        weth_address = router.functions.getWethAddress().call()

        (owned_assets, owned_assets_prices) = get_owned_assets(detf)
        (
            target_assets,
            target_assets_weights,
            target_assets_prices,
        ) = get_target_assets(detf)

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

        wethBalance = detf.functions.getWethBalance().call() + int(weth_input_amount)

        sellOrder = [
            [
                [],
                [],
                [],
                [],
            ]
        ]
        if len(sellList) > 0:
            (
                sellListAmountsIn,
                sellListAmountsOut,
            ) = rebalancer.functions.createSellOrder(
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
                        sellOrder[0][0].append(
                            "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
                        )
                        sellOrder[0][1].append(path)
                        sellOrder[0][2].append(str(sellListAmountsIn[i]))
                        sellOrder[0][3].append(str(sellListAmountsOut[i]))
                        wethBalance = (
                            wethBalance + sellListAmountsOut[i]
                        )  # simulate SELL
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
                        adjustToSellOrder[0][2].append(
                            str(adjustToSellListAmountsIn[i])
                        )
                        adjustToSellOrder[0][3].append(
                            str(adjustToSellListAmountsOut[i])
                        )
                        wethBalance = wethBalance + adjustToSellListAmountsOut[i]
                        # simulate SELL
                    else:
                        print("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY")

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

        buyOrder = [
            [
                [],
                [],
                [],
                [],
            ]
        ]
        if len(buyList) > 0:
            (buyListAmountsIn, buyListAmountsOut) = rebalancer.functions.createBuyOrder(
                buyList,
                buyListWeights,
                buyListPrices,
                wethBalance,
                int(totalTargetPercentage),
            ).call()

            for i in range(0, len(buyList)):
                if buyList[i] != "0x0000000000000000000000000000000000000000":
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
                        buyOrder[0][0].append(
                            "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
                        )
                        buyOrder[0][1].append(path)
                        buyOrder[0][2].append(str(buyListAmountsIn[i]))
                        buyOrder[0][3].append(str(buyListAmountsOut[i]))

                    else:
                        print("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY")

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
