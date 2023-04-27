import { useContractReads } from "wagmi"
import { useState } from "react"
import { BigNumber } from "ethers"
import { PairAddress } from "./PairAddress"

interface DEXPriceProps {
    factory: string | undefined
    numerator: string
    denominator: string
    numeratorDecimals: number
    denominatorDecimals: number
}

export const DEXPrice = (props: DEXPriceProps) => {
    const [numerator, setNumerator] = useState<string | undefined>()
    const [denominator, setDenominator] = useState<string | undefined>()
    const [numeratorReserves, setNumeratorReserves] = useState<BigNumber | undefined>()
    const [denominatorReserves, setDenominatorReserves] = useState<BigNumber | undefined>()

    const pairContract = {
        address: PairAddress({ factory: props.factory, tokenOne: props.numerator, tokenTwo: props.denominator })?.toString() as `0x${string}`,
        abi: [{
            "constant": true,
            "inputs": [],
            "name": "getReserves",
            "outputs": [
                {
                    "internalType": "uint112",
                    "name": "_reserve0",
                    "type": "uint112"
                },
                {
                    "internalType": "uint112",
                    "name": "_reserve1",
                    "type": "uint112"
                },
                {
                    "internalType": "uint32",
                    "name": "_blockTimestampLast",
                    "type": "uint32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "token0",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "token1",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },] as const,
    }

    const { data, isError, isLoading, isSuccess } = useContractReads({
        contracts: [
            {
                ...pairContract,
                functionName: "getReserves",
            },
            {
                ...pairContract,
                functionName: "token0",
            },
            {
                ...pairContract,
                functionName: "token1",
            },],
        onSettled(data, error) {
            //console.log('DEXPrice Settled', { data, error })
        },
        onSuccess(data) {
            //console.log('Success', data)
            setNumerator(data ? data[1] : "")
            setNumeratorReserves(data[0] ? data[0][0] : undefined)
            setDenominator(data ? data[2] : "")
            setDenominatorReserves(data[0] ? data[0][1] : undefined)
        },
    })

    let numeratorMatch: boolean
    let tokenPrice: number
    if (numerator == props.numerator) {
        numeratorMatch = true
    } else {
        numeratorMatch = false
    }

    if (numeratorMatch == true) {
        tokenPrice = (Number(denominatorReserves) / props.denominatorDecimals) / (Number(numeratorReserves) / props.numeratorDecimals)
    } else {
        tokenPrice = (Number(numeratorReserves) / props.numeratorDecimals) / (Number(denominatorReserves) / props.denominatorDecimals)
    }

    return tokenPrice
}