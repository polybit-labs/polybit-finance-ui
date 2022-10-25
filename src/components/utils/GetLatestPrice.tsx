import { useContext, useEffect, useState } from "react"
import { CurrencyContext } from "./Currency"
import axios from "axios"

export const GetLatestPrice = (chain: string, tokenAddress: string) => {
    const currency = useContext(CurrencyContext).currency
    const url = `https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${tokenAddress}&vs_currencies=${currency}`
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get(url).then((response) => {
            setData(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [currency])

    if (data) {
        /* console.log(data[(tokenAddress).toLowerCase()][currency.toLowerCase()]) */
        return data[(tokenAddress).toLowerCase()][currency.toLowerCase()]
    } else {
        console.log("Could not get price for " + tokenAddress)
    }

}