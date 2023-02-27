import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"

export interface PerformanceDataRange {
    date: string;
    index_price: number;
    pct: number;
}

export const GetPerformanceDataRange = (url: string, start_date: number, end_date: number) => {
    const [response, setResponse] = useState<Array<PerformanceDataRange>>()
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    let isLoading: boolean
    let isSuccess: boolean
    const [apiURL, setapiURL] = useState(apiURLJSON["apiURL"])

    useEffect(() => {
        if (window.location.href.includes("http://localhost/")) {
            setapiURL(apiURLJSON["apiURLTest"])
        }
    }, [])

    useEffect(() => {
        axios.post(apiURL + "/api/get_performance_data_range", { "url": url, "start_date": start_date, "end_date": end_date })
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