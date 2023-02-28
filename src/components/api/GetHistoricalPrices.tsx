import { useState, useEffect } from "react"
import axios from "axios"
import apiURLJSON from "./api-info.json"

export const GetHistoricalPrices = () => {
    const [response, setResponse] = useState<Array<any>>()
    let isLoading: boolean
    let isSuccess: boolean
    const [apiURL, setapiURL] = useState(apiURLJSON["apiURL"])

    useEffect(() => {
        if (window.location.href.includes("http://localhost/")) {
            setapiURL(apiURLJSON["apiURLTest"])
        }
    }, [])

    useEffect(() => {
        axios.get(apiURL + "/api/get_historical_prices")
            .then(res => {
                setResponse(res.data)
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