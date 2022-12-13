import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"

export interface PerformanceData {
    date: string;
    index_price: number;
    performance_7d: number;
    performance_30d: number;
    performance_90d: number;
    performance_180d: number;
    performance_365d: number;
    performance_730d: number;
}
export const GetPerformanceData = (url: string) => {
    const [response, setResponse] = useState<Array<PerformanceData>>()
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/get_performance_data', {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "url": url })
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