import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Products from "../../product/detfIndex.json"
import { ReturnChart } from '../ReturnChart'
import "./DETF.css"
import { GetTargetList, GetTargetPercentage } from '../utils/DETFOracleUtils'
import { GetTokenName } from '../utils/ERC20Utils'
import { getNumValueColor } from '../../utils'
import { DETFAssetsTable } from '../DETFAssetsTable'

const DETF = () => {
    const urlId = useParams().urlId
    let productFile
    try {
        productFile = require(`../../product/detfs/${urlId}.json`)
    } catch {
        console.log("File not found.")
    }

    const title = "Invest in Decentralized ETFs"

    const detfOracleAddress = "0xb86B47e40Ec31Ca4Dc31295B649bf585073e5DcD"
    const detfName = productFile[0].detfName
    const chainName = productFile[0].chainName
    const returnOneWeek: number = productFile[0].returns.returnOneWeek
    const returnOneMonth: number = productFile[0].returns.returnOneMonth
    const returnOneYear: number = productFile[0].returns.returnOneYear
    const tokens: Array<any> = [] = productFile[0].tokens

    return (
        <>
            <div className="detf-container">
                <div className="detf-title-section">
                    <h1>{title}</h1>
                    <Link to="/establish-detf" state={{ detfName: detfName, detfOracleAddress: detfOracleAddress, processOrigin: "establish", activeStage: 1 }}>
                        <button className={"invest-button"}>Invest in this DETF</button>
                    </Link>

                </div>
                <div className="detf-wrapper">
                    <div className="detf-lhs">
                        <div className="detf-name-wrapper">
                            <img className="detf-chain-logo" src={require("../../assets/images/bsc-logo.png")} alt="BNB Smart Chain"></img>
                            <div className="detf-text">
                                <h1>{detfName}</h1>
                                <h2>{chainName}</h2>
                            </div>
                        </div>
                        <div className="native-token-message-box">
                            <p>“BNB” is the currency utilised for investment in the Binance Governance Top 20 DETF on the Binance Smart Chain. This can be purchased via Coinbase Wallet, and other exchanges.</p>
                        </div>
                        <div className="detf-description">
                            <h2>With a single transaction, get diversified exposure to the top 20 Governance assets on the Binance (BNB) chain.</h2>
                            <p>Polybit’s PGT20 aims to track the performance of an index (before fees and expenses) comprising 20 of the largest governance assets by liquidity on the Binance chain. The smart contract you generate at the time of investment will automatically facilitate ongoing trades to maintain pooled asset positions, as asset positions shift, leave, or enter the pool over time.</p>
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
                                </div>
                                <div className="detf-summary-info-text">
                                    <div className="detf-summary-info-titles">
                                        <ul>
                                            <li>Total Liquidity</li>
                                            <li>Type</li>
                                            <li>Assets</li>
                                            <li>Risk Weighting</li>
                                            <li>Rebalancing</li>
                                            <li>Next Rebalance</li>
                                            <li>Deposit Fee</li>
                                        </ul>
                                    </div>
                                    <div className="detf-summary-info-results">
                                        <ul>
                                            <li>$100,000,000</li>
                                            <li>Ecosystem Rank</li>
                                            <li>5</li>
                                            <li>Equally Balanced</li>
                                            <li>Every 90 Days</li>
                                            <li>31 October 2023</li>
                                            <li>0.05%</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="invest-button-bottom-wrapper">
                            <Link to="/establish-detf" state={{ detfName: detfName, detfOracleAddress: detfOracleAddress, processOrigin: "establish", activeStage: 1 }}>
                                <button className={"invest-button"}>Invest in this DETF</button>
                            </Link>
                        </div>
                    </div>
                    <div className="detf-rhs">
                        <div className="detf-assets-box">
                            <h2>Assets in DETF</h2>
                            <p>Holdings as of 11 August 2022. These holdings will rebalance through automated buys and sells over time to maintain a reflection of the top assets in this fund. Holding weighting is determined according to oracle data including, but not limited to, market capitalisation and daily trading volume. Assets that do not meet our risk criteria for certification or minimum liquidity thresholds may be excluded from pool inclusion. Learn more about our pool policies.</p>
                            <DETFAssetsTable />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default DETF