import { useContext, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { initialiseGA4 } from "../utils/Analytics"
import ReactGA from "react-ga4"
import { Helmet } from 'react-helmet-async'
import { Footer } from "../Footer/Footer"
import "./Token.css"
import { GetTokenData } from "../api/GetTokenData"
import { TokenSummary } from "../TokenSummary"
import { CurrencyContext } from "../utils/Currency"
import { FormatTokenIndex, TokenIndexDataFormatted } from "../FormatTokenIndex"
import { TokenDETFBox } from "../TokenDETFBox"
import { Loading } from "../Loading/Loading"

export const Token = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const urlTokenName = useParams().urlTokenName
    const tokenContent = require(`../../product/tokens/${urlTokenName}.json`)
    const currency = useContext(CurrencyContext).currency
    console.log(tokenContent)
    const { response: token, isSuccess: tokenDataSuccess } = GetTokenData(urlTokenName ? urlTokenName : "")
    const [tokenData, setTokenData] = useState<TokenIndexDataFormatted>()

    useEffect(() => {
        if (token) {
            const formatted = FormatTokenIndex(currency, token)
            setTokenData(formatted)
        }
    }, [currency, tokenDataSuccess])

    if (tokenData) {
        return (<>
            <Helmet>
                <title>{`${tokenContent["name"]} | Polybit Finance`}</title>
                <meta name="description" content={tokenContent["overview"]} />
            </Helmet>
            <div className="token">
                <div className="token-container">
                    <div className="token-title-section">
                        <div className="token-name-wrapper">
                            <img className="token-name-logo" src={tokenContent["logoURI"]} alt={tokenContent["name"]}></img>
                            <div className="token-name" style={{ color: tokenContent["dominantColour"] }}>
                                {tokenContent["name"]}
                            </div>
                        </div>
                    </div>
                    <ul className="token-content">
                        <li className="token-content-a">
                            <div className="token-description">
                                <h2>Overview</h2>
                                <p>{tokenContent["overview"]}</p>
                                <br />
                                <h2>History</h2>
                                <p>{tokenContent["history"]}</p>
                            </div>
                        </li>
                        <li className="token-content-b">
                            <TokenSummary tokenContent={tokenContent} tokenData={tokenData} currency={currency} />
                        </li>
                    </ul>
                    {tokenData["detfs"].length > 0 && <>
                        <div className="featured-title" style={{ color: tokenContent["dominantColour"] }}>Featured DETFs</div>
                        <ul className="token-detf-boxes">
                            {tokenData["detfs"].map((detf: any, index: number) =>
                                <li key={index} ><TokenDETFBox urlChainId={detf.chain_id} urlCategoryId={detf.category} urlDimensionId={detf.dimension} return={detf.performance_7d} performanceData={detf.performance_data} /></li>
                            )}
                        </ul>
                    </>}
                </div>
            </div>
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