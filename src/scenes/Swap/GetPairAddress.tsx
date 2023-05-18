import { useState } from "react"
import { useContractRead } from "wagmi"
import { IFactory } from "../../context/abi/IFactory"

interface PairAddressProps {
    factory: string | undefined
    tokenOne: string
    tokenTwo: string
}

export const GetPairAddress = (props: PairAddressProps) => {
    const [pairAddress, setPairAddress] = useState<string>()

    const pairData = useContractRead({
        address: props.factory as `0x${string}`,
        abi: IFactory,
        functionName: "getPair",
        args: [props.tokenOne as `0x${string}`, props.tokenTwo as `0x${string}`],
        onSettled(data, error) {
            //console.log('PairAddress Settled', { data, error })
        },
        onSuccess(data) {
            //console.log('PairAddress Success', data)
            setPairAddress(data)
        },
    })
    return pairAddress
}