import { useParams, Link } from 'react-router-dom'
import { ReturnChart } from '../ReturnChart'
import "./DETF.css"
import { getNumValueColor } from '../../utils'
import { DETFAssetsTable } from '../DETFAssetsTable'
import { FormatCurrency } from '../utils/Currency'
import { GetTotalLiquidity } from '../utils/Liquidity'
import Footer from './Footer'
import { GetDepositFee } from '../utils/DETFFactoryUtils'
import { ErrorPage } from '../Error'

const DETF = () => {
    const urlId = useParams().urlId
    let productFile
    try {
        productFile = require(`../../product/detfs/${urlId}.json`)
    } catch {
        console.log("File not found.")
    }

    if (productFile) {
        const chainId: number = productFile[0].chainId
        const detfOracleAddress: string = productFile[0].detfOracleAddress
        const detfName: string = productFile[0].detfName
        const chainName: string = productFile[0].chainName
        const descriptionTitle: string = productFile[0].descriptionTitle
        const description: string = productFile[0].description
        const type: string = productFile[0].type
        const tokens: Array<any> = [] = productFile[0].tokens
        const returnOneWeek: number = productFile[0].returns.returnOneWeek
        const returnOneMonth: number = productFile[0].returns.returnOneMonth
        const returnOneYear: number = productFile[0].returns.returnOneYear
        const returnTwoYear: number = productFile[0].returns.returnTwoYear
        const tokenCount: number = tokens.length
        const totalLiquidity: number = GetTotalLiquidity({ tokens }, chainId)
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
                                                <li>{FormatCurrency(totalLiquidity, 0)}</li>
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