import { GetLatestPrice } from './utils/GetLatestPrice'
import { Interface } from 'ethers/lib/utils'
import PolybitDETFInterface from "../chain-info/IPolybitDETF.json"
import PolybitRebalancer from "../chain-info/IPolybitRebalancer.json"
import PolybitRouter from "../chain-info/IPolybitRouter.json"
import map from "../chain-info/map.json"
import weth from "../chain-info/weth.json"
import factoryAddresses from "../chain-info/factoryAddresses.json"
import { BigNumber } from 'ethers'
import { GetLiquidPath, GetBuyOrder, GetRebalancerLists, GetLiquidPaths } from './utils/RebalancerUtils'
import {
    useContractRead,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
} from "wagmi"
import { useEffect, useState } from 'react'
import { GetOwnedAssets, GetOwnedAssetsPrices, GetOwnedAssetsWeights, GetProductId, GetTargetAssets, GetTokenBalance, GetWethBalance } from './utils/DETFUtils'

const IPolybitDETF = new Interface(PolybitDETFInterface)


/* const GetOwnedAssets = () => {
    const assets: Array<string> = []
    return assets
} */
/* const GetOwnedAssetsWeights = () => {
    const weights: Array<number> = []
    return weights
} */
/* const GetOwnedAssetsPrices = (detfAddress: string) => {
    let ownedAssets = GetOwnedAssets(detfAddress)
    let ownedAssetsPrices: Array<number> = []

    ownedAssets?.map((address, index) => {
        ownedAssetsPrices.push(Math.round(Number(GetLatestPrice("binance-smart-chain", address, "bnb")) * 10 ** 18))
    })
    console.log(ownedAssets)
    console.log(ownedAssetsPrices)
    return ownedAssetsPrices
} */

/* const GetTargetAssets = () => {
    const assets: Array<string> = [
        "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
        "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
        "0xfb6115445bff7b52feb98650c87f44907e58f802",
        "0x949D48EcA67b17269629c7194F4b727d4Ef9E5d6",
        "0xbA552586eA573Eaa3436f04027ff4effd0c0abbb",
        "0x477bC8d23c634C154061869478bce96BE6045D12",
    ]
    return assets
} */

const targetAssets = GetTargetAssets(44444)
const targetAssetsWeights = []
const targetAssetsPrices = []
/* 
const GetTargetAssetsWeights = () => {
    const weights: Array<string> = [
        (Math.round(10 ** 8 * (1 / 7)).toString()),
        (Math.round(10 ** 8 * (1 / 7)).toString()),
        (Math.round(10 ** 8 * (1 / 7)).toString()),
        (Math.round(10 ** 8 * (1 / 7)).toString()),
        (Math.round(10 ** 8 * (1 / 7)).toString()),
        (Math.round(10 ** 8 * (1 / 7)).toString()),
        (Math.round(10 ** 8 * (1 / 7)).toString())
    ]
    return weights
}
export const GetTargetAssetsPrices = () => {
    let targetAssets: Array<string> = GetTargetAssets()
    let targetAssetsPrices: Array<string> = []

    targetAssets?.map((address, index) => {
        targetAssetsPrices.push(Math.round(Number(GetLatestPrice("binance-smart-chain", address, "bnb")) * 10 ** 18).toString())
    })
    return targetAssetsPrices
} */

interface RebalancerProps {
    detfAddress: string
    rebalancerAddress: string
    routerAddress: string
}

export const Rebalance = () => {
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const IPolybitRebalancer = new Interface(PolybitRebalancer)
    const IPolybitRouter = new Interface(PolybitRouter)
    const detfAddress = "0x236259A267B35055D74897BFA4161c987CC16157"
    const rebalancerAddress: string = map["5777"]["rebalancer"][0]
    const routerAddress: string = map["5777"]["router"][0]
    const wethAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    const swapFactory = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"

    const ownedAssets = GetOwnedAssets(detfAddress)
    const ownedAssetsWeights: Array<string> = []//GetOwnedAssetsWeights()
    const ownedAssetsPrices: Array<string> = GetOwnedAssetsPrices(ownedAssets)

    const targetAssets: Array<string> = []//GetTargetAssets()
    const targetAssetsWeights: Array<string> = []//GetTargetAssetsWeights()
    const targetAssetsPrices: Array<string> = []//GetTargetAssetsPrices()

    console.log("Target Assets", targetAssets)
    console.log("Target Assets Weights", targetAssetsWeights)
    console.log("Target Assets Prices", targetAssetsPrices)

    /* 
    Create Sell Lists 
    */
    const { data: sellListData } = useContractRead({
        addressOrName: rebalancerAddress,
        contractInterface: IPolybitRebalancer,
        functionName: "createSellList",
        args: [ownedAssets, ownedAssetsPrices, targetAssets]
    })

    const sellList: Array<string> = sellListData ? sellListData[0] : []
    const sellListPrices: Array<number> = sellListData ? sellListData[1] : []

    console.log("Sell List", sellList)
    console.log("Sell List Prices", sellListPrices)

    /* 
    Create Adjust Lists 
    */
    const { data: adjustListData } = useContractRead({
        addressOrName: rebalancerAddress,
        contractInterface: IPolybitRebalancer,
        functionName: "createAdjustList",
        args: [ownedAssets, ownedAssetsPrices, targetAssets, targetAssetsWeights]
    })

    const adjustList: Array<string> = adjustListData ? adjustListData[0] : []
    const adjustListWeights: Array<string> = adjustListData ? adjustListData[1] : []
    const adjustListPrices: Array<string> = adjustListData ? adjustListData[2] : []

    console.log("Adjust List", adjustList)
    console.log("Adjust List Weights", adjustListWeights)
    console.log("Adjust List Prices", adjustListPrices)

    /* 
    Create Adjust To Sell Lists 
    */
    const { data: adjustToSellListData } = useContractRead({
        addressOrName: rebalancerAddress,
        contractInterface: IPolybitRebalancer,
        functionName: "createAdjustToSellList",
        args: [detfAddress, ownedAssetsPrices, adjustList, adjustListWeights, adjustListPrices]
    })

    const adjustToSellList: Array<string> = adjustToSellListData ? adjustToSellListData[0] : []
    const adjustToSellListWeights: Array<string> = adjustToSellListData ? adjustToSellListData[1] : []
    const adjustToSellListPrices: Array<string> = adjustToSellListData ? adjustToSellListData[2] : []

    console.log("Adjust To Sell List", adjustToSellList)
    console.log("Adjust To Sell List Weights", adjustToSellListWeights)
    console.log("Adjust To Sell List Prices", adjustToSellListPrices)

    /* 
    Create Adjust To Buy Lists 
    */
    const { data: adjustToBuyListData } = useContractRead({
        addressOrName: rebalancerAddress,
        contractInterface: IPolybitRebalancer,
        functionName: "createAdjustToBuyList",
        args: [detfAddress, ownedAssetsPrices, adjustList, adjustListWeights, adjustListPrices]
    })

    const adjustToBuyList: Array<string> = adjustToBuyListData ? adjustToBuyListData[0] : []
    const adjustToBuyListWeights: Array<string> = adjustToBuyListData ? adjustToBuyListData[1] : []
    const adjustToBuyListPrices: Array<string> = adjustToBuyListData ? adjustToBuyListData[2] : []

    console.log("Adjust To Buy List", adjustToBuyList)
    console.log("Adjust To Buy List Weights", adjustToBuyListWeights)
    console.log("Adjust To Buy List Prices", adjustToBuyListPrices)

    /* 
    Create Buy Lists 
    */
    const { data: buyListData } = useContractRead({
        addressOrName: rebalancerAddress,
        contractInterface: IPolybitRebalancer,
        functionName: "createBuyList",
        args: [ownedAssets, targetAssets, targetAssetsWeights, targetAssetsPrices]
    })

    const buyList: Array<string> = buyListData ? buyListData[0] : []

    const buyListWeights: Array<string> = []
    const _buyListWeights: Array<string> = buyListData ? buyListData[1] : []
    _buyListWeights.map((weight) => {
        buyListWeights.push(weight.toString())
    })

    const buyListPrices: Array<string> = []
    const _buyListPrices: Array<string> = buyListData ? buyListData[2] : []
    _buyListPrices.map((price) => {
        buyListPrices.push(price.toString())
    })

    console.log("Buy List", buyList)
    console.log("Buy List Weights", buyListWeights)
    console.log("Buy List Prices", buyListPrices)

    /* 
    Get WETH Balance
    */
    const { data: getWethBalance } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getWethBalance",
    })

    let wethBalance: number = Number(getWethBalance ? getWethBalance : 0)
    console.log("Weth Balance", wethBalance)
    wethBalance = 9999999

    let sellOrder: Array<any> = [
        [
            [],
            [],
            [],
            [],
        ]
    ]

    /* if (sellList.length > 0) {
        const { data: sellOrderData } = useContractRead({
            addressOrName: rebalancerAddress[0],
            contractInterface: IPolybitRebalancer,
            functionName: "createSellOrder",
            args: [sellList, sellListPrices, detfAddress]
        })

        const sellListAmountsIn: Array<number> = sellOrderData ? sellOrderData[0] : []
        const sellListAmountsOut: Array<number> = sellOrderData ? sellOrderData[1] : []

        sellList?.map((address, index) => {
            const { data: path } = useContractRead({
                addressOrName: routerAddress[0],
                contractInterface: IPolybitRouter,
                functionName: "getLiquidPath",
                args: [address,
                    wethAddress,
                    sellListAmountsIn[index],
                    sellListAmountsOut[index]]
            })

            if (path && path?.length > 0) {
                console.log("Sell", sellListAmountsIn[index], sellListAmountsOut[index], path)
                sellOrder[0][0].append(swapFactory)
                sellOrder[0][1].append(path)
                sellOrder[0][2].append(sellListAmountsIn[index])
                sellOrder[0][3].append(sellListAmountsOut[index])
                // Simulate the sell for off-chain calc
                wethBalance = wethBalance + sellListAmountsOut[index]
            } else {
                console.log("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY", address)
            }
        })
    } */

    let adjustToSellOrder: Array<any> = [
        [
            [],
            [],
            [],
            [],
        ]
    ]
    /*
        if (adjustToSellList.length > 0) {
            const { data: adjustToSellOrderData } = useContractRead({
                addressOrName: rebalancerAddress,
                contractInterface: IPolybitRebalancer,
                functionName: "createAdjustToSellOrder",
                args: [ownedAssetsPrices, adjustToSellList, adjustToSellPrices, detfAddress]
            })
    
            const adjustToSellListAmountsIn: Array<number> = adjustToSellOrderData ? adjustToSellOrderData[0] : []
            const adjustToSellListAmountsOut: Array<number> = adjustToSellOrderData ? adjustToSellOrderData[1] : []
    
            adjustToSellList?.map((address, index) => {
                const { data: path } = useContractRead({
                    addressOrName: routerAddress,
                    contractInterface: IPolybitRouter,
                    functionName: "getLiquidPath",
                    args: [address,
                        wethAddress,
                        adjustToSellListAmountsIn[index],
                        adjustToSellListAmountsOut[index]]
                })
    
                if (path && path?.length > 0) {
                    console.log("Adjust To Sell", adjustToSellListAmountsIn[index], adjustToSellListAmountsOut[index], path)
                    adjustToSellOrder[0][0].append(swapFactory)
                    adjustToSellOrder[0][1].append(path)
                    adjustToSellOrder[0][2].append(adjustToSellListAmountsIn[index])
                    adjustToSellOrder[0][3].append(adjustToSellListAmountsOut[index])
                    // Simulate the sell for off-chain calc
                    wethBalance = wethBalance + adjustToSellListAmountsOut[index]
                } else {
                    console.log("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY", address)
                }
            })
        }
        */

    //Begin buy orders
    let totalTargetPercentage = 0
    let tokenBalances = 0
    let totalBalance = 0

    const GetTokenBalance = (token: string, price: string) => {
        const { data: tokenBalanceData } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTokenBalance",
            args: [token, price]
        })
        return tokenBalanceData
    }

    adjustList && adjustList?.map((address, index) => {
        const tokenBalanceData = GetTokenBalance(adjustList[index], adjustListPrices[index].toString())
        const tokenBalance: number = Number(tokenBalanceData ? tokenBalanceData[0] : 0)
        const tokenBalanceInWeth: number = Number(tokenBalanceData ? tokenBalanceData[1] : 0)
        tokenBalances = tokenBalances + tokenBalanceInWeth
    })
    totalBalance = tokenBalances + wethBalance

    adjustToBuyList && adjustToBuyList?.map((address, index) => {
        const tokenBalanceData = GetTokenBalance(adjustToBuyList[index], adjustToBuyListPrices[index].toString())
        const tokenBalance: number = Number(tokenBalanceData ? tokenBalanceData[0] : 0)
        const tokenBalanceInWeth: number = Number(tokenBalanceData ? tokenBalanceData[1] : 0)
        const tokenBalancePercentage: number = (10 ** 8 * tokenBalanceInWeth) / totalBalance
        const targetPercentage: string = adjustToBuyListWeights[index].toString()
        totalTargetPercentage += Number(targetPercentage) - tokenBalancePercentage
    })

    buyList && buyList?.map((address, index) => {
        const targetPercentage: string = buyListWeights[index].toString()
        totalTargetPercentage += Number(targetPercentage)
    })

    let adjustToBuyOrder: Array<any> = [
        [
            [],
            [],
            [],
            [],
        ]
    ]

    const GetAdjustToBuyOrderData = () => {
        const { data: adjustToBuyOrderData } = useContractRead({
            addressOrName: rebalancerAddress,
            contractInterface: IPolybitRebalancer,
            functionName: "createAdjustToBuyOrder",
            args: [totalBalance,
                wethBalance,
                adjustToBuyList,
                adjustToBuyListPrices,
                adjustToBuyListPrices,
                totalTargetPercentage, detfAddress]
        })
        return adjustToBuyOrderData
    }
    const adjustToBuyOrderData = GetAdjustToBuyOrderData()
    /*
 
    if (adjustToBuyList.length > 0) {
        const adjustToBuyListAmountsIn: Array<string> = adjustToBuyOrderData ? adjustToBuyOrderData[0] : []
        const adjustToBuyListAmountsOut: Array<string> = adjustToBuyOrderData ? adjustToBuyOrderData[1] : []
        adjustToBuyList?.map((address, index) => {
            const path = GetLiquidPath(address, adjustToBuyListAmountsIn[index], adjustToBuyListAmountsOut[index])
            if (path && path?.length > 0) {
                console.log("Adjust To Buy", adjustToBuyListAmountsIn[index], adjustToBuyListAmountsOut[index], path)
                adjustToBuyOrder[0][0].append(swapFactory)
                adjustToBuyOrder[0][1].append(path)
                adjustToBuyOrder[0][2].append(adjustToBuyListAmountsIn[index])
                adjustToBuyOrder[0][3].append(adjustToBuyListAmountsOut[index])
            } else {
                console.log("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY", address)
            }
        })
    } */

    let buyOrder: Array<any> = [
        [
            [],
            [],
            [],
            [],
        ]
    ]

    /* const buyOrderData = GetBuyOrder(rebalancerAddress,
        IPolybitRebalancer,
        "createBuyOrder",
        buyList,
        buyListWeights,
        buyListPrices,
        wethBalance,
        totalTargetPercentage)
    console.log("BuyOrderData", buyOrderData)

    const buyListAmountsIn: Array<string> = buyOrderData ? buyOrderData[0] : []
    const buyListAmountsOut: Array<string> = buyOrderData ? buyOrderData[1] : []

    buyList && buyList?.map((address, index) => {
        console.log(buyList[index])
    }) */

    //buyListAmountsIn && buyListAmountsOut && buyList?.map((address, index) => {
    //    console.log("getLiquidPath", wethAddress, buyList[index], buyListAmountsIn[index].toString(), buyListAmountsOut[index].toString())
    //const path = GetLiquidPath(routerAddress, IPolybitRouter, "getLiquidPath", wethAddress, buyList[index], buyListAmountsIn[index].toString(), buyListAmountsOut[index].toString())
    //console.log(path)
    /* 
    if (path && path?.length > 0) {
        console.log("Buy", buyListAmountsIn[index].toString(), buyListAmountsOut[index].toString(), path)
        buyOrder[0][0].append(swapFactory)
        buyOrder[0][1].append(path)
        buyOrder[0][2].append(buyListAmountsIn[index])
        buyOrder[0][3].append(buyListAmountsOut[index])
    } else {
         console.log("PolybitRouter: INSUFFICIENT_TOKEN_LIQUIDITY", address)
}*/
    //})


    /*
        const orderData = [
            [
                sellList,
                sellListPrices,
                sellOrder,
                adjustList,
                adjustListPrices,
                adjustToSellList,
                adjustToSellPrices,
                adjustToSellOrder,
                adjustToBuyList,
                adjustToBuyPrices,
                adjustToBuyOrder,
                buyList,
                buyListPrices,
                buyOrder,
            ]
        ]
    
        const { config, error } = usePrepareContractWrite({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "rebalance",
            args: [orderData]
        })
        const { data, isLoading, isSuccess, write: rebalanceDETF } = useContractWrite(config)
    
        const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading } = useWaitForTransaction({
            hash: data?.hash,
            onSettled(data, error) {
                const response = data ? data.logs[0] : []
                console.log("Settled", response)
                //setDETFSuccess(true)
            }
        })
    
        return (
            <div><button onClick={() => rebalanceDETF?.()}>Rebalance</button></div>
        ) */


}

export const Rebalancer = (props: any) => {
    const wethAddress = weth["56"]["wethAddress"]
    const swapFactory = factoryAddresses["56"]["pancakeswap"]
    console.log("WETH", wethAddress)
    console.log(props.detfAddress)
    const productId = Number(GetProductId(props.detfAddress))
    console.log("ProductId", productId)

    const ownedAssets = GetOwnedAssets(props.detfAddress)
    console.log("ownedAssets", ownedAssets)
    const ownedAssetsWeights = GetOwnedAssetsWeights()
    console.log("ownedAssetsWeights", ownedAssetsWeights)
    const ownedAssetsPrices = GetOwnedAssetsPrices(ownedAssets)
    console.log("Owned Asset Prices", ownedAssetsPrices)

    const [targetAssets, targetAssetsWeights, targetAssetsPrices] = GetTargetAssets(productId)
    console.log("targetAssetsWeights", targetAssetsWeights)
    console.log("targetAssetsPrices", targetAssetsPrices)

    const [sellList,
        sellListPrices,
        adjustList,
        adjustListPrices,
        adjustToSellList,
        adjustToSellListWeights,
        adjustToSellListPrices,
        adjustToBuyList,
        adjustToBuyListWeights,
        adjustToBuyListPrices,
        buyList,
        buyListWeights,
        buyListPrices] = GetRebalancerLists(props.detfAddress,
            ownedAssets,
            ownedAssetsWeights,
            ownedAssetsPrices,
            targetAssets,
            targetAssetsWeights,
            targetAssetsPrices)

    let wethBalance: string = GetWethBalance(props.detfAddress)
    console.log(wethBalance.toString())

    /* Begin Sell Orders */
    let sellOrder: Array<any> = [
        [
            [],
            [],
            [],
            [],
        ]
    ]

    let adjustToSellOrder: Array<any> = [
        [
            [],
            [],
            [],
            [],
        ]
    ]

    /* Begin Buy Orders */

    let totalTargetPercentage: number = 0
    let tokenBalances: number = 0
    let totalBalance: number = 0

    adjustList && adjustList?.map((address, index) => {
        const tokenBalanceData = GetTokenBalance(props.detfAddress, adjustList[index].toString(), adjustListPrices[index].toString())
        const tokenBalance: number = Number(tokenBalanceData ? tokenBalanceData[0] : 0)
        const tokenBalanceInWeth: number = Number(tokenBalanceData ? tokenBalanceData[1] : 0)
        tokenBalances = tokenBalances + tokenBalanceInWeth
    })
    totalBalance = Number(tokenBalances) + Number(wethBalance)

    adjustToBuyList && adjustToBuyList?.map((address, index) => {
        const tokenBalanceData = GetTokenBalance(props.detfAddress, adjustToBuyList[index].toString(), adjustToBuyListPrices[index].toString())
        const tokenBalance: number = Number(tokenBalanceData ? tokenBalanceData[0] : 0)
        const tokenBalanceInWeth: number = Number(tokenBalanceData ? tokenBalanceData[1] : 0)
        const tokenBalancePercentage: number = (10 ** 8 * tokenBalanceInWeth) / totalBalance
        const targetPercentage: number = Number(adjustToBuyListWeights[index])
        totalTargetPercentage += Number(targetPercentage) - tokenBalancePercentage
    })

    buyList && buyList?.map((address, index) => {
        const targetPercentage: string = buyListWeights[index].toString()
        totalTargetPercentage += Number(targetPercentage)
    })

    console.log("totalTargetPercentage", totalTargetPercentage)
    console.log("tokenBalances", tokenBalances)
    console.log("totalBalance", totalBalance)

    let adjustToBuyOrder: Array<any> = [
        [
            [],
            [],
            [],
            [],
        ]
    ]

    /* adjust to buy */
    let buyOrder: Array<any> = [
        [
            [],
            [],
            [],
            [],
        ]
    ]

    const buyOrderData = GetBuyOrder(
        buyList,
        buyListWeights,
        buyListPrices,
        wethBalance,
        totalTargetPercentage)
    console.log("BuyOrderData", buyOrderData)

    const buyListAmountsIn: Array<string> = buyOrderData ? buyOrderData[0] : []
    const buyListAmountsOut: Array<string> = buyOrderData ? buyOrderData[1] : []

    let baseList: Array<string> = []
    buyList && buyList?.map((address, index) => {
        console.log(buyList[index])
        baseList.push(wethAddress)
        console.log(wethAddress)
    })

    buyListAmountsIn && buyListAmountsOut && buyList?.map((address, index) => {
        console.log("getLiquidPath", wethAddress, buyList[index], buyListAmountsIn[index].toString(), buyListAmountsOut[index].toString())
        //const path = GetLiquidPath(wethAddress, buyList[index], buyListAmountsIn[index].toString(), buyListAmountsOut[index].toString())
        //console.log(path)
    })

    const paths = GetLiquidPaths(baseList, buyList, buyListAmountsIn, buyListAmountsOut)
    console.log("Paths", paths)

    if (buyListAmountsIn && buyListAmountsOut && buyList && paths) {
        for (let i = 0; i < buyList.length; i++) {
            console.log("Buy", buyListAmountsIn[i].toString(), buyListAmountsOut[i].toString(), paths[i])
            buyOrder[0][0].push(swapFactory)
            buyOrder[0][1].push(paths[i])
            buyOrder[0][2].push(buyListAmountsIn[i].toString())
            buyOrder[0][3].push(buyListAmountsOut[i].toString())
        }
        //console.log("Buy", buyListAmountsIn[index].toString(), buyListAmountsOut[index].toString(), paths[index])
        //console.log(index)
    }

    type SwapOrder = {
        swapFactory: Array<string>;
        path: Array<Array<string>>;
        amountsIn: Array<string>;
        amountsOut: Array<string>;
    }

    type SwapOrders = {
        sellList: Array<string>;
        sellListPrices: Array<string>;
        sellOrders: Array<SwapOrder>;
        adjustList: Array<string>;
        adjustListPrices: Array<string>;
        adjustToSellList: Array<string>;
        adjustToSellPrices: Array<string>;
        adjustToSellOrders: Array<SwapOrder>;
        adjustToBuyList: Array<string>;
        adjustToBuyWeights: Array<string>;
        adjustToBuyPrices: Array<string>;
        adjustToBuyOrders: Array<SwapOrder>;
        buyList: Array<string>;
        buyListWeights: Array<string>;
        buyListPrices: Array<string>;
        buyOrders: Array<SwapOrder>;
    }

    /* const swapOrders: Array<Array<SwapOrders>> = [
        sellList,
        sellListPrices,
        sellOrder,
        adjustList,
        adjustListPrices,
        adjustToSellList,
        adjustToSellListPrices,
        adjustToSellOrder,
        adjustToBuyList,
        [],
        adjustToBuyListPrices,
        adjustToBuyOrder,
        buyList,
        [],
        buyListPrices,
        buyOrder
    ] */

    /* const swapOrders: SwapOrders = {
        sellList: sellList,
        sellListPrices: sellListPrices,
        sellOrders: sellOrder,
        adjustList: adjustList,
        adjustListPrices: adjustListPrices,
        adjustToSellList: adjustToSellList,
        adjustToSellPrices: adjustToSellListPrices,
        adjustToSellOrders: adjustToSellOrder,
        adjustToBuyList: adjustToBuyList,
        adjustToBuyWeights: [],
        adjustToBuyPrices: adjustToBuyListPrices,
        adjustToBuyOrders: adjustToBuyOrder,
        buyList: buyList,
        buyListWeights: [],
        buyListPrices: buyListPrices,
        buyOrders: buyOrder
    } */

    /* const swapOrders2 = [[
        sellList,
        sellListPrices,
        sellOrder,
        adjustList,
        adjustListPrices,
        adjustToSellList,
        adjustToSellListPrices,
        adjustToSellOrder,
        adjustToBuyList,
        [],
        adjustToBuyListPrices,
        adjustToBuyOrder,
        buyList,
        [],
        buyListPrices,
        buyOrder
    ]] */

    //console.log(swapOrders2)

    /* const { config, error, isSuccess: isSuccessPrep } = usePrepareContractWrite({
        addressOrName: props.detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "rebalance",
        args: [swapOrders2],
        onError(error) {
            console.log('rebalance usePrepareContractWrite Error', error)
        },
        onSuccess(data) {
            console.log('Success', data)
        },
    })

    console.log("prep error", error)
    console.log("is success", isSuccessPrep)
    const { data, isLoading, isSuccess, write: rebalanceDETF } = useContractWrite({
        ...config,
        onError(error) {
            console.log('rebalanceDETF Error', error)
        },
    })

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[0] : []
            console.log("Settled", response)
            //setDETFSuccess(true)
        }
    }) */

    const Thing = () => {
        console.log("")
    }

    return (
        <>
            {/* <button onClick={() => Thing?.()}>Rebalance</button> */}
        </>
    )
}