import { useContractRead } from "wagmi"
import { Interface } from "ethers/lib/utils"
import PolybitRebalancer from "../../chain_info/IPolybitRebalancer.json"
import PolybitRouter from "../../chain_info/IPolybitRouter.json"
import map from "../../chain_info/map.json"

const IPolybitRebalancer = new Interface(PolybitRebalancer)
const rebalancerAddress: string = map["5777"]["rebalancer"][0]
const IPolybitRouter = new Interface(PolybitRouter)
const routerAddress: string = map["5777"]["router"][0]

/* interface RebalancerLists {
    "detfAddress": string;
    "ownedAssets": Array<string>;
    "ownedAssetsWeights": Array<string>;
    "ownedAssetsPrices": Array<string>;
    "targetAssets": Array<string>;
    "targetAssetsWeights": Array<string>;
    "targetAssetsPrices": Array<string>;
} */

export const GetRebalancerLists = (detfAddress: string,
    ownedAssets: Array<string>,
    ownedAssetsWeights: Array<string>,
    ownedAssetsPrices: Array<string>,
    targetAssets: Array<string>,
    targetAssetsWeights: Array<string>,
    targetAssetsPrices: Array<string>) => {
    /* 
    Create Sell Lists 
    */
    const { data: sellListData } = useContractRead({
        addressOrName: rebalancerAddress,
        contractInterface: IPolybitRebalancer,
        functionName: "createSellList",
        args: [ownedAssets, ownedAssetsPrices, targetAssets],
        onError(error) {
            console.log('sellListData Error', error)
        }
    })

    const sellList: Array<string> = sellListData ? sellListData[0] : []
    const sellListPrices: Array<string> = sellListData ? sellListData[1] : []

    console.log("Sell List", sellList)
    console.log("Sell List Prices", sellListPrices)

    /* 
    Create Adjust Lists 
    */
    const { data: adjustListData } = useContractRead({
        addressOrName: rebalancerAddress,
        contractInterface: IPolybitRebalancer,
        functionName: "createAdjustList",
        args: [ownedAssets, ownedAssetsPrices, targetAssets, targetAssetsWeights],
        onError(error) {
            console.log('adjustListData Error', error)
        }
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
        args: [detfAddress, ownedAssetsPrices, adjustList, adjustListWeights, adjustListPrices],
        onError(error) {
            console.log('adjustToSellListData Error', error)
        }
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
        args: [detfAddress, ownedAssetsPrices, adjustList, adjustListWeights, adjustListPrices],
        onError(error) {
            console.log('adjustToBuyListData Error', error)
        }
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
        args: [ownedAssets, targetAssets, targetAssetsWeights, targetAssetsPrices],
        onError(error) {
            console.log('buyListData Error', error)
        }
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

    return [sellList,
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
        buyListPrices]
}

export const GetBuyOrder = (
    buyList: Array<string>,
    buyListWeights: Array<string>,
    buyListPrices: Array<string>,
    wethBalance: string,
    totalTargetPercentage: number) => {
    const { data: buyOrderData, isError } = useContractRead({
        addressOrName: rebalancerAddress,
        contractInterface: IPolybitRebalancer,
        functionName: "createBuyOrder",
        args: [buyList, buyListWeights, buyListPrices, wethBalance, totalTargetPercentage],
        onError(error) {
            console.log('GetBuyOrder Error', error)
        }
    })
    return buyOrderData ? buyOrderData : []
}

export const GetLiquidPath = (tokenIn: string, tokenOut: string, tokenAmountIn: string, tokenAmountOut: string) => {
    const { data: path, isError } = useContractRead({
        addressOrName: routerAddress,
        contractInterface: IPolybitRouter,
        functionName: "getLiquidPath",
        args: [tokenIn,
            tokenOut,
            tokenAmountIn,
            tokenAmountOut],
        onError(error) {
            console.log('GetLiquidPath Error', error)
        }
    })
    return path ? path : []
}

export const GetLiquidPaths = (tokensIn: Array<string>, tokensOut: Array<string>, tokenAmountsIn: Array<string>, tokenAmountsOut: Array<string>) => {
    const { data: path, isError, isLoading } = useContractRead({
        addressOrName: routerAddress,
        contractInterface: IPolybitRouter,
        functionName: "getLiquidPaths",
        args: [tokensIn,
            tokensOut,
            tokenAmountsIn,
            tokenAmountsOut],
        onError(error) {
            console.log('GetLiquidPaths Error', error)
        }
    })
    if (isLoading) {
        console.log("GetLiquidPaths loading...")
    }
    return path ? path : []
}