import { useState, useEffect } from "react"

export const GetPrices = (token_addresses: Array<string>) => {
    const [response, setResponse] = useState<string>()
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/get_prices', {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(token_addresses)
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