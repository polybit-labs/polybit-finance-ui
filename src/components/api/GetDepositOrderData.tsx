import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { BigNumber } from "ethers"

export const GetDepositOrderData = (detf_address: string, weth_input_amount: BigNumber) => {
    const [response, setResponse] = useState<Array<any>>()
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default.http[0]
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
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
            axios.post(apiURL + "/api/get_deposit_order_data", { "provider": rpc, "chain_id": chainId, "detf_address": detf_address, "weth_input_amount": weth_input_amount })
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