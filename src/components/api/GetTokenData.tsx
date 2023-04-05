import { useState, useEffect } from "react"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { TokenIndexData } from "./GetTokenIndexData"

export const GetTokenData = (token_name: string) => {
    const [response, setResponse] = useState<TokenIndexData>()
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
            axios.post(apiURL + "/api/get_token_data", { "token_name": token_name })
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