import { useContractRead, erc20ABI } from 'wagmi'

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