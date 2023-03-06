import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import axios from "axios"
import apiURLJSON from "./api-info.json"

interface Tokens {
    id: string;
    symbol: string;
    name: string;
    image: string;
    address: string;
    category: string;
    market_cap: Array<string>;
    dimension: Array<Array<string>>;
    token_liquidity: Array<string>;
}

interface Liquidity {
    liquidity_aud: string;
    liquidity_bnb: string;
    liquidity_cny: string;
    liquidity_eur: string;
    liquidity_idr: string;
    liquidity_jpy: string;
    liquidity_krw: string;
    liquidity_rub: string;
    liquidity_twd: string;
    liquidity_usd: string;
}

export interface ProductData {
    tokens: Array<Tokens>;
    total_liquidity: Liquidity;
}

export const GetProductData = (url: string) => {
    const [response, setResponse] = useState<ProductData>()
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
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
            axios.post(apiURL + "/api/get_product_data", { "url": url })
                .then(res => {
                    setResponse(res.data);
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