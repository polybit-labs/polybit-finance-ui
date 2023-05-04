import { useContractRead, erc20ABI } from 'wagmi'

export type ERC20Token = {
    symbol: string
    name: string
    logoURI: string
    address: string
    chainId: number
    decimals: number
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