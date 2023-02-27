import { useState, useEffect } from "react"
import axios from "axios"
import apiURLJSON from "./api-info.json"
import { useNetwork } from "wagmi"

export const GetDETFIndexData = () => {
    const [response, setResponse] = useState<Array<any>>()
    const network = useNetwork()
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    let isLoading: boolean
    let isSuccess: boolean
    const [apiURL, setapiURL] = useState(apiURLJSON["apiURL"])

    useEffect(() => {
        if (window.location.href.includes("http://localhost/")) {
            setapiURL(apiURLJSON["apiURLTest"])
        }
    }, [])

    useEffect(() => {
        axios.post(apiURL + "/api/get_detf_index_data", { "chain_id": chainId })
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