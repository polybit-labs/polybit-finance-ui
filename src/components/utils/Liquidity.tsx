import { Interface } from "ethers/lib/utils"
import UniswapV2Pair from "../../chain-info/IUniswapV2Pair.json"
import UniswapV2Factory from "../../chain-info/IUniswapV2Factory.json"
import { useContractRead } from "wagmi"
import { GetLatestPrice } from "./GetLatestPrice"
import { GetTokenDecimals } from "./ERC20Utils"
import baseTokens from "../../chain-info/baseTokens.json"
import factoryAddresses from "../../chain-info/factoryAddresses.json"

export const GetTokenLiquiditySingle = (chain: string, baseToken: string, tokenAddress: string, chainId: number) => {
    const IUniswapV2Factory = new Interface(UniswapV2Factory)
    const IUniswapV2Pair = new Interface(UniswapV2Pair)
    const swapFactory = factoryAddresses["56"]["pancakeswap"]

    const { data: pairAddressData } = useContractRead({
        addressOrName: swapFactory,
        contractInterface: IUniswapV2Factory,
        functionName: "getPair",
        chainId: chainId,
        args: [baseToken, tokenAddress]
    })

    const pairAddress = pairAddressData ? pairAddressData.toString() : ""
    /* console.log("Pair", pairAddress)
    console.log("Token", tokenAddress)
    console.log("Base", baseToken) */

    const { data: tokenReservesData } = useContractRead({
        addressOrName: pairAddress,
        contractInterface: IUniswapV2Pair,
        functionName: "getReserves",
        chainId: chainId,
    })

    console.log(pairAddress)
    const tokenReserves = tokenReservesData ? tokenReservesData : []

    const { data: token0Address } = useContractRead({
        addressOrName: pairAddress,
        contractInterface: IUniswapV2Pair,
        functionName: "token0",
        chainId: chainId,
    })

    const token0 = token0Address ? token0Address.toString() : "0x0000000000000000000000000000000000000000"

    let tokenBalance = 0
    let baseTokenBalance = 0

    if (token0 === tokenAddress) {
        tokenBalance = tokenReserves.reserve0;
        baseTokenBalance = tokenReserves.reserve1;
    } else {
        baseTokenBalance = tokenReserves.reserve0;
        tokenBalance = tokenReserves.reserve1;
    }


    let tokenPrice = Number(GetLatestPrice(chain, tokenAddress, "bnb"))
    let tokenDecimals = Number(GetTokenDecimals(tokenAddress))
    let liquidity = Number((((2 * tokenBalance) * tokenPrice) /
        10 ** tokenDecimals))

    return liquidity
}

export const GetTokenLiquidity = (chain: string, tokenAddress: string, chainId: number) => {
    let liquidity = 0;
    baseTokens.map(baseToken => {
        liquidity = liquidity +
            GetTokenLiquiditySingle(chain, baseToken, tokenAddress, chainId)
    })
    if (liquidity > 0) {
        return liquidity
    }
    else { return 0 }
}

interface GetTotalLiquidityProps {
    tokens: Array<any>,
}
export const GetTotalLiquidity = (props: GetTotalLiquidityProps, chainId: number) => {
    let totalLiquidity = 0
    props.tokens?.map(token => {
        totalLiquidity = totalLiquidity + GetTokenLiquidity("binance-smart-chain", token.address, chainId)
    })
    return totalLiquidity
}