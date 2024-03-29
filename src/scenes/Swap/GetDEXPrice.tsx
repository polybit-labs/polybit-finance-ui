import { useContractReads } from "wagmi"
import { useEffect, useState } from "react"
import { BigNumber } from "ethers"
import { GetPairAddress } from "./GetPairAddress"
import { ERC20Token } from "../../components/utils/ERC20Utils"
import { IPair } from "../../context/abi/IPair"

interface DEXPriceProps {
    factory: string | undefined
    tokenOne: ERC20Token
    tokenTwo: ERC20Token
}

export const GetDEXPrice = (props: DEXPriceProps) => {
    const [numerator, setNumerator] = useState<string | undefined>()
    const [denominator, setDenominator] = useState<string | undefined>()
    const [numeratorReserves, setNumeratorReserves] = useState<BigNumber | undefined>()
    const [denominatorReserves, setDenominatorReserves] = useState<BigNumber | undefined>()
    const [numeratorDecimals, setNumeratorDecimals] = useState<number | undefined>()
    const [denominatorDecimals, setDenominatorDecimals] = useState<number | undefined>()
    const [tokenPrice, setTokenPrice] = useState<number>(0)

    const pairContract = {
        address: GetPairAddress({ factory: props.factory, tokenOne: props.tokenOne.address, tokenTwo: props.tokenTwo.address })?.toString() as `0x${string}`,
        abi: IPair,
    }

    let numeratorMatch: boolean
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
            //console.log('DEXPrice Success', data)
            setNumerator(data ? data[1] : "")
            setNumeratorReserves(data[0] ? data[0][0] : undefined)
            setDenominator(data ? data[2] : "")
            setDenominatorReserves(data[0] ? data[0][1] : undefined)
        },
    })

    useEffect(() => {
        if (numerator == props.tokenOne.address) {
            numeratorMatch = true
            setNumeratorDecimals(props.tokenOne.decimals)
            setDenominatorDecimals(props.tokenTwo.decimals)
        } else {
            numeratorMatch = false
            setNumeratorDecimals(props.tokenTwo.decimals)
            setDenominatorDecimals(props.tokenOne.decimals)
        }

        if (numeratorDecimals && denominatorDecimals) {
            console.log("decimals", numeratorDecimals, denominatorDecimals)
            if (numeratorMatch == true) {
                setTokenPrice((Number(denominatorReserves) / denominatorDecimals) / (Number(numeratorReserves) / numeratorDecimals))
            } else {
                setTokenPrice((Number(numeratorReserves) / numeratorDecimals) / (Number(denominatorReserves) / denominatorDecimals))
            }
        }

    }, [numerator, denominator, props.tokenOne, props.tokenTwo])
    return tokenPrice
}