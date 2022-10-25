import { useEffect, useState } from "react"
import axios from "axios"

export const GetLatestPrice = (chain: string, tokenAddress: string, currency: string) => {
    const url = `https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${tokenAddress}&vs_currencies=${currency}`
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get(url).then((response) => {
            setData(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    if (data) {
        /* console.log(data[(tokenAddress).toLowerCase()][currency.toLowerCase()]) */
        return data[(tokenAddress).toLowerCase()][currency.toLowerCase()]
    }

}