import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURL from "./api-info.json"

export const GetLastDETFCreated = (wallet_owner: string) => {
    const [response, setResponse] = useState<string>()
    const network = useNetwork()
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const rpc = network.chain?.rpcUrls.default
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        console.log("RPC", rpc)
        axios.post(apiURL["apiURL"] + "/api/get_last_detf_created", { "rpc_provider": rpc, "chain_id": chainId, "wallet_owner": wallet_owner })
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