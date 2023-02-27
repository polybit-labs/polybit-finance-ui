import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"

export const GetDETFAccounts = (wallet_owner: string) => {
    const [response, setResponse] = useState<Array<string>>()
    const network = useNetwork()
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
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
        axios.post(apiURL + "/api/get_detf_accounts", { "rpc_provider": rpc, "chain_id": chainId, "wallet_owner": wallet_owner })
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