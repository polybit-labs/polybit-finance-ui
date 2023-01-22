import { CurrencyContext, FormatCurrency } from './utils/Currency'
import "./DETFAssetsTable.css"
import { useContext, useEffect, useState } from "react"
import FallbackLogo from "../assets/images/placeholder.png"

interface DETFAssetsTableProps {
    tokens: Array<any>
}

export const DETFAssetsTable = (props: DETFAssetsTableProps) => {
    const targetAssets: Array<any> = []
    const [liquidityCurrency, setLiquidityCurrency] = useState("BNB")
    const currency = useContext(CurrencyContext).currency
    useEffect(() => {
        setLiquidityCurrency(currency)
    }, [currency])

    props.tokens?.map(token => {
        targetAssets.push({
            "tokenLogo": token.image,
            "tokenName": token.name,
            "tokenLiquidityAUD": token.token_liquidity.liquidity_aud,
            "tokenLiquidityBNB": token.token_liquidity.liquidity_bnb,
            "tokenLiquidityCNY": token.token_liquidity.liquidity_cny,
            "tokenLiquidityEUR": token.token_liquidity.liquidity_eur,
            "tokenLiquidityIDR": token.token_liquidity.liquidity_idr,
            "tokenLiquidityJPY": token.token_liquidity.liquidity_jpy,
            "tokenLiquidityKRW": token.token_liquidity.liquidity_krw,
            "tokenLiquidityRUB": token.token_liquidity.liquidity_rub,
            "tokenLiquidityTWD": token.token_liquidity.liquidity_twd,
            "tokenLiquidityUSD": token.token_liquidity.liquidity_usd,
            "tokenWeight": token.dimension.weight,
        })
    })

    console.log(props.tokens)

    if (targetAssets) {
        const sorted = [...targetAssets].sort((a, b) =>
            a.tokenWeight < b.tokenWeight ? 1 : -1)

        return (
            <div className="detf-assets-wrapper">
                <table className="detf-assets-table">
                    <thead>
                        <tr className="detf-assets-header-row">
                            <th className="detf-assets-header-item">Rank</th>
                            <th className="detf-assets-header-item">Token</th>
                            <th className="detf-assets-header-item">Liquidity</th>
                            <th className="detf-assets-header-item">Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((token, index) => {
                            return (
                                <tr key={index} className="detf-assets-body-row">
                                    <td className="detf-assets-body-item">{index + 1}</td>
                                    <td className="detf-assets-body-item">
                                        <div className="detf-assets-token-logo">
                                            <img className="detf-token-logo" src={token.tokenLogo ? token.tokenLogo : FallbackLogo} alt={token.tokenName}></img>
                                            <b>{token.tokenName}</b>
                                        </div>
                                    </td>
                                    <td className="detf-assets-body-item">
                                        {FormatCurrency((() => {
                                            switch (liquidityCurrency) {
                                                case "AUD": return (token.tokenLiquidityAUD)
                                                case "BNB": return (token.tokenLiquidityBNB)
                                                case "CNY": return (token.tokenLiquidityCNY)
                                                case "EURO": return (token.tokenLiquidityEUR)
                                                case "IDR": return (token.tokenLiquidityIDR)
                                                case "JPY": return (token.tokenLiquidityJPY)
                                                case "KRW": return (token.tokenLiquidityKRW)
                                                case "RUB": return (token.tokenLiquidityRUB)
                                                case "TWD": return (token.tokenLiquidityTWD)
                                                case "USD": return (token.tokenLiquidityUSD)
                                            }
                                        })(), 0)}
                                    </td>
                                    <td className="detf-assets-body-item">{`${parseFloat((token.tokenWeight * 100).toString()).toFixed(2)}%`}</td>
                                </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
    return <div></div>
}