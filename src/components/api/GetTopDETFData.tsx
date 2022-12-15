import { useState, useEffect } from "react"

export const GetTopDETFData = () => {
    const [response, setResponse] = useState<Array<any>>()
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/get_top_detf_data').then(res => res.json()).then(data => {
            setResponse(data);
        });
    }, []);

    if (response === undefined) {
        isLoading = true
        isSuccess = false
    } else {
        isLoading = false
        isSuccess = true
    }

    return { response, isLoading, isSuccess }
}