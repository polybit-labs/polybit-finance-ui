import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { BigNumber } from "ethers"

/* type OrderData = {
    sellList: readonly `0x${string}`[];
    sellListPrices: readonly BigNumber[];
    sellOrders: readonly {
        swapFactory: readonly `0x${string}`[];
        path: readonly (readonly `0x${string}`[])[];
        amountsIn: readonly BigNumber[];
        amountsOut: readonly BigNumber[];
    }[];
    adjustList: readonly `0x${string}`[];
    adjustListPrices: readonly BigNumber[];
    adjustToSellList: readonly `0x${string}`[];
    adjustToSellListPrices: readonly BigNumber[];
    adjustToSellOrders: readonly {
        swapFactory: readonly `0x${string}`[];
        path: readonly (readonly `0x${string}`[])[];
        amountsIn: readonly BigNumber[];
        amountsOut: readonly BigNumber[];
    }[];
    adjustToBuyList: readonly `0x${string}`[];
    adjustToBuyListPrices: readonly BigNumber[];
    adjustToBuyListWeights: readonly BigNumber[];
    adjustToBuyOrders: readonly {
        swapFactory: readonly `0x${string}`[];
        path: readonly (readonly `0x${string}`[])[];
        amountsIn: readonly BigNumber[];
        amountsOut: readonly BigNumber[];
    }[];
    buyList: readonly `0x${string}`[];
    buyListPrices: readonly BigNumber[];
    buyListWeights: readonly BigNumber[];
    buyOrders: readonly {
        swapFactory: readonly `0x${string}`[];
        path: readonly (readonly `0x${string}`[])[];
        amountsIn: readonly BigNumber[];
        amountsOut: readonly BigNumber[];
    }[];
} */

export const GetOrderData = (detfAddress: string, weth_input_amount: string) => {
    const [response, setResponse] = useState<Array<any>>()
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
            axios.post(apiURL + "/api/get_deposit_order_data", { "rpc_provider": rpc, "chain_id": chainId, "detf_address": detfAddress, "weth_input_amount": weth_input_amount })
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