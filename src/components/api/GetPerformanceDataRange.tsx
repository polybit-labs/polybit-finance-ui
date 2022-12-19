import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"

export interface PerformanceDataRange {
    date: string;
    index_price: number;
    pct: number;
}

export const GetPerformanceDataRange = (url: string, start_date: number, end_date: number) => {
    const [response, setResponse] = useState<Array<PerformanceDataRange>>()
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/get_performance_data_range', {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "url": url, "start_date": start_date, "end_date": end_date })
        }).then(res => res.json()).then(data => {
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