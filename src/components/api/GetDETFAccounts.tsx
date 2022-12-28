import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURL from "./api-info.json"

export const GetDETFAccounts = (wallet_owner: string) => {
    const [response, setResponse] = useState<Array<string>>()
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        console.log("RPC", rpc)
        axios.post(apiURL["apiURL"] + "/api/get_detf_accounts", { "rpc_provider": rpc, "wallet_owner": wallet_owner })
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