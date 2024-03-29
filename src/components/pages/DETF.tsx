import { useParams, Link, useLocation } from 'react-router-dom'
import { DETFReturnChart } from '../charts/DETFReturnChart'
import "./DETF.css"
import { DETFAssetsTable } from '../DETFAssetsTable'
import { CurrencyContext } from '../utils/Currency'
import { Footer } from '../Footer/Footer'
import { useEffect, useContext, useState } from 'react'
import { GetProductData, ProductData } from '../api/GetProductData'
import { GetPerformanceData, PerformanceData } from '../api/GetPerformanceData'
import { Loading } from '../Loading/Loading'
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { DETFSummary } from '../DETFSummary'
import { ColourCategories, DETFIconFilename } from '../utils/Formatting'
import { useNetwork } from 'wagmi'
import { Button } from '../Buttons/Buttons'
import ReactGA from "react-ga4"
import { initialiseGA4 } from '../utils/Analytics'
import { Helmet } from 'react-helmet-async'
import { LockedBeta } from '../LockedBeta'
import { DETFInvestButton } from '../DETFInvestButton'

const DETF = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])

    const urlCategoryId = useParams().urlCategoryId
    const urlDimensionId = useParams().urlDimensionId
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    const productUrl = `${chainId}/${urlCategoryId}/${urlDimensionId}`
    const performanceUrl = `${chainId}/${urlCategoryId}/${urlDimensionId}`
    const productContent = require(`../../product/themes/${chainId}/${urlCategoryId}/${urlDimensionId}/content.json`)
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const [vsPrices, setVsPrices] = useState<any>({})
    const [showBetaMessage, setShowBetaMessage] = useState<boolean>(false)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [showBetaMessage]);

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

    const productId = productContent.productId
    const chainName: string = productContent.chainName
    const category: string = productContent.category
    const dimension: string = productContent.dimension
    const descriptionTitle: string = productContent.descriptionTitle
    const description: Array<string> = productContent.description
    const assetTableDescription: string = productContent.assetTableDescription
    const tokens: Array<any> = [] = productData ? productData.tokens : []

    if (productContent && productData && performanceData && !showBetaMessage) {
        return (
            <>
                <Helmet>
                    <title>{`${category} ${dimension} investment theme | Polybit Finance`}</title>
                    <meta name="description" content={descriptionTitle} />
                </Helmet>
                <div className="detf">
                    <div className="detf-container">
                        <div className="detf-title-section">
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
                                <DETFInvestButton
                                    setShowBetaMessage={setShowBetaMessage}
                                    productId={productId}
                                    category={category}
                                    dimension={dimension} />
                            </div>
                        </div>
                        <ul className="detf-content">
                            <li className="detf-content-a">
                                <div className="detf-description">
                                    <h2>{descriptionTitle}</h2>
                                    <div className="detf-button-wrapper-mobile">
                                        <DETFInvestButton
                                            setShowBetaMessage={setShowBetaMessage}
                                            productId={productId}
                                            category={category}
                                            dimension={dimension} />
                                    </div>
                                    {description.map((line: string) =>
                                        <div key={line}>
                                            <br />
                                            <p>{line}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="detf-chart">
                                    <div className="detf-chart-title"><p>{category} {dimension} investment theme Index Value - 3 Months</p></div>
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
                                    <h2>Assets in investment theme</h2>
                                    {/* <p>{assetTableDescription}</p> */}
                                    <DETFAssetsTable tokens={tokens} />
                                </div>
                                <div className="native-token-message-box">
                                    <p>BNB is the native currency used for investment in to this DETF. Please ensure you have sufficient BNB in your wallet before investing.</p>
                                </div>
                                <div className="detf-button-wrapper">
                                    <DETFInvestButton
                                        setShowBetaMessage={setShowBetaMessage}
                                        productId={productId}
                                        category={category}
                                        dimension={dimension} />
                                </div>
                                <div className="detf-button-wrapper-mobile">
                                    <DETFInvestButton
                                        setShowBetaMessage={setShowBetaMessage}
                                        productId={productId}
                                        category={category}
                                        dimension={dimension} />
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

    if (showBetaMessage) {
        return (
            <>
                <Helmet>
                    <title>{`${category} ${dimension} investment theme | Polybit Finance`}</title>
                    <meta name="description" content={descriptionTitle} />
                </Helmet>
                <LockedBeta
                    setShowBetaMessage={setShowBetaMessage}
                    sourcePage="Investment Theme" />
                <Footer />
            </>
        )
    }

    return (
        <>
            <Loading />
            <Footer />
        </>
    )
}

export default DETF