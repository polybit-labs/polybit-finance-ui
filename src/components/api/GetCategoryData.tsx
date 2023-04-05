import { useState, useEffect } from "react"
import axios from "axios"
import apiURLJSON from "./api-info.json"

export type CategoryData = {
    "chain_name": string;
    "category": string;
    "dimension": string;
    "performance_7d": number,
    "performance_data": Array<number>
}

export const GetCategoryData = (category_name: string) => {
    const [response, setResponse] = useState<Array<CategoryData>>()
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
            axios.post(apiURL + "/api/get_category_data", { "category_name": category_name })
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