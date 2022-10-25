import { Interface } from "ethers/lib/utils"
import UniswapV2Pair from "../../chain-info/IUniswapV2Pair.json"
import UniswapV2Factory from "../../chain-info/IUniswapV2Factory.json"
import { useContractRead } from "wagmi"
import { GetLatestPrice } from "./GetLatestPrice"
import { GetTokenDecimals } from "./ERC20Utils"
import baseTokens from "../../chain-info/baseTokens.json"
import factoryAddresses from "../../chain-info/factoryAddresses.json"

export const GetTokenLiquiditySingle = (chain: string, baseToken: string, tokenAddress: string, currency: string) => {
    const IUniswapV2Factory = new Interface(UniswapV2Factory)
    const IUniswapV2Pair = new Interface(UniswapV2Pair)

    const { data: pairAddressData } = useContractRead({
        addressOrName: factoryAddresses[0],
        contractInterface: IUniswapV2Factory,
        functionName: "getPair",
        chainId: 56,
        args: [baseToken, tokenAddress]
    })

    const pairAddress = pairAddressData ? pairAddressData.toString() : ""

    const { data: tokenReservesData } = useContractRead({
        addressOrName: pairAddress,
        contractInterface: IUniswapV2Pair,
        functionName: "getReserves",
        chainId: 56,
    })

    const tokenReserves = tokenReservesData ? tokenReservesData : []

    const { data: token0Address } = useContractRead({
        addressOrName: pairAddress,
        contractInterface: IUniswapV2Pair,
        functionName: "token0",
        chainId: 56,
    })

    const token0 = token0Address ? token0Address.toString() : ""

    let tokenBalance = 0
    let baseTokenBalance = 0

    if (token0 === tokenAddress) {
        tokenBalance = tokenReserves.reserve0;
        baseTokenBalance = tokenReserves.reserve1;
    } else {
        baseTokenBalance = tokenReserves.reserve0;
        tokenBalance = tokenReserves.reserve1;
    }

    let tokenPrice = Number(GetLatestPrice(chain, tokenAddress, currency))
    let tokenDecimals = Number(GetTokenDecimals(tokenAddress))
    let liquidity = Number((((2 * tokenBalance) * tokenPrice) /
        10 ** tokenDecimals))

    return liquidity
}

export const GetTokenLiquidity = (chain: string, tokenAddress: string, currency: string) => {
    let liquidity = 0;
    baseTokens.map(baseToken => {
        liquidity = liquidity +
            GetTokenLiquiditySingle(chain, baseToken, tokenAddress, currency)
    })
    return liquidity;
}