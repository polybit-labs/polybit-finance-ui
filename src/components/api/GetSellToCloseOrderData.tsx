import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURL from "./api-info.json"

export const GetSellToCloseOrderData = (detfAddress: string) => {
    const [response, setResponse] = useState<Array<any>>()
    const network = useNetwork()
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const rpc = network.chain?.rpcUrls.default
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        axios.post(apiURL["apiURL"] + "/api/sell_to_close", { "rpc_provider": rpc, "chain_id": chainId, "detf_address": detfAddress })
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