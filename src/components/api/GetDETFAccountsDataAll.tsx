import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { BigNumber } from "ethers"

export type DETFAccountData = {
    "detf_address": string;
    "status": number;
    "creation_timestamp": number;
    "category": string;
    "dimension": string;
    "balance_in_weth": BigInt;
    "deposits": Array<Array<BigNumber>>;
    "total_deposited": BigNumber;
    "fees_paid": Array<Array<BigNumber>>;
    "transactions": Array<any>;
    "owned_assets": Array<string>;
    "owned_assets_prices": Array<BigNumber>;
    "owned_assets_table_data": Array<any>;
    "time_lock": number;
    "time_lock_remaining": number;
    "close_timestamp": number;
    "return_weth": BigNumber;
    "return_percentage": number;
    "final_return_weth": BigNumber;
    "final_return_percentage": number;
    "final_return": any;
    "final_balance_in_weth": BigNumber;
    "final_assets": Array<string>;
    "final_assets_prices": Array<BigNumber>;
    "final_assets_balances": Array<BigNumber>;
    "final_assets_balances_in_weth": Array<BigNumber>;
    "final_assets_table_data": Array<any>;
}

export const GetDETFAccountsDataAll = (wallet_owner: string) => {
    const [response, setResponse] = useState<Array<DETFAccountData>>()
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
            axios.post(apiURL + "/api/get_detf_accounts_data_all", { "rpc_provider": rpc, "chain_id": chainId, "wallet_owner": wallet_owner })
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