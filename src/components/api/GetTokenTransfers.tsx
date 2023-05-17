import { useState, useEffect, useContext } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { CurrencyContext } from "../utils/Currency"

export type TokenTransfersData = {
    "address": string,
    "name": string,
    "symbol": string,
    "logoURI": string,
    "decimals": number,
    "latest_price": number,
    "current_assets": number,
    "current_value": number,
    "purchase_value": number,
    "current_return": number,
}

export type TokenTransfersSummary = {
    tokens: Array<TokenTransfersData>;
    total_purchase_value: number;
    total_current_value: number;
    total_current_return: number;
}

export const GetTokenTransfers = (wallet_owner: string) => {
    const [response, setResponse] = useState<TokenTransfersSummary>()
    const currency = useContext(CurrencyContext).currency
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
            axios.post(apiURL + "/api/get_token_transfers", { "wallet_owner": wallet_owner, "currency": currency })
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