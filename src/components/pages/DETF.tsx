import { useParams, Link } from 'react-router-dom'
import { ReturnChart } from '../ReturnChart'
import "./DETF.css"
import { getNumValueColor } from '../../utils'
import { DETFAssetsTable } from '../DETFAssetsTable'
import { FormatCurrency, CurrencyContext } from '../utils/Currency'
import { GetTotalLiquidity } from '../utils/Liquidity'
import Footer from './Footer'
import { GetDepositFee } from '../utils/DETFFactoryUtils'
import { ErrorPage } from '../Error'
import { useEffect, useContext, useState } from 'react'

const DETF = () => {
    const urlId = useParams().urlId
    let productContent
    let productData
    try {
        productContent = require(`../../product/detfs/${urlId}.json`)
        productData = require(`../../product/detfs/${urlId}-data.json`)
    } catch {
        console.log("Product file not found.")
    }
    const [liquidityCurrency, setLiquidityCurrency] = useState("BNB")
    const currency = useContext(CurrencyContext).currency
    useEffect(() => {
        setLiquidityCurrency(currency)
    }, [currency])

    if (productContent && productData) {
        const chainId: number = productContent[0].chainId
        const detfOracleAddress: string = productContent[0].detfOracleAddress
        const detfName: string = productContent[0].detfName
        const chainName: string = productContent[0].chainName
        const descriptionTitle: string = productContent[0].descriptionTitle
        const description: string = productContent[0].description
        const type: string = productContent[0].type
        const returnOneWeek: number = productContent[0].returns.returnOneWeek
        const returnOneMonth: number = productContent[0].returns.returnOneMonth
        const returnOneYear: number = productContent[0].returns.returnOneYear
        const returnTwoYear: number = productContent[0].returns.returnTwoYear
        const tokens: Array<any> = [] = productData.tokens
        const tokenCount: number = tokens.length
        const depositFee = GetDepositFee(56)

        return (
            <>
                <div className="detf-container">
                    <div className="detf-title-section">
                        <div className="detf-name-wrapper">
                            <div className="detf-text">
                                <h1>{detfName}</h1>
                                <div className="detf-chain-title"><img className="detf-chain-logo" src={require("../../assets/images/bsc-logo.png")} alt="BNB Smart Chain"></img><h2>{chainName}</h2></div>
                            </div>
                        </div>
                        <Link to="/establish-detf" state={{ detfName: detfName, detfOracleAddress: detfOracleAddress, processOrigin: "establish", activeStage: 1 }}>
                            <button className={"invest-button"}>Invest in this DETF</button>
                        </Link>
                    </div>
                    <div className="detf-wrapper">
                        <div className="detf-lhs">
                            <div className="detf-description">
                                <h2>{descriptionTitle}</h2>
                                <p>{description}</p>
                            </div>
                            <div className="detf-chart">
                                <p>Value of USD$100 invested since inception</p>
                                <ReturnChart height={300} width="100%" />
                            </div>
                            <div className="detf-summary">
                                <div className="detf-summary-line"></div>
                                <div className="detf-summary-info">
                                    <div className="detf-summary-info-returns">
                                        <div className="detf-summary-info-return">
                                            <div className="detf-summary-info-return-title">1 Week</div>
                                            <div className="detf-summary-info-return-result" style={{ color: getNumValueColor(Number(returnOneWeek)) }}>{returnOneWeek + "%"}</div>
                                        </div>
                                        <div className="detf-summary-info-return">
                                            <div className="detf-summary-info-return-title">1 Month</div>
                                            <div className="detf-summary-info-return-result" style={{ color: getNumValueColor(Number(returnOneMonth)) }}>{returnOneMonth + "%"}</div>
                                        </div>
                                        <div className="detf-summary-info-return">
                                            <div className="detf-summary-info-return-title">1 Year</div>
                                            <div className="detf-summary-info-return-result" style={{ color: getNumValueColor(Number(returnOneYear)) }}>{returnOneYear + "%"}</div>
                                        </div>
                                        <div className="detf-summary-info-return">
                                            <div className="detf-summary-info-return-title">2 Years</div>
                                            <div className="detf-summary-info-return-result" style={{ color: getNumValueColor(Number(returnTwoYear)) }}>{returnTwoYear + "%"}</div>
                                        </div>
                                    </div>
                                    <div className="detf-summary-info-text">
                                        <div className="detf-summary-info-titles">
                                            <ul>
                                                <li>Total Liquidity</li>
                                                <li>Type</li>
                                                <li>Assets</li>
                                                <li>Risk Weighting</li>
                                                <li>Rebalancing</li>
                                                <li>Deposit Fee</li>
                                            </ul>
                                        </div>
                                        <div className="detf-summary-info-results">
                                            <ul>
                                                <li>
                                                    {FormatCurrency((() => {
                                                        switch (liquidityCurrency) {
                                                            case "AUD": return (productData.total_liquidity.liquidity_aud)
                                                            case "BNB": return (productData.total_liquidity.liquidity_bnb)
                                                            case "CNY": return (productData.total_liquidity.liquidity_cny)
                                                            case "EURO": return (productData.total_liquidity.liquidity_euro)
                                                            case "IDR": return (productData.total_liquidity.liquidity_idr)
                                                            case "JPY": return (productData.total_liquidity.liquidity_jpy)
                                                            case "KRW": return (productData.total_liquidity.liquidity_krw)
                                                            case "RUB": return (productData.total_liquidity.liquidity_rub)
                                                            case "TWD": return (productData.total_liquidity.liquidity_twd)
                                                            case "USD": return (productData.total_liquidity.liquidity_usd)
                                                        }
                                                    })(), 0)}

                                                </li>
                                                <li>{type}</li>
                                                <li>{tokenCount}</li>
                                                <li>Equally Balanced</li>
                                                <li>Every 90 Days</li>
                                                <li>{parseFloat((depositFee).toString()).toFixed(2)}%</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="detf-rhs">
                            <div className="detf-assets-box">
                                <h2>Assets in DETF</h2>
                                <p>Holdings as of 11 August 2022. These holdings will rebalance through automated buys and sells over time to maintain a reflection of the top assets in this fund. Holding weighting is determined according to oracle data including, but not limited to, market capitalisation and daily trading volume. Assets that do not meet our risk criteria for certification or minimum liquidity thresholds may be excluded from pool inclusion. Learn more about our pool policies.</p>
                                <DETFAssetsTable tokens={tokens} />
                            </div>
                            <div className="native-token-message-box">
                                <p>“BNB” is the currency utilised for investment in the Binance Governance Top 20 DETF on the Binance Smart Chain. This can be purchased via Coinbase Wallet, and other exchanges.</p>
                            </div>
                            <div className="invest-button-bottom-wrapper">
                                <Link to="/establish-detf" state={{ detfName: detfName, detfOracleAddress: detfOracleAddress, processOrigin: "establish", activeStage: 1 }}>
                                    <button className={"invest-button"}>Invest in this DETF</button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <ErrorPage errorText={"Product data not found."} />
            <Footer />
        </>
    )
}

export default DETF