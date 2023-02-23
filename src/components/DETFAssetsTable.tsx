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
    const dimension = props.tokens[0].dimension
    console.log(dimension)

    props.tokens?.map(token => {
        targetAssets.push({
            "tokenLogo": token.image,
            "tokenName": token.name,
            "dimensionValueAUD": token.dimension_value.aud,
            "dimensionValueBNB": token.dimension_value.bnb,
            "dimensionValueCNY": token.dimension_value.cny,
            "dimensionValueEUR": token.dimension_value.eur,
            "dimensionValueIDR": token.dimension_value.idr,
            "dimensionValueJPY": token.dimension_value.jpy,
            "dimensionValueKRW": token.dimension_value.krw,
            "dimensionValueRUB": token.dimension_value.rub,
            "dimensionValueTWD": token.dimension_value.twd,
            "dimensionValueUSD": token.dimension_value.usd,
            "tokenWeight": token.dimension_weighting,
        })
    })

    console.log(props.tokens)

    if (targetAssets) {
        const sorted = [...targetAssets].sort((a, b) =>
            a.dimensionValueBNB < b.dimensionValueBNB ? 1 : -1)

        return (
            <>
                <table className="detf-assets-table">
                    <thead>
                        <tr className="detf-assets-header-row">
                            <th className="detf-assets-header-item-token">Token</th>
                            <th className="detf-assets-header-item-liquidity">{dimension === "market-cap" ? "Market Cap" : "Liquidity"}</th>
                            <th className="detf-assets-header-item-weight">Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((token, index) => {
                            return (
                                <tr key={index} className="detf-assets-body-row">
                                    <td className="detf-assets-body-item-token">
                                        <div className="detf-assets-token-logo">
                                            <img className="detf-token-logo" src={token.tokenLogo ? token.tokenLogo : FallbackLogo} alt={token.tokenName}></img>
                                            <b>{token.tokenName}</b>
                                        </div>
                                    </td>
                                    <td className="detf-assets-body-item-liquidity">
                                        {FormatCurrency((() => {
                                            switch (liquidityCurrency) {
                                                case "AUD": return (token.dimensionValueAUD)
                                                case "BNB": return (token.dimensionValueBNB)
                                                case "CNY": return (token.dimensionValueCNY)
                                                case "EURO": return (token.dimensionValueEUR)
                                                case "IDR": return (token.dimensionValueIDR)
                                                case "JPY": return (token.dimensionValueJPY)
                                                case "KRW": return (token.dimensionValueKRW)
                                                case "RUB": return (token.dimensionValueRUB)
                                                case "TWD": return (token.dimensionValueTWD)
                                                case "USD": return (token.dimensionValueUSD)
                                            }
                                        })(), 0)}
                                    </td>
                                    <td className="detf-assets-body-item-weight">{`${parseFloat((token.tokenWeight * 100).toString()).toFixed(2)}%`}</td>
                                </tr>)
                        })}
                    </tbody>
                </table>
                <table className="detf-assets-table-mobile">
                    <thead>
                        <tr className="detf-assets-header-row-mobile">
                            <th className="detf-assets-header-item-token-mobile">Token</th>
                            {/*<th className="detf-assets-header-item-liquidity-mobile">Liquidity</th>*/}
                            <th className="detf-assets-header-item-weight-mobile">Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((token, index) => {
                            return (
                                <tr key={index} className="detf-assets-body-row-mobile">
                                    <td className="detf-assets-body-item-token-mobile">
                                        <div className="detf-assets-token-logo-mobile">
                                            <img className="detf-token-logo-mobile" src={token.tokenLogo ? token.tokenLogo : FallbackLogo} alt={token.tokenName}></img>
                                            <b>{token.tokenName}</b>
                                        </div>
                                    </td>
                                    {/*<td className="detf-assets-body-item-liquidity-mobile">
                                        {FormatCurrency((() => {
                                            switch (liquidityCurrency) {
                                                case "AUD": return (token.dimensionValueAUD)
                                                case "BNB": return (token.dimensionValueBNB)
                                                case "CNY": return (token.dimensionValueCNY)
                                                case "EURO": return (token.dimensionValueEUR)
                                                case "IDR": return (token.dimensionValueIDR)
                                                case "JPY": return (token.dimensionValueJPY)
                                                case "KRW": return (token.dimensionValueKRW)
                                                case "RUB": return (token.dimensionValueRUB)
                                                case "TWD": return (token.dimensionValueTWD)
                                                case "USD": return (token.dimensionValueUSD)
                                            }
                                        })(), 0)}
                                    </td> */}
                                    <td className="detf-assets-body-item-weight-mobile">{`${parseFloat((token.tokenWeight * 100).toString()).toFixed(2)}%`}</td>
                                </tr>)
                        })}
                    </tbody>
                </table>
            </>
        )
    }
    return (
        <div className="table-loading">
            <img height="100px" width="100px" src={require("../assets/images/polybit-loader-black-on-dark-grey-100px.gif")} alt="Loading"></img>
        </div>
    )
}