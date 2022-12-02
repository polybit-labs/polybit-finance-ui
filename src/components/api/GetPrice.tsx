import { useState, useEffect } from "react"

export const GetPrice = (token_address: string) => {
    const [response, setResponse] = useState<string>()
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/get_price', {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "token_address": token_address })
        }).then(res => res.json()).then(data => {
            setResponse(data.token_price);
            console.log(data.token_price)
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