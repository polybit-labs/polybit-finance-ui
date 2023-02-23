import { FormatCurrency } from './utils/Currency'
import "./DETFOwnedAssetsTable.css"
import FallbackLogo from "../assets/images/placeholder.png"

interface DETFAssetsTableProps {
    tokens: Array<any>;
    vsPrices: any;
    currency: string;
}

export const DETFOwnedAssetsTable = (props: DETFAssetsTableProps) => {
    const ownedAssets: Array<any> = []
    console.log(ownedAssets)
    props.tokens?.map(token => {
        ownedAssets.push({
            "tokenAddress": token.token_address,
            "tokenLogo": token.token_logo,
            "tokenName": token.token_name,
            "tokenBalance": FormatCurrency((Number(token.token_balance)
                / 10 ** 18 *
                (() => {
                    switch (props.currency) {
                        case "AUD": return (props.vsPrices.aud)
                        case "BNB": return (props.vsPrices.bnb)
                        case "CNY": return (props.vsPrices.cny)
                        case "EURO": return (props.vsPrices.eur)
                        case "IDR": return (props.vsPrices.idr)
                        case "JPY": return (props.vsPrices.jpy)
                        case "KRW": return (props.vsPrices.krw)
                        case "RUB": return (props.vsPrices.rub)
                        case "TWD": return (props.vsPrices.twd)
                        case "USD": return (props.vsPrices.usd)
                    }
                })()), 2),
            "tokenWeight": token.token_weight,
        })
    })

    if (ownedAssets) {
        const sorted = [...ownedAssets].sort((a, b) =>
            a.tokenWeight < b.tokenWeight ? 1 : -1)

        return (
            <>
                <table className="detf-owned-assets-table">
                    <thead>
                        <tr className="detf-owned-assets-header-row">
                            <th className="detf-owned-assets-header-item-token">Token</th>
                            <th className="detf-owned-assets-header-item-liquidity">Liquidity</th>
                            <th className="detf-owned-assets-header-item-weight">Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((token, index) => {
                            return (
                                <tr key={index} className="detf-owned-assets-body-row">
                                    <td className="detf-owned-assets-body-item-token">
                                        <div className="detf-owned-assets-token-logo">
                                            <img className="detf-token-logo" src={token.tokenLogo ? token.tokenLogo : FallbackLogo} alt={token.tokenName}></img>
                                            <b>{token.tokenName}</b>
                                        </div>
                                    </td>
                                    <td className="detf-owned-assets-body-item-liquidity">
                                        {token.tokenBalance}
                                    </td>
                                    <td className="detf-owned-assets-body-item-weight">{`${parseFloat((token.tokenWeight * 100).toString()).toFixed(2)}%`}</td>
                                </tr>)
                        })}
                    </tbody>
                </table>
                <table className="detf-owned-assets-table-mobile">
                    <thead>
                        <tr className="detf-owned-assets-header-row-mobile">
                            <th className="detf-owned-assets-header-item-token-mobile">Token</th>
                            <th className="detf-owned-assets-header-item-liquidity-mobile">Liquidity</th>
                            <th className="detf-owned-assets-header-item-weight-mobile">Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((token, index) => {
                            return (
                                <tr key={index} className="detf-owned-assets-body-row-mobile">
                                    <td className="detf-owned-assets-body-item-token-mobile">
                                        <div className="detf-owned-assets-token-logo-mobile">
                                            <img className="detf-token-logo-mobile" src={token.tokenLogo ? token.tokenLogo : FallbackLogo} alt={token.tokenName}></img>
                                            <b>{token.tokenName}</b>
                                        </div>
                                    </td>
                                    <td className="detf-owned-assets-body-item-liquidity-mobile">
                                        {token.tokenBalance}
                                    </td>
                                    <td className="detf-owned-assets-body-item-weight-mobile">{`${parseFloat((token.tokenWeight * 100).toString()).toFixed(2)}%`}</td>
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