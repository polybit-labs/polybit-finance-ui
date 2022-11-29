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
import { GetProductData } from '../utils/GetProductDataFromS3'

const DETF = () => {
    const urlChainId = useParams().urlChainId
    const urlCategoryId = useParams().urlCategoryId
    const urlDimensionId = useParams().urlDimensionId
    console.log(urlDimensionId)
    let productContent
    let productData
    let performanceData

    if (urlChainId && urlCategoryId && urlDimensionId) {
        try {
            productContent = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/content.json`)
            console.log("local", productContent)
            //productContent = GetProductData(urlCategoryId?.toString(), urlDimensionId, "content.json")
            console.log("s3", GetProductData(urlCategoryId, urlDimensionId, "content.json"))
        } catch {
            console.log("Product content not found.")
        }
        try {
            productData = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/product-data.json`)
            console.log(productData)
        } catch {
            console.log("Product data not found.")
        }
        try {
            performanceData = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/performance-data.json`)
        } catch {
            console.log("Performance data not found." + `../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/performance-data.json`)
        }
    }
    const [liquidityCurrency, setLiquidityCurrency] = useState("BNB")
    const currency = useContext(CurrencyContext).currency
    useEffect(() => {
        setLiquidityCurrency(currency)
    }, [currency])

    if (productContent && productData && performanceData) {
        const chainId: number = productContent.chainId
        const chainName: string = productContent.chainName
        const productId: number = productContent.productId
        const category: string = productContent.category
        const dimension: string = productContent.dimension
        const detfOracleAddress: string = ""
        const detfName: string = productContent.detfName
        const descriptionTitle: string = productContent.descriptionTitle
        const description: string = productContent.description
        const assetTableDescription: string = productContent.assetTableDescription
        const rebalancingPeriod: string = productContent.rebalancingPeriod
        const returnOneWeek: number = performanceData.at(-1).performance_7d
        const returnOneMonth: number = performanceData.at(-1).performance_30d
        const returnThreeMonths: number = performanceData.at(-1).performance_90d
        const returnOneYear: number = performanceData.at(-1).performance_365d
        const returnTwoYear: number = performanceData.at(-1).performance_730d
        const tokens: Array<any> = [] = productData.tokens
        const tokenCount: number = tokens.length
        const depositFee = GetDepositFee(56)

        return (
            <>
                <div className="detf-container">
                    <div className="detf-title-section">
                        <div className="detf-name-wrapper">
                            <div className="detf-text">
                                <h1>{category}</h1>
                                <h2>{dimension}</h2>
                                {/* <div className="detf-chain-title"><img className="detf-chain-logo" src={require("../../assets/images/bsc-logo.png")} alt="BNB Smart Chain"></img><h2>{chainName}</h2></div> */}
                            </div>
                        </div>
                        <Link to="/establish-detf" state={{ category: category, dimension: dimension, productId: productId.toString(), processOrigin: "establish", activeStage: 1 }}>
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
                                <p>{detfName} DETF Index Value - 3 Months</p>
                                <ReturnChart height={300} width="100%" performanceData={performanceData} />
                            </div>
                            <div className="detf-summary">
                                <div className="detf-summary-line"></div>
                                <div className="detf-summary-info">
                                    <div className="detf-summary-info-returns">
                                        <div className="detf-summary-info-return">
                                            <div className="detf-summary-info-return-title">1 Week</div>
                                            <div className="detf-summary-info-return-result" style={{ color: getNumValueColor(Number(returnOneWeek)) }}>{returnOneWeek ? parseFloat((returnOneWeek * 100).toString()).toFixed(2) + "%" : ""}</div>
                                        </div>
                                        <div className="detf-summary-info-return">
                                            <div className="detf-summary-info-return-title">1 Month</div>
                                            <div className="detf-summary-info-return-result" style={{ color: getNumValueColor(Number(returnOneMonth)) }}>{returnOneMonth ? parseFloat((returnOneMonth * 100).toString()).toFixed(2) + "%" : ""}</div>
                                        </div>
                                        <div className="detf-summary-info-return">
                                            <div className="detf-summary-info-return-title">3 Months</div>
                                            <div className="detf-summary-info-return-result" style={{ color: getNumValueColor(Number(returnThreeMonths)) }}>{returnThreeMonths ? parseFloat((returnThreeMonths * 100).toString()).toFixed(2) + "%" : ""}</div>
                                        </div>
                                        <div className="detf-summary-info-return">
                                            <div className="detf-summary-info-return-title">1 Year</div>
                                            <div className="detf-summary-info-return-result" style={{ color: getNumValueColor(Number(returnOneYear)) }}>{returnOneYear ? parseFloat((returnOneYear * 100).toString()).toFixed(2) + "%" : ""}</div>
                                        </div>
                                    </div>
                                    <div className="detf-summary-info-text">
                                        <div className="detf-summary-info-titles">
                                            <ul>
                                                <li>Total Liquidity</li>
                                                <li>Total Assets</li>
                                                <li>Rebalance Frequency</li>
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
                                                <li>{tokenCount}</li>
                                                <li>{rebalancingPeriod}</li>
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
                                <p>{assetTableDescription}</p>
                                <DETFAssetsTable tokens={tokens} />
                            </div>
                            <div className="native-token-message-box">
                                <p>“BNB” is the currency utilised for investment in the Binance Governance Top 20 DETF on the Binance Smart Chain. This can be purchased via Coinbase Wallet, and other exchanges.</p>
                            </div>
                            <div className="invest-button-bottom-wrapper">
                                <Link to="/establish-detf" state={{ category: category, dimension: dimension, productId: productId.toString(), processOrigin: "establish", activeStage: 1 }}>
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