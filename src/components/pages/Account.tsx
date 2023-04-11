import Footer from './Footer'
import { TruncateAddress } from '../utils/Formatting'
import { useAccount, useBalance, useNetwork, useDisconnect } from "wagmi"
import AccountTable from '../account/AccountTable'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import AccountSummary from '../account/AccountSummary'
import { useEffect, useState, useContext } from 'react'
import { CurrencyContext, FormatCurrency } from "../utils/Currency"
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { GetHistoricalPrices } from '../api/GetHistoricalPrices'
import wethAddress from "../../chain_info/weth.json"
import { Connect } from '../Connect'
import { SwitchNetwork } from '../SwitchNetwork'
import { TextLink } from '../Buttons'
import { initialiseGA4 } from '../utils/Analytics'
import ReactGA from "react-ga4"
import { useLocation } from 'react-router-dom'
import { LockedBeta } from '../LockedBeta'
import { GetDETFAccountsDataAll } from '../api/GetDETFAccountsDataAll'
import { DETFAccountData } from '../api/GetDETFAccountData'
import { Helmet } from 'react-helmet-async'

type Currencies = {
    "date": string;
    "aud": number;
    "bnb": number;
    "cny": number;
    "eur": number;
    "idr": number;
    "jpy": number;
    "krw": number;
    "rub": number;
    "twd": number;
    "usd": number;
}

const Account = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const { address: walletOwner, connector, isConnected } = useAccount()
    const [previousWalletOwner, setPreviousWalletOwner] = useState(walletOwner)
    const { disconnect } = useDisconnect()
    useEffect(() => {
        if (previousWalletOwner !== walletOwner) {
            window.location.reload()
        }
    }, [walletOwner])
    const { data: walletBalance } = useBalance({
        address: walletOwner,
    })
    const { chain } = useNetwork()
    const [detfAccountsData, setDETFAccountsData] = useState<Array<DETFAccountData>>([])
    const { response: detfAccountsListData, isLoading: detfAccountsDataLoading, isSuccess: detfAccountsDataSuccess } = GetDETFAccountsDataAll(walletOwner ? walletOwner : "")

    useEffect(() => {
        detfAccountsListData && detfAccountsDataSuccess && setDETFAccountsData(detfAccountsListData)
    }, [detfAccountsDataSuccess])

    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency(wethAddress["56"]["wethAddress"])
    const [vsPrices, setVsPrices] = useState<any>({})

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    const { response: historicalPriceData, isSuccess: historicalPricesSuccess } = GetHistoricalPrices()
    const [historicalPrices, setHistoricalPrices] = useState<Array<Currencies>>([])
    const [currentPrices, setCurrentPrices] = useState<Currencies>()

    useEffect(() => {
        setHistoricalPrices(historicalPriceData ? historicalPriceData : [])
        setCurrentPrices(prices ? prices : [])
    }, [historicalPriceData, historicalPricesSuccess, prices, pricesSuccess])

    const subTitle = <div style={{ width: "100%" }}>
        <div>{`You have connected Polybit to ${connector?.name} and are ready to invest in DETFs.`}</div>
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
    </div>
    const subTitleNotConnected = <div><h2>You are not currently connected to a wallet. Please connect your wallet to access all of the features of this app.</h2></div>

    if (window.location.href.includes("polybit.finance")) {
        return (
            <>
                <LockedBeta />
                <Footer />
            </>
        )
    }

    if (isConnected && !chain?.unsupported) {
        return (
            <>
                <Helmet>
                    <title>{`Account | Polybit Finance`}</title>
                    <meta name="description" content="Connect your wallet to view your Account" />
                </Helmet>
                <TitleContainer title="Your account" />
                <SubTitleContainer info={subTitle} />
                <AccountSummary
                    detfAccountsData={detfAccountsData}
                    detfAccountsDataSuccess={detfAccountsDataSuccess}
                    vsPrices={vsPrices}
                    currency={currency}
                />
                <AccountTable
                    detfAccountsData={detfAccountsData}
                    detfAccountsDataSuccess={detfAccountsDataSuccess}
                    vsPrices={vsPrices}
                    currency={currency}
                    historicalPrices={historicalPrices}
                    currentPrices={currentPrices}
                />
                <Footer />
            </>
        )
    }

    if (isConnected && chain?.unsupported) {
        return (<SwitchNetwork />)
    }

    return (
        <>
            <TitleContainer title="Account" />
            <SubTitleContainer info={subTitleNotConnected} />
            <Connect />
            <Footer />
        </>
    )
}

export default Account