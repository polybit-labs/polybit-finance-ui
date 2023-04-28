import React, { useContext, useEffect, useState } from 'react'
import Footer from './Footer'
import { Helmet } from 'react-helmet-async'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import { Loading } from '../Loading'
import { SwapBox } from '../swap/SwapBox'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { TruncateAddress } from '../utils/Formatting'
import { CurrencyContext, FormatCurrency } from '../utils/Currency'
import { useLocation } from 'react-router-dom'
import { initialiseGA4 } from '../utils/Analytics'
import ReactGA from "react-ga4"
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import wethAddress from "../../chain_info/weth.json"
import { TextLink } from '../Buttons'
import { BigNumber } from 'ethers'

function Swap() {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        address: walletOwner,
    })
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency(wethAddress["56"]["wethAddress"])
    const [vsPrices, setVsPrices] = useState<any>({})

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    const title: string = "Swap"
    /* const subTitle = <div style={{ width: "100%" }}>
        <div>{`You have connected Polybit to ${connector?.name} and are ready swap digital assets.`}</div>
        <br></br>
        <div className="sub-title-info" ><p style={{ color: "#909090" }}><b>Your connected wallet: </b>
            {connector?.name === "MetaMask" && <img width="20px" height="20px" src={require("../../assets/images/metamask_icon.png")} />}
            {connector?.name === "Coinbase Wallet" && <img width="20px" height="20px" src={require("../../assets/images/coinbasewallet_icon.png")} />}
            {connector?.name === "WalletConnect" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
            {connector?.name === "WalletConnectLegacy" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
            <b>{` ${TruncateAddress(walletOwner ? walletOwner : "")} (Available funds: ${FormatCurrency(walletBalance ?
                (Number(walletBalance.value)
                    / 10 ** 18 *
                    (() => {
                        switch (currency) {
                            case "AUD": return (vsPrices.aud)
                            case "BNB": return (vsPrices.bnb)
                            case "CNY": return (vsPrices.cny)
                            case "EURO": return (vsPrices.eur)
                            case "IDR": return (vsPrices.idr)
                            case "JPY": return (vsPrices.jpy)
                            case "KRW": return (vsPrices.krw)
                            case "RUB": return (vsPrices.rub)
                            case "TWD": return (vsPrices.twd)
                            case "USD": return (vsPrices.usd)
                        }
                    })()) : 0, 2)})`}</b></p>
            <TextLink to="" text="Disconnect and log out" arrowDirection="forward-logout" onClick={() => disconnect()} /></div>
    </div> */
    const tokenList: Array<any> = []

    if (tokenList) {
        return (
            <>
                <Helmet>
                    <title>Swap | Polybit Finance</title>
                    <meta name="description" content="" />
                </Helmet>
                <TitleContainer title={title} />
                <SwapBox walletOwner={walletOwner}
                    walletBalance={walletBalance ? walletBalance.value : BigNumber.from("0")}
                    connector={connector}
                    currency={currency}
                    vsPrices={vsPrices} />
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

export default Swap