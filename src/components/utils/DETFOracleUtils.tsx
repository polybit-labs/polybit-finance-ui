import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFOracleInterface from "../../chain-info/IPolybitDETFOracle.json"

export const GetTargetList = (detfOracleAddress: string) => {
    const IPolybitDETFOracle = new Interface(PolybitDETFOracleInterface)
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfOracleAddress,
        contractInterface: IPolybitDETFOracle,
        functionName: "getTargetList",
        chainId: 56
    })
    if (data) { return data }
}

export const GetTokenLiquidity = (detfOracleAddress: string, tokenAddress: string, chainId: number) => {
    const IPolybitDETFOracle = new Interface(PolybitDETFOracleInterface)
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfOracleAddress,
        contractInterface: IPolybitDETFOracle,
        functionName: "getTokenLiquidity",
        chainId: chainId,
        args: [tokenAddress]
    })
    return data
}

export const GetTargetPercentage = (detfOracleAddress: string, tokenAddress: string, riskWeighting: number) => {
    const IPolybitDETFOracle = new Interface(PolybitDETFOracleInterface)
    const { data, isError, isLoading } = useContractRead({
        addressOrName: detfOracleAddress,
        contractInterface: IPolybitDETFOracle,
        functionName: "getTargetPercentage",
        args: [tokenAddress, riskWeighting]
    })
    return data
}
