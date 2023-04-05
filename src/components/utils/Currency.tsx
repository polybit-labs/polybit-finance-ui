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
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
    }

    if (currency === "AUD") {
        return `A${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', notation: 'compact', minimumFractionDigits: decimals }).format(amount)}`
    }

    if (currency === "BNB") {
        const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
        return formatted.replace("$", "BNB ")
    }

    if (currency === "EURO") {
        return new Intl.NumberFormat('en-150', { style: 'currency', currency: 'EUR', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
    }

    if (currency === "IDR") {
        return new Intl.NumberFormat('in-ID', { style: 'currency', currency: 'IDR', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
    }

    if (currency === "KRW") {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
    }

    if (currency === "CNY") {
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
    }

    if (currency === "TWD") {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
    }

    if (currency === "JPY") {
        return new Intl.NumberFormat('ja', { style: 'currency', currency: 'JPY', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
    }

    if (currency === "RUB") {
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', notation: 'compact', minimumFractionDigits: decimals }).format(amount)
    }

    return ""
}