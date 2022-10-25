import { GetTokenName } from './utils/ERC20Utils'
import { GetTokenLiquidity } from './utils/Liquidity'
import { CurrencyContext, FormatCurrency } from './utils/Currency'
import "./DETFAssetsTable.css"

interface DETFAssetsTableProps {
    tokens: Array<any>
}

export const DETFAssetsTable = (props: DETFAssetsTableProps) => {
    const targetAssets: Array<any> = []

    props.tokens?.map(token => {
        targetAssets.push({
            "tokenLogo": "",
            "tokenName": GetTokenName(token.address),
            "tokenLiquidity": GetTokenLiquidity("binance-smart-chain", token.address, 56),
            "tokenWeight": `${parseFloat(((1 / props.tokens.length) * 100).toString()).toFixed(2)}%`,
        })
    })

    if (targetAssets) {
        const sorted = [...targetAssets].sort((a, b) =>
            a.tokenLiquidity < b.tokenLiquidity ? 1 : -1)

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
                                            <img className="detf-token-logo" src={require("../assets/images/mobox.png")} alt="Mobox"></img>
                                            <b>{token.tokenName}</b>
                                        </div>
                                    </td>
                                    <td className="detf-assets-body-item">{FormatCurrency(token.tokenLiquidity.toString(), 0)}</td>
                                    <td className="detf-assets-body-item">{token.tokenWeight}</td>
                                </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
    return <div></div>
}