import { useParams, Link } from 'react-router-dom'
import { DETFReturnChart } from '../charts/DETFReturnChart'
import "./DETF.css"
import { DETFAssetsTable } from '../DETFAssetsTable'
import { CurrencyContext } from '../utils/Currency'
import Footer from './Footer'
import { useEffect, useContext, useState } from 'react'
import { GetProductData, ProductData } from '../api/GetProductData'
import { GetPerformanceData, PerformanceData } from '../api/GetPerformanceData'
import { Loading } from '../Loading'
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { DETFSummary } from '../DETFSummary'
import { ColourCategories, DETFIconFilename } from '../utils/Formatting'
import { useNetwork } from 'wagmi'
import { Button } from '../Button'

const DETF = () => {
    const urlChainId = useParams().urlChainId
    const urlCategoryId = useParams().urlCategoryId
    const urlDimensionId = useParams().urlDimensionId
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const productUrl = `${chainId === "97" ? "97" : "bnb-smart-chain"}/${urlCategoryId}/${urlDimensionId}`
    const performanceUrl = `${urlChainId}/${urlCategoryId}/${urlDimensionId}`
    const productContent = require(`../../product/detfs/${urlChainId}/${urlCategoryId}/${urlDimensionId}/content.json`)

    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const [vsPrices, setVsPrices] = useState<any>({})

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    const [productData, setProductData] = useState<ProductData | undefined>()
    const [performanceData, setPerformanceData] = useState<Array<PerformanceData> | undefined>()

    const { response: product, isLoading: productDataLoading, isSuccess: productDataSuccess } = GetProductData((productUrl))
    const { response: performance, isLoading: performanceDataLoading, isSuccess: performanceDataSuccess } = GetPerformanceData((performanceUrl))

    useEffect(() => {
        setProductData(product ? product : undefined)
        setPerformanceData(performance ? performance : undefined)
    }, [productDataLoading, productDataSuccess, performanceDataLoading, performanceDataSuccess])

    const chainName: string = productContent.chainName
    const productId: number = productContent.productId
    const category: string = productContent.category
    const dimension: string = productContent.dimension
    const descriptionTitle: string = productContent.descriptionTitle
    const description: string = productContent.description
    const assetTableDescription: string = productContent.assetTableDescription
    const tokens: Array<any> = [] = productData ? productData.tokens : []

    if (productContent && productData && performanceData) {

        return (
            <>
                <div className="detf-container">
                    <div className="detf-title-section">
                        <div className="detf-name-wrapper">
                            <div className="detf-name-title">
                                <img className="detf-name-logo" src={require(`../../assets/icons/${DETFIconFilename(category, dimension)}`)}></img>
                                <div style={{ color: ColourCategories(category) }}>{category}</div>
                            </div>
                            <div className="detf-name-dimension">{dimension}</div>
                        </div>
                        <Link to="/establish-detf" state={{ category: category, dimension: dimension, productId: productId.toString(), processOrigin: "establish", activeStage: 1 }}>
                            <Button buttonStyle="primary" buttonSize="standard" text="Invest in this DETF" />
                        </Link>
                    </div>
                    <div className="detf-wrapper">
                        <div className="detf-lhs">
                            <div className="detf-description">
                                <h2>{descriptionTitle}</h2>
                                <p>{description}</p>
                            </div>
                            <div className="detf-chart">
                                <p>{category} {dimension} DETF Index Value - 3 Months</p>
                                <DETFReturnChart height={300} width="100%" performanceData={performanceData} />
                            </div>
                            <DETFSummary
                                productContent={productContent}
                                productData={productData}
                                performanceData={performanceData}
                                vsPrices={vsPrices}
                                currency={currency} />
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
                                    <Button buttonStyle="primary" buttonSize="standard" text="Invest in this DETF" />
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
            {/* <ErrorPage errorText={"Product data not found."} /> */}
            <Loading />
            <Footer />
        </>
    )
}

export default DETF