import React, { useEffect, useState } from 'react'
import { GetPriceVsCurrency } from '../../components/api/GetPriceVsCurrency';
import { FormatCurrency } from '../../components/utils/Currency';

interface GetAmountInCurrencyProps {
    tokenAddress: string;
    tokenAmount: number;
    tokenDecimals: number;
    currency: string;
    lastAmountInCurrency: number;
    setLastAmountInCurrency: Function;
}

export const GetAmountInCurrency = (props: GetAmountInCurrencyProps) => {
    const [prices, setPrices] = useState<any>(undefined)
    const pricesData = GetPriceVsCurrency(props.tokenAddress)

    useEffect(() => {
        if (pricesData.isSuccess) {
            setPrices(pricesData.response)
        }
    }, [pricesData])

    if (prices) {
        const price = prices[props.currency.toLocaleLowerCase()]
        const amount = price * props.tokenAmount / (10 ** props.tokenDecimals)
        props.setLastAmountInCurrency(amount)

        return (
            <p>
                ({FormatCurrency(amount, 4)})
            </p>
        )
    }
    return (
        <p>({FormatCurrency(props.lastAmountInCurrency, 4)})</p>
    )
}
