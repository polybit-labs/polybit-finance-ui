import { useContractRead, erc20ABI } from 'wagmi'

export type ERC20Token = {
    symbol: string
    name: string
    logoURI: string
    address: string
    chainId: number
    decimals: number
}

export const BNB: ERC20Token = {
    symbol: "BNB",
    name: "Binance",
    logoURI: "https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313",
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    chainId: 56,
    decimals: 18
}

export const CAKE: ERC20Token = {
    symbol: "CAKE",
    name: "PancakeSwap",
    logoURI: "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png",
    address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    chainId: 56,
    decimals: 18
}

export const GetTokenName = (tokenAddress: string) => {
    const { data, isError, isLoading } = useContractRead({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "name"
    })
    if (data) {
        return data
    }
}

export const GetTokenSymbol = (tokenAddress: string) => {
    const { data, isError, isLoading } = useContractRead({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "symbol"
    })
    if (data) {
        return data
    }
}

export const GetTokenDecimals = (tokenAddress: string) => {
    const { data, isError, isLoading } = useContractRead({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "decimals"
    })
    if (data) {
        return data
    }
}

export const GetTokenBalance = (tokenAddress: `0x${string}`, walletOwner: `0x${string}`) => {
    const { data, isError, isLoading } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [walletOwner],
        onSettled(data, error) {
            //console.log('GetTokenBalance', { data, error })
        },
        onSuccess(data) {
            //console.log('GetTokenBalance', data)
        }
    })
    if (data) {
        return data
    }
}