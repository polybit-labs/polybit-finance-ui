import { createContext } from "react";

const initialCurrency = {
    currency: "AUD"
}

export type CurrencyState = typeof initialCurrency

const currencyContext = createContext<typeof initialCurrency>(initialCurrency)

export default currencyContext