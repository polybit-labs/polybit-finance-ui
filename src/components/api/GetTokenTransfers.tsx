import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { BigNumber } from "ethers"

export type TokenTransfersData = {

}

export type TokenTransfersSummary = {
    tokenTransfers: Array<TokenTransfersData>;
    totalPurchasePrice: number;
    totalCurrentPrice: number;
    totalCurrentReturn: number;
}

export const GetTokenTransfers = (wallet_owner: string) => {
    const [response, setResponse] = useState<TokenTransfersSummary>()
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
            axios.post(apiURL + "/api/get_token_transfers", { "wallet_owner": wallet_owner })
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