import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFInterface from "../../chain-info/IPolybitDETF.json"
import { GetLatestPrice } from './GetLatestPrice'
import detfIndexInfo from "../../product/detfIndex.json"

const IPolybitDETF = new Interface(PolybitDETFInterface)

export const GetProductId = (detfAddress: string) => {
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getProductId"
    })
    return data
}

export const GetProductCategory = (detfAddress: string) => {
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getProductCategory"
    })
    return data
}

export const GetProductDimension = (detfAddress: string) => {
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getProductDimension"
    })
    return data
}

export const GetOwnedAssets = (detfAddress: string) => {
    let ownedAssets: Array<string> = []
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getOwnedAssets"
    })
    if (data) {
        data?.map(address => {
            ownedAssets.push(address)
        })
    }
    return ownedAssets
}

export const GetOwnedAssetsWeights = () => {
    /* 
    
    
    create func
    
    
    */
    let ownedAssetsWeights: Array<string> = []
    return ownedAssetsWeights
}

export const GetOwnedAssetsPrices = (_ownedAssets: any) => {
    let ownedAssetsPrices: Array<string> = []
    let ownedAssets: Array<string> = _ownedAssets

    ownedAssets?.map((address, index) => {
        ownedAssetsPrices.push(Math.round(Number(GetLatestPrice("binance-smart-chain", address, "bnb")) * 10 ** 18).toString())
    })
    return ownedAssetsPrices
}

export const GetTargetAssets = (productId: number) => {
    const productData = detfIndexInfo.find(item => item.productId === productId)
    const urlChainId = productData?.urlChainId
    const urlCategoryId = productData?.urlCategoryId
    const urlDimensionId = productData?.urlDimensionId

    console.log("productDataLocation", `../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    let tokens
    try {
        tokens = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    } catch {
        console.log(`Token data file not found.`)
    }

    let targetAssets: Array<string> = []
    let targetAssetsWeights: Array<string> = []
    let targetAssetsPrices: Array<string> = []

    if (tokens) {
        tokens.tokens?.map((token: any) => {
            targetAssets.push(token.address)
            targetAssetsWeights.push((Math.round(10 ** 8 * token.dimension.weight).toString()))
            targetAssetsPrices.push(Math.round(Number(GetLatestPrice("binance-smart-chain", token.address, "bnb")) * 10 ** 18).toString())
        })
    }

    return [targetAssets, targetAssetsWeights, targetAssetsPrices]
}

export const GetTotalDeposited = (detfAddress: string) => {
    let totalDeposits: string = "0"
    const { data, isSuccess } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getTotalDeposited",
        onError(error) {
            console.log('getTotalDeposited Error', error)
        },
        onSuccess(data) {
            console.log('getTotalDeposited Success', data.toString())
        },
    })
    if (isSuccess) {
        return data!.toString()
    } else {
        return totalDeposits
    }
}

export const GetWethBalance = (detfAddress: string) => {
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getWethBalance"
    })
    const balance = data ? data.toString() : "0"
    return balance
}

export const GetTotalBalanceInWeth = (detfAddress: string, ownedAssetsPrices: Array<string>) => {
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getTotalBalanceInWeth",
        args: [ownedAssetsPrices]
    })
    const balance = data ? data : 0
    return balance
}

export const GetTokenBalance = (detfAddress: string, token: string, price: string) => {
    const { data: tokenBalance } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getTokenBalance",
        args: [token, price]
    })
    return tokenBalance ? tokenBalance : 0
}

export const GetTimeLockRemaining = (detfAddress: string) => {
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getTimeLockRemaining"
    })
    const lockTimeRemaining = data ? data : 0
    return lockTimeRemaining
}

export const GetTimeToUnlock = (timeToUnlock: number) => {
    if (timeToUnlock > 0) {
        const moment = require('moment');
        let now = moment().unix()
        let lockedUntil = moment.unix(now + timeToUnlock).local().format("D MMM YYYY hh:mm")
        return <div style={{ color: "#909090" }}>Locked until {lockedUntil}</div>
    }
    return "Unlocked"
}

export const GetTotalReturnPercentageOfDETF = (detfAddress: string) => {
    const totalDeposited = Number(GetTotalDeposited(detfAddress))
    const totalBalanceInWeth = Number(GetTotalBalanceInWeth(detfAddress, GetOwnedAssetsPrices(GetOwnedAssets(detfAddress))))
    const totalReturnPercentage = (totalBalanceInWeth - totalDeposited) / totalDeposited
    return totalReturnPercentage
}