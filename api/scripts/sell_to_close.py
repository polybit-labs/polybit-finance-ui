from web3 import Web3
from scripts.polybit_chain_info import get_polybit_addresses, get_polybit_abis
from scripts.detf_functions import get_owned_assets


def sell_to_close(provider, detf_address):
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
        ]
    ]

    w3 = Web3(Web3.HTTPProvider(provider))

    (rebalancer_address, router_address, detf_factory_address) = get_polybit_addresses()
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()

    rebalancer = w3.eth.contract(address=rebalancer_address, abi=rebalancer_abi)
    router = w3.eth.contract(address=router_address, abi=router_abi)

    weth_address = router.functions.getWethAddress().call()

    (owned_assets, owned_assets_prices) = get_owned_assets(provider, detf_address)

    (sellList, sellListPrices) = rebalancer.functions.createSellList(
        owned_assets, owned_assets_prices, []
    ).call()
    print("Sell List", sellList)
    print("Sell List Prices", sellListPrices)

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
                else:
                    print("PolybitRouter: CANNOT_GET_PATH_FOR_TOKEN")

    # convert BigNumber prices to string
    sellListPricesStr = []
    for i in range(0, len(sellListPrices)):
        sellListPricesStr.append(str(sellListPrices[i]))

    orderData = [[sellList, sellListPricesStr, sellOrder]]

    return orderData
