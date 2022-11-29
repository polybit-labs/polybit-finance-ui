import { useEffect, useState } from "react"
import axios from "axios"

export const GetLatestPrice = (chain: string, tokenAddress: string, currency: string) => {
    const coingGeckoID = process.env.REACT_APP_COINGECKO_API_KEY;
    //https://pro-api.coingecko.com/api/v3/ping?x_cg_pro_api_key=YOUR_API_KEY
    const url = `https://pro-api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${tokenAddress.toLowerCase()}?x_cg_pro_api_key=${coingGeckoID}`
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
        return data["market_data"]["current_price"]["bnb"]
    } else {
        console.log("Could not get price for " + tokenAddress)
    }

}