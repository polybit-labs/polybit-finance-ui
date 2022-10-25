import { erc20ABI } from 'wagmi'
import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'

export const GetTokenName = (tokenAddress: string) => {
    const IERC20 = new Interface(erc20ABI)
    const { data, isError, isLoading } = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: IERC20,
        functionName: "name"
    })
    if (data) {
        return data
    }
}

export const GetTokenSymbol = (tokenAddress: string) => {
    const IERC20 = new Interface(erc20ABI)
    const { data, isError, isLoading } = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: IERC20,
        functionName: "symbol"
    })
    if (data) {
        return data
    }
}

export const GetTokenDecimals = (tokenAddress: string) => {
    const IERC20 = new Interface(erc20ABI)
    const { data, isError, isLoading } = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: IERC20,
        functionName: "decimals"
    })
    if (data) {
        return data
    }
}