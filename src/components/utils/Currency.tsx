import { createContext, useContext } from "react"

export type Currencies = {
    "date": string;
    "aud": number;
    "bnb": number;
    "cny": number;
    "eur": number;
    "idr": number;
    "jpy": number;
    "krw": number;
    "rub": number;
    "twd": number;
    "usd": number;
}

const initialCurrency = {
    currency: "AUD"
}

export type CurrencyState = typeof initialCurrency

const CurrencyContext = createContext<typeof initialCurrency>(initialCurrency)

export { CurrencyContext }

export const CurrencyFormats = () => {
    return ["AUD", "BNB", "CNY", "EURO", "IDR", "JPY", "KRW", "RUB", "TWD", "USD"]
}

export const FormatCurrency = (amount: number, decimals: number) => {
    const currency = useContext(CurrencyContext).currency

    if (currency === "USD") {
        return `$${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "AUD") {
        return `$${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "BNB") {
        return `${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "EURO") {
        return `€${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "IDR") {
        return `Rp${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "KRW") {
        return `₩${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "CNY") {
        return `¥${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "TWD") {
        return `$${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "JPY") {
        return `¥${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "RUB") {
        return `₽${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }
}