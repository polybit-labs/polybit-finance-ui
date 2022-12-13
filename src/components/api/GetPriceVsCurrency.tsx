import { useState, useEffect } from "react"

export const GetPriceVsCurrency = (token_address: string) => {
    const [response, setResponse] = useState<any>()
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/get_price_vs_currency', {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "token_address": token_address })
        }).then(res => res.json()).then(data => {
            const prices = {
                "aud": data.aud,
                "bnb": data.bnb,
                "cny": data.cny,
                "eur": data.eur,
                "idr": data.idr,
                "jpy": data.jpy,
                "krw": data.krw,
                "rub": data.rub,
                "twd": data.twd,
                "usd": data.usd
            }
            setResponse(prices);
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