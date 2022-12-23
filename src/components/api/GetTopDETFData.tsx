import { useState, useEffect } from "react"
import axios from "axios"
import apiURL from "./api-info.json"

export const GetTopDETFData = () => {
    const [response, setResponse] = useState<Array<any>>()
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        axios.get(apiURL["apiURL"] + "/api/get_top_detf_data")
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