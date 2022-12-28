import { useState, useEffect } from "react"
import axios from "axios"
import apiURL from "./api-info.json"

export const GetPriceVsCurrency = (token_address: string) => {
    const [response, setResponse] = useState<any>()
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        axios.post(apiURL["apiURL"] + "/api/get_price_vs_currency", { "token_address": token_address })
            .then(res => {
                const prices = {
                    "aud": res.data.aud,
                    "bnb": res.data.bnb,
                    "cny": res.data.cny,
                    "eur": res.data.eur,
                    "idr": res.data.idr,
                    "jpy": res.data.jpy,
                    "krw": res.data.krw,
                    "rub": res.data.rub,
                    "twd": res.data.twd,
                    "usd": res.data.usd
                }
                setResponse(prices)
            })
            .catch((err) => {
                console.log(err.response)
            })
    }, [])

    if (response === undefined) {
        isLoading = true
        isSuccess = false
    } else {
        isLoading = false
        isSuccess = true
    }

    return { response, isLoading, isSuccess }
}