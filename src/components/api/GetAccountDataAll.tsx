import { useState, useEffect, useContext } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { CurrencyContext } from "../utils/Currency"
import { BigNumber } from "ethers"

export type AccountData = {
    "theme_contract_address": string,
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
    "final_balance_in_weth": BigNumber;
    "final_assets": Array<string>;
    "final_assets_prices": Array<BigNumber>;
    "final_assets_balances": Array<BigNumber>;
    "final_assets_balances_in_weth": Array<BigNumber>;
    "final_assets_table_data": Array<any>;
    "total_purchase_value_currency_adjusted": number;
    "total_current_value_currency_adjusted": number;
    "total_current_return_currency_adjusted": number;
    "total_final_value_currency_adjusted": number;
    "total_final_return_currency_adjusted": number;
}
export type AccountDataAll = {
    account_data: Array<AccountData>;
    total_purchase_value: number;
    total_current_value: number;
    total_current_return: number;
}

export const GetAccountDataAll = (wallet_owner: string) => {
    const [response, setResponse] = useState<AccountDataAll>()
    const network = useNetwork()
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const rpc = network.chain?.rpcUrls.default.http[0]
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
            axios.post(apiURL + "/api/get_theme_account_data_all", { "rpc_provider": rpc, "chain_id": chainId, "wallet_owner": wallet_owner, "currency": currency })
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