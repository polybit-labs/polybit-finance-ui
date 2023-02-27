import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"

export interface PerformanceData {
    date: string;
    index_price: number;
    performance_7d: number;
    performance_30d: number;
    performance_90d: number;
    performance_180d: number;
    performance_365d: number;
    performance_730d: number;
}
export const GetPerformanceData = (url: string) => {
    const [response, setResponse] = useState<Array<PerformanceData>>()
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
        axios.post(apiURL + "/api/get_performance_data", { "url": url })
            .then(res => {
                setResponse(res.data);
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