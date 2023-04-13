import { useLocation } from "react-router-dom"
import { initialiseGA4 } from "../utils/Analytics"
import ReactGA from "react-ga4"
import { Helmet } from 'react-helmet-async'
import { useContext, useEffect, useState } from "react"
import { CurrencyContext } from "../utils/Currency"
import TitleContainer from "../containers/Title"
import SubTitleContainer from "../containers/SubTitle"
import Footer from "./Footer"
import { TokenIndexList } from "../TokenIndexList"
import { GetTokenIndexData, TokenIndexData } from "../api/GetTokenIndexData"
import { Loading } from "../Loading"

export const TokenIndex = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const title = "Token Index"
    const subTitle = "Tokens available on Polybit, sorted by Market Cap."
    const currency = useContext(CurrencyContext).currency

    const { response: tokenIndexData, isSuccess: tokenIndexDataSuccess } = GetTokenIndexData()
    const [tokenData, setTokenData] = useState<Array<TokenIndexData>>()

    useEffect(() => {
        if (tokenIndexData) {
            setTokenData(tokenIndexData)
        }
    }, [currency, tokenIndexDataSuccess])

    if (tokenData) {
        return (
            <>
                <Helmet>
                    <title>{`Token Index | Polybit Finance`}</title>
                    <meta name="description" content="" />
                </Helmet>
                <TitleContainer title={title} />
                <SubTitleContainer info={subTitle} />
                <TokenIndexList tokenIndex={tokenData} currency={currency} />
                <Footer />
            </>
        )
    }

    return (<>
        <Helmet>
            <title>{`Token Index | Polybit Finance`}</title>
            <meta name="description" content="" />
        </Helmet>
        <TitleContainer title={title} />
        <SubTitleContainer info={subTitle} />
        <Loading />
        <Footer />
    </>)
}