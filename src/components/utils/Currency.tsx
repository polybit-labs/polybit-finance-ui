import { createContext, useContext } from "react";

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
        return `${currency} $${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "AUD") {
        return `${currency} $${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "BNB") {
        return `${currency} ${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "EURO") {
        return `${currency} €${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "IDR") {
        return `${currency} Rp${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "KRW") {
        return `${currency} ₩${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "CNY") {
        return `${currency} ¥${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "TWD") {
        return `${currency} $${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "JPY") {
        return `${currency} ¥${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "RUB") {
        return `${currency} ₽${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }
}