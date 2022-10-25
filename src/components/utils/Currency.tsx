import { createContext, useContext } from "react";

const initialCurrency = {
    currency: "AUD"
}

export type CurrencyState = typeof initialCurrency

const CurrencyContext = createContext<typeof initialCurrency>(initialCurrency)

export { CurrencyContext }

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
}