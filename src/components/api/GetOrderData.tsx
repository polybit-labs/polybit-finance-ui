import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"

export const GetOrderData = (detfAddress: string, weth_input_amount: string) => {
    const [response, setResponse] = useState<Array<any>>()
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/rebalancer', {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "rpc_provider": rpc, "detf_address": detfAddress, "weth_input_amount": weth_input_amount })
        }).then(res => res.json()).then(data => {
            setResponse(data);
            console.log(data)
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