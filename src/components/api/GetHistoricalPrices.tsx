import { useState, useEffect } from "react"

export const GetHistoricalPrices = (date: string) => {
    const [response, setResponse] = useState<Array<any>>()
    let isLoading: boolean
    let isSuccess: boolean

    useEffect(() => {
        fetch('/api/get_historical_prices', {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "date": date })
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