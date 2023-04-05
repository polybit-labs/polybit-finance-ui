import { TokenIndexData } from "./api/GetTokenIndexData"

export type TokenIndexDataFormatted = {
    "address": string,
    "token_name": string,
    "token_symbol": string,
    "token_logo": string,
    "one_day_return": number,
    "one_week_return": number,
    "one_month_return": number,
    "one_year_return": number,
    "global_market_cap_rank": number,
    "sentiment_score": number,
    "current_price": string,
    "market_cap": string,
    "volume_24h": string,
    "low_24h": string,
    "high_24h": string,
    "last_updated": number,
    "detfs": Array<string>
}

export const FormatTokenIndex = (currency: string, data: TokenIndexData) => {
    const tokenData = {
        "address": data.address,
        "token_name": data.token_name,
        "token_symbol": data.token_symbol,
        "token_logo": data.token_logo,
        "one_day_return": data.one_day_return,
        "one_week_return": data.one_week_return,
        "one_month_return": data.one_month_return,
        "one_year_return": data.one_year_return,
        "global_market_cap_rank": data.global_market_cap_rank,
        "sentiment_score": data.sentiment_score,
        "current_price": Number((() => {
            switch (currency) {
                case "AUD": return (data.current_price.aud)
                case "BNB": return (data.current_price.bnb)
                case "CNY": return (data.current_price.cny)
                case "EURO": return (data.current_price.eur)
                case "IDR": return (data.current_price.idr)
                case "JPY": return (data.current_price.jpy)
                case "KRW": return (data.current_price.krw)
                case "RUB": return (data.current_price.rub)
                case "TWD": return (data.current_price.twd)
                case "USD": return (data.current_price.usd)
            }
        })()).toString(),
        "market_cap": Number((() => {
            switch (currency) {
                case "AUD": return (data.market_cap.aud)
                case "BNB": return (data.market_cap.bnb)
                case "CNY": return (data.market_cap.cny)
                case "EURO": return (data.market_cap.eur)
                case "IDR": return (data.market_cap.idr)
                case "JPY": return (data.market_cap.jpy)
                case "KRW": return (data.market_cap.krw)
                case "RUB": return (data.market_cap.rub)
                case "TWD": return (data.market_cap.twd)
                case "USD": return (data.market_cap.usd)
            }
        })()).toString(),
        "volume_24h": Number((() => {
            switch (currency) {
                case "AUD": return (data.volume_24h.aud)
                case "BNB": return (data.volume_24h.bnb)
                case "CNY": return (data.volume_24h.cny)
                case "EURO": return (data.volume_24h.eur)
                case "IDR": return (data.volume_24h.idr)
                case "JPY": return (data.volume_24h.jpy)
                case "KRW": return (data.volume_24h.krw)
                case "RUB": return (data.volume_24h.rub)
                case "TWD": return (data.volume_24h.twd)
                case "USD": return (data.volume_24h.usd)
            }
        })()).toString(),
        "low_24h": Number((() => {
            switch (currency) {
                case "AUD": return (data.low_24h.aud)
                case "BNB": return (data.low_24h.bnb)
                case "CNY": return (data.low_24h.cny)
                case "EURO": return (data.low_24h.eur)
                case "IDR": return (data.low_24h.idr)
                case "JPY": return (data.low_24h.jpy)
                case "KRW": return (data.low_24h.krw)
                case "RUB": return (data.low_24h.rub)
                case "TWD": return (data.low_24h.twd)
                case "USD": return (data.low_24h.usd)
            }
        })()).toString(),
        "high_24h": Number((() => {
            switch (currency) {
                case "AUD": return (data.high_24h.aud)
                case "BNB": return (data.high_24h.bnb)
                case "CNY": return (data.high_24h.cny)
                case "EURO": return (data.high_24h.eur)
                case "IDR": return (data.high_24h.idr)
                case "JPY": return (data.high_24h.jpy)
                case "KRW": return (data.high_24h.krw)
                case "RUB": return (data.high_24h.rub)
                case "TWD": return (data.high_24h.twd)
                case "USD": return (data.high_24h.usd)
            }
        })()).toString(),
        "last_updated": data.last_updated,
        "detfs": data.detfs
    }
    return tokenData
}

export const FormatTokenIndexArray = (currency: string, data: Array<TokenIndexData>) => {
    const formatted: Array<TokenIndexDataFormatted> = []
    data.map((token) => {
        formatted.push(FormatTokenIndex(currency, token))
    })
    return formatted
}