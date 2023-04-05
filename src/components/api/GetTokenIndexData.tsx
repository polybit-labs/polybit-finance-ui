import { useState, useEffect } from "react"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { Currencies } from "../utils/Currency"

export type TokenIndexData = {
    "address": string,
    "token_name": string,
    "token_symbol": string,
    "token_logo": string,
    "one_day_return": number,
    "one_week_return": number,
    "one_month_return": number,
    "one_year_return": number,
    "global_market_cap_rank": number,
    "sentiment_score": number,
    "current_price": Currencies,
    "market_cap": Currencies,
    "volume_24h": Currencies,
    "low_24h": Currencies,
    "high_24h": Currencies,
    "last_updated": number,
    "detfs": Array<string>
}

export const GetTokenIndexData = () => {
    const [response, setResponse] = useState<Array<TokenIndexData>>()
    let isLoading: boolean
    let isSuccess: boolean
    const [apiURL, setapiURL] = useState("")

    useEffect(() => {
        if (window.location.href.includes("localhost")) {
            setapiURL(apiURLJSON["apiURLTest"])
        } else {
            setapiURL(apiURLJSON["apiURL"])
        }
    }, [])

    useEffect(() => {
        if (apiURL !== "") {
            axios.get(apiURL + "/api/get_token_index_data")
                .then(res => {
                    setResponse(res.data);
                })
                .catch((err) => {
                    console.log(err.response)
                })
        }
    }, [apiURL])

    if (response === undefined) {
        isLoading = true
        isSuccess = false
    } else {
        isLoading = false
        isSuccess = true
    }

    return { response, isLoading, isSuccess }
}