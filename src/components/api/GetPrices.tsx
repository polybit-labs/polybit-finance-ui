import { useState, useEffect } from "react"
import axios from "axios"
import apiURL from "./api-info.json"

export const GetPrices = (token_addresses: Array<string>) => {
    const [response, setResponse] = useState<string>()
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        axios.post(apiURL["apiURL"] + "/api/get_prices", { token_addresses })
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