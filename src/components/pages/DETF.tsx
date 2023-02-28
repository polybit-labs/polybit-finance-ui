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
import { Button } from '../Buttons'

const DETF = () => {
    const urlCategoryId = useParams().urlCategoryId
    const urlDimensionId = useParams().urlDimensionId
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    const productUrl = `${chainId}/${urlCategoryId}/${urlDimensionId}`
    const performanceUrl = `${chainId}/${urlCategoryId}/${urlDimensionId}`
    const productContent = require(`../../product/detfs/${chainId}/${urlCategoryId}/${urlDimensionId}/content.json`)
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
    const description: Array<string> = productContent.description
    const assetTableDescription: string = productContent.assetTableDescription
    const tokens: Array<any> = [] = productData ? productData.tokens : []

    if (productContent && productData && performanceData) {

        return (
            <>
                <div className="detf">
                    <div className="detf-container">
                        <div className="detf-title-section">
                            {/* <div className="detf-name-wrapper">
                                <div className="detf-name-title">
                                    <img className="detf-name-logo" src={require(`../../assets/icons/${DETFIconFilename(category, dimension)}`)}></img>
                                    <div style={{ color: ColourCategories(category) }}>{category}</div>
                                </div>
                                <div className="detf-name-dimension">{dimension}</div>
                            </div> */}
                            <div className="detf-name-wrapper">
                                <img className="detf-name-logo" src={require(`../../assets/icons/${DETFIconFilename(category, dimension)}`)}></img>
                                <div className="detf-name">
                                    <div className="detf-name-category" style={{ color: ColourCategories(category) }}>
                                        {category}
                                    </div>
                                    <div className="detf-name-dimension">
                                        {dimension}
                                    </div>
                                </div>
                            </div>
                            <div className="detf-button-wrapper">
                                <Link className="detf-invest-button" to="/establish-detf" state={{ category: category, dimension: dimension, productId: productId.toString(), processOrigin: "establish", activeStage: 1 }}>
                                    <Button buttonStyle="primary" buttonSize="standard" text="Invest in this DETF" />
                                </Link>
                            </div>
                        </div>
                        <ul className="detf-content">
                            <li className="detf-content-a">
                                <div className="detf-description">
                                    <h2>{descriptionTitle}</h2>
                                    <div className="detf-button-wrapper-mobile">
                                        <Link to="/establish-detf" state={{ category: category, dimension: dimension, productId: productId.toString() }}>
                                            <Button buttonStyle="primary" buttonSize="standard" text="Invest in this DETF" />
                                        </Link>
                                    </div>
                                    {description.map((line: string) =>
                                        <div key={line}>
                                            <br />
                                            <p>{line}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="detf-chart">
                                    <div className="detf-chart-title"><p>{category} {dimension} DETF Index Value - 3 Months</p></div>
                                    <DETFReturnChart height={300} width="100%" performanceData={performanceData} />
                                </div>
                                <DETFSummary
                                    productContent={productContent}
                                    productData={productData}
                                    performanceData={performanceData}
                                    vsPrices={vsPrices}
                                    currency={currency} />
                            </li>
                            <li className="detf-content-b">
                                <div className="detf-assets-box">
                                    <h2>Assets in DETF</h2>
                                    {/* <p>{assetTableDescription}</p> */}
                                    <DETFAssetsTable tokens={tokens} />
                                </div>
                                <div className="native-token-message-box">
                                    <p>BNB is the native currency used for investment in to this DETF. Please ensure you have sufficient BNB in your wallet before investing.</p>
                                </div>
                                <div className="detf-button-wrapper">
                                    <Link to="/establish-detf" state={{ category: category, dimension: dimension, productId: productId.toString() }}>
                                        <Button buttonStyle="primary" buttonSize="standard" text="Invest in this DETF" />
                                    </Link>
                                </div>
                                <div className="detf-button-wrapper-mobile">
                                    <Link to="/establish-detf" state={{ category: category, dimension: dimension, productId: productId.toString() }}>
                                        <Button buttonStyle="primary" buttonSize="standard" text="Invest in this DETF" />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                        <div className="detf-summary-fine-print">
                            <br />
                            <div>*Past performance is not indicative of future performance. This is not financial advice. There are risks associated with crytpocurrency investing. Do your own research.</div>
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