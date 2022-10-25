import { GetTokenName } from './utils/ERC20Utils'
import { GetTokenLiquidity } from './utils/Liquidity'
import { FormatCurrency } from './utils/Currency'

export const DETFAssetsTable = () => {
    const data = [
        "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
        "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
        "0xfb6115445bff7b52feb98650c87f44907e58f802", //zero
        "0x949D48EcA67b17269629c7194F4b727d4Ef9E5d6",
        "0xbA552586eA573Eaa3436f04027ff4effd0c0abbb",
        "0x477bC8d23c634C154061869478bce96BE6045D12",
    ]
    const currency = "BNB"
    const targetAssets: Array<any> = []
    data.map(token => {
        targetAssets.push({
            "tokenLogo": "",
            "tokenName": GetTokenName(token),
            "tokenLiquidity": GetTokenLiquidity("binance-smart-chain", token, currency),
            "tokenWeight": `${parseFloat(((1 / data.length) * 100).toString()).toFixed(2)}%`,
        })
    })

    if (targetAssets) {
        const sorted = [...targetAssets].sort((a, b) =>
            a.tokenLiquidity < b.tokenLiquidity ? 1 : -1)

        console.log(sorted)

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
                                            {/* <img className="detf-chain-logo-small" src={require("../../assets/images/binance-icon-circle.png")} alt="BNB Smart Chain"></img> */}
                                            <b>{token.tokenName}</b>
                                        </div>
                                    </td>
                                    <td className="detf-assets-body-item">{FormatCurrency(token.tokenLiquidity.toString(), currency, 0)}</td>
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