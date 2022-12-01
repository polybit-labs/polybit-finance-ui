import { GetLatestPrice } from './utils/GetLatestPrice'
import { Interface } from 'ethers/lib/utils'
import PolybitDETFInterface from "../chain_info/IPolybitDETF.json"
import PolybitRebalancer from "../chain_info/IPolybitRebalancer.json"
import PolybitRouter from "../chain_info/IPolybitRouter.json"
import map from "../chain_info/map.json"
import weth from "../chain_info/weth.json"
import factoryAddresses from "../chain_info/factoryAddresses.json"
import { GetLiquidPath, GetBuyOrder, GetRebalancerLists, GetLiquidPaths } from './utils/RebalancerUtils'
import {
    useContractRead,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
} from "wagmi"
import { useEffect, useState } from 'react'
import { GetOwnedAssets, GetOwnedAssetsPrices, GetOwnedAssetsWeights, GetProductId, GetTargetAssets, GetTargetAssets2, GetTargetAssetsPrices, GetTargetAssetsWeights, GetTokenBalance, GetWethBalance } from './utils/DETFUtils'

interface RebalancerProps {
    detfAddress: string;
}

export const Rebalancer = (props: RebalancerProps) => {
    const wethAddress = weth["56"]["wethAddress"]
    const swapFactory = factoryAddresses["56"]["pancakeswap"]
    console.log("DETF Address", props.detfAddress)
    const productId = GetProductId(props.detfAddress)
    console.log("ProductId", productId)

    const ownedAssets = ["blah"]//GetOwnedAssets(props.detfAddress)
    console.log("ownedAssets", ownedAssets)
    const ownedAssetsWeights = GetOwnedAssetsWeights()
    console.log("ownedAssetsWeights", ownedAssetsWeights)
    const ownedAssetsPrices = [""]//GetOwnedAssetsPrices(ownedAssets)
    console.log("Owned Asset Prices", ownedAssetsPrices)

    //let targets = GetTargetAssets(productId)
    //let targets2 = GetTargetAssets2(productId)
    //console.log("targets2", targets2)

    //const targets = await GetTargetAssets(productId)



    const targetAssets = GetTargetAssets(productId)
    const targetAssetsWeights = GetTargetAssetsWeights(productId)
    const targetAssetsPrices = GetTargetAssetsPrices(productId)
    console.log("targetAssets", targetAssets)
    console.log("targetAssetsWeights", targetAssetsWeights)
    console.log("targetAssetsPrices", targetAssetsPrices)

    /* const [sellList,
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
            targetAssetsPrices) */
    /*
        let wethBalance: string = GetWethBalance(props.detfAddress)
        console.log(wethBalance.toString()) */

    //Begin Sell Orders
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

    //Begin Buy Orders

    let totalTargetPercentage: number = 0
    let tokenBalances: number = 0
    let totalBalance: number = 0

    /* adjustList && adjustList?.map((address, index) => {
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

    //adjust to buy
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
    } */

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
            <div>DETF {props.detfAddress}</div>
            <br></br>
            <div><b>Owned Assets</b></div>
            {JSON.stringify(ownedAssets)}
            <br></br>
            <div><b>Owned Assets Weights</b></div>
            {JSON.stringify(ownedAssetsWeights)}
            <br></br>
            <div><b>Owned Assets Prices</b></div>
            {JSON.stringify(ownedAssetsPrices)}
            <br></br>
            <div><b>Target Assets</b></div>
            {JSON.stringify(targetAssets)}
            <br></br>
            <div><b>Target Assets Weights</b></div>
            {JSON.stringify(targetAssetsWeights)}
            <br></br>
            <div><b>Target Assets Prices</b></div>
            {JSON.stringify(targetAssetsPrices)}
            <br></br>
            {/* <div><b>Sell List</b></div>
            <div>{JSON.stringify(sellList)}</div>
            <div><b>Adjust To Sell List</b></div>
            <div>{JSON.stringify(adjustToSellList)}</div>
            <div><b>Adjust To Buy List</b></div>
            <div>{JSON.stringify(adjustToBuyList)}</div>
            <div><b>Buy List</b></div>
            <div>{JSON.stringify(buyList)}</div> */}
            {/* <button onClick={() => Thing?.()}>Rebalance</button> */}
        </>
    )
}