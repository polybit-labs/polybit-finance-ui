import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFInterface from "../../chain_info/IPolybitDETF.json"
import { GetLatestPrice } from './GetLatestPrice'
import detfIndexInfo from "../../product/detfIndex.json"
import axios from "axios"
import { setTimeout } from "timers/promises"
import { count } from 'console'

const IPolybitDETF = new Interface(PolybitDETFInterface)

export const GetProductId = (detfAddress: string) => {
    const { data, isError, isLoading, isSuccess } = useContractRead({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "getProductId",
        onError(error) {
            console.log('getProductId Error', error)
        },
        onSuccess(data) {
            console.log('getProductId Success', data.toString())
        },
    })
    if (isSuccess) {
        return data!.toString()
    }
    return ""
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

export const GetTargetAssets = (productId: string) => {
    const productData = detfIndexInfo.find(item => item.productId === Number(productId))
    const urlChainId = productData?.urlChainId
    const urlCategoryId = productData?.urlCategoryId
    const urlDimensionId = productData?.urlDimensionId
    let tokenData
    let tokens: Array<any> = Array(10)
    let targetAssets: Array<string> = []

    try {
        tokenData = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    } catch {
        console.log(`Token data file not found.`)
    }

    if (tokenData) {
        let index = 0
        tokenData.tokens.map((token: any) => {
            tokens[index] = token
            index++
        })

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== undefined) {
                targetAssets.push(tokens[i].address)
            }
        }
    }
    return targetAssets
}

export const GetTargetAssetsWeights = (productId: string) => {
    const productData = detfIndexInfo.find(item => item.productId === Number(productId))
    const urlChainId = productData?.urlChainId
    const urlCategoryId = productData?.urlCategoryId
    const urlDimensionId = productData?.urlDimensionId
    let tokenData
    let tokens: Array<any> = Array(10)
    let targetAssetsWeights: Array<string> = []

    try {
        tokenData = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    } catch {
        console.log(`Token data file not found.`)
    }

    if (tokenData) {
        let index = 0
        tokenData.tokens.map((token: any) => {
            tokens[index] = token
            index++
        })

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== undefined) {
                targetAssetsWeights.push((Math.round(10 ** 8 * Number(tokens[i].dimension.weight))).toString())
            }
        }
    }
    return targetAssetsWeights
}

export const GetTargetAssetsPrices = (productId: string) => {
    const productData = detfIndexInfo.find(item => item.productId === Number(productId))
    const urlChainId = productData?.urlChainId
    const urlCategoryId = productData?.urlCategoryId
    const urlDimensionId = productData?.urlDimensionId
    let tokenData
    let tokens: Array<any> = Array(10)
    let targetAssetsPrices: Array<string> = Array(10)

    try {
        tokenData = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    } catch {
        console.log(`Token data file not found.`)
    }

    if (tokenData) {
        const coingGeckoID = process.env.REACT_APP_COINGECKO_API_KEY;
        const url0 = `https://pro-api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${tokenData.tokens[0].address.toLowerCase()}?x_cg_pro_api_key=${coingGeckoID}`
        const url1 = `https://pro-api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${tokenData.tokens[1].address.toLowerCase()}?x_cg_pro_api_key=${coingGeckoID}`

        axios.get(url0).then(response => { targetAssetsPrices[0] = response.data })
        axios.get(url1).then(response => { targetAssetsPrices[1] = response.data })

    }


    //targetAssetsPrices[0] = Math.round(Number(GetLatestPrice("binance-smart-chain", tokenData.tokens[0].address, "bnb")) * 10 ** 18).toString()
    //targetAssetsPrices[1] = Math.round(Number(GetLatestPrice("binance-smart-chain", tokenData.tokens[1].address, "bnb")) * 10 ** 18).toString()

    console.log(targetAssetsPrices)
    return targetAssetsPrices
}

export const GetTargetAssets1 = (productId: string) => {
    const productData = detfIndexInfo.find(item => item.productId === Number(productId))
    const urlChainId = productData?.urlChainId
    const urlCategoryId = productData?.urlCategoryId
    const urlDimensionId = productData?.urlDimensionId
    //console.log("productDataLocation", `../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    let tokens: Array<any> = Array(10)
    let tokenData

    try {
        tokenData = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    } catch {
        console.log(`Token data file not found.`)
    }

    if (tokenData) {
        let index = 0
        tokenData.tokens.map((token: any) => {
            tokens[index] = token
            index++
        })
    }

    let targetAssets: Array<string> = []
    let targetAssetsWeights: Array<string> = []
    let targetAssetsPrices: Array<string> = []

    if (tokens) {
        let promises = []
        let prices: any = []

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== undefined) {
                targetAssets.push(tokens[i].address)
                targetAssetsWeights.push((Math.round(10 ** 8 * Number(tokens[i].dimension.weight))).toString())
                const coingGeckoID = process.env.REACT_APP_COINGECKO_API_KEY;
                const url = `https://pro-api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${tokens[i].address.toLowerCase()}?x_cg_pro_api_key=${coingGeckoID}`
                promises.push(
                    axios.get(url).then(response => {
                        prices.push(response);
                    })
                )
            }
        }
        Promise.all(promises).then(() => {
            let priceData: Array<string> = []
            for (let i = 0; i < prices.length; i++) {
                priceData[i] = Math.round(10 ** 18 * Number(prices[i].data.market_data.current_price.bnb)).toString()
            }
            console.log("priceData", priceData)
            return [targetAssets, targetAssetsWeights, priceData]
        });
    }
    return [targetAssets, targetAssetsWeights, targetAssetsPrices]
}
export const GetTargetAssets2 = (productId: string) => {
    const productData = detfIndexInfo.find(item => item.productId === Number(productId))
    const urlChainId = productData?.urlChainId
    const urlCategoryId = productData?.urlCategoryId
    const urlDimensionId = productData?.urlDimensionId
    //console.log("productDataLocation", `../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    let tokens: Array<any> = Array(10)
    let tokenData

    try {
        tokenData = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
    } catch {
        console.log(`Token data file not found.`)
    }

    if (tokenData) {
        let index = 0
        tokenData.tokens.map((token: any) => {
            tokens[index] = token
            index++
        })
    }

    let targetAssets: Array<string> = []
    let targetAssetsWeights: Array<string> = []
    let targetAssetsPrices: Array<string> = []

    if (tokens) {
        let count = 0
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== undefined) {
                count++
            }
        }
        console.log("token count", count)
        targetAssetsPrices = Array(count)
    }

    async function fetchPrice(address: string, index: number) {
        const coingGeckoID = process.env.REACT_APP_COINGECKO_API_KEY;
        const url = `https://pro-api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${address.toLowerCase()}?x_cg_pro_api_key=${coingGeckoID}`
        await axios.get(url).then(response => {
            targetAssetsPrices[index] = (Math.round(10 ** 18 * Number(response.data.market_data.current_price.bnb)).toString())
        })
    }

    if (tokens) {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== undefined) {
                targetAssets.push(tokens[i].address)
                targetAssetsWeights.push((Math.round(10 ** 8 * Number(tokens[i].dimension.weight))).toString())
                fetchPrice(tokens[i].address, i)
            }
        }

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