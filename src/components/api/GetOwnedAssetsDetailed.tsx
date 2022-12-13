import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"

export const GetOwnedAssetsDetailed = (detfAddress: string) => {
    const [response, setResponse] = useState<Array<any>>()
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/get_owned_assets_detailed', {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "rpc_provider": rpc, "detf_address": detfAddress })
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