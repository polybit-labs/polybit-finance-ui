import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"

export interface DETFAccountData {
    detf_address: string;
    product_id: number;
    category: string;
    dimension: string;
    status: number;
    creation_timestamp: number;
    close_timestamp: number;
    balance_in_weth: number;
    deposits: Array<string>;
    total_deposits: number;
    time_lock: number;
    time_lock_remaining: number;
    return_weth: string;
    return_percentage: number;
    final_return_weth: string
    final_return_percentage: number;
    final_return: number;
    final_balance_in_weth: string;
}

export const GetDETFAccountData = (detf_address: string) => {
    const [response, setResponse] = useState<DETFAccountData>()
    const network = useNetwork()
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const rpc = network.chain?.rpcUrls.default.http[0]
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
            axios.post(apiURL + "/api/get_detf_accounts_data", { "rpc_provider": rpc, "chain_id": chainId, "detf_address": detf_address })
                .then(res => {
                    setResponse(res.data)
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