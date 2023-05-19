import { Footer } from '../../components/Footer/Footer'
import { TruncateAddress } from '../../components/utils/Formatting'
import { useAccount, useBalance, useNetwork, useDisconnect } from "wagmi"
import AccountTable from './components/AccountTable/AccountTable'
import TitleContainer from '../../components/containers/Title'
import SubTitleContainer from '../../components/containers/SubTitle'
import AccountSummary from './components/AccountSummary/AccountSummary'
import { useEffect, useState, useContext } from 'react'
import { CurrencyContext, FormatCurrency } from "../../components/utils/Currency"
import { GetPriceVsCurrency } from '../../components/api/GetPriceVsCurrency'
import { GetHistoricalPrices } from '../../components/api/GetHistoricalPrices'
import { Connect } from '../../components/Connect/Connect'
import { SwitchNetwork } from '../../components/SwitchNetwork/SwitchNetwork'
import { TextLink } from '../../components/Buttons/TextLink'
import { initialiseGA4 } from '../../components/utils/Analytics'
import ReactGA from "react-ga4"
import { useLocation } from 'react-router-dom'
import { LockedBeta } from '../../components/LockedBeta'
import { Helmet } from 'react-helmet-async'
import ChainInfo from '../../context/ChainInfo.json'
import { AccountSummaryPlaceholder } from './components/AccountSummary/AccountSummaryPlaceholder'
import { AccountTablePlaceholder } from './components/AccountTable/AccountTablePlaceholder'
import { ConnectHeader } from './components/ConnectAccount/ConnectHeader'
import { TokenTable } from './components/TokenTable/TokenTable'
import { TokenTablePlaceholder } from './components/TokenTable/TokenTablePlaceholder'

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
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    const wethAddress: string = ChainInfo[chainId as keyof typeof ChainInfo]["weth_address"]
    const [showConnect, setShowConnect] = useState<boolean>(false)
    const [showBetaMessage, setShowBetaMessage] = useState<boolean>(false)
    const [totalDigitalAssetValue, setTotalDigitalAssetValue] = useState<number | undefined>()
    const [totalDigitalAssetReturn, setTotalDigitalAssetReturn] = useState<number | undefined>()
    const [totalInvestmentThemeValue, setTotalInvestmentThemeValue] = useState<number | undefined>()
    const [totalInvestmentThemeReturn, setTotalInvestmentThemeReturn] = useState<number | undefined>()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [showBetaMessage, showConnect]);

    useEffect(() => {
        if (previousWalletOwner !== walletOwner) {
            window.location.reload()
        }
    }, [walletOwner])

    useEffect(() => {
        if (isConnected) {
            setShowConnect(false)
        }
    }, [isConnected])

    const { data: walletBalance } = useBalance({
        address: walletOwner,
    })

    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency(wethAddress)
    const [vsPrices, setVsPrices] = useState<any>({})


    const [reloader, setReloader] = useState(0);
    const reset = () => {
        setReloader(Math.random());
    }

    useEffect(() => {
        reset();
    }, [currency]);

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

    if (isConnected && walletOwner && !chain?.unsupported) {
        return (
            <>
                <Helmet>
                    <title>{`Account | Polybit Finance`}</title>
                    <meta name="description" content="Connect your wallet to view your Account" />
                </Helmet>
                <TitleContainer title="Your account" />
                <SubTitleContainer info={subTitle} />
                <AccountSummary
                    key={reloader}
                    vsPrices={vsPrices}
                    currency={currency}
                    totalDigitalAssetValue={totalDigitalAssetValue}
                    totalDigitalAssetReturn={totalDigitalAssetReturn}
                    totalInvestmentThemeValue={totalInvestmentThemeValue}
                    totalInvestmentThemeReturn={totalInvestmentThemeReturn}
                />
                <TokenTable
                    key={reloader + 1}
                    wallet_owner={walletOwner}
                    currency={currency}
                    vsPrices={vsPrices}
                    setTotalDigitalAssetValue={setTotalDigitalAssetValue}
                    setTotalDigitalAssetReturn={setTotalDigitalAssetReturn}
                />
                <AccountTable
                    key={reloader + 2}
                    walletOwner={walletOwner}
                    vsPrices={vsPrices}
                    currency={currency}
                    historicalPrices={historicalPrices}
                    currentPrices={currentPrices}
                    setTotalInvestmentThemeValue={setTotalInvestmentThemeValue}
                    setTotalInvestmentThemeReturn={setTotalInvestmentThemeReturn}
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
            {!showConnect && !showBetaMessage && <TitleContainer title="Account" />}
            {/* <SubTitleContainer info={subTitleNotConnected} /> */}
            {!showConnect && !showBetaMessage && <ConnectHeader
                setShowConnect={setShowConnect}
                setShowBetaMessage={setShowBetaMessage} />}
            {showConnect && <Connect />}
            {showBetaMessage && <LockedBeta
                setShowBetaMessage={setShowBetaMessage}
                sourcePage="Account" />}
            {!showConnect && !showBetaMessage && <AccountSummaryPlaceholder
                vsPrices={vsPrices}
                currency={currency}
            />}
            {!showConnect && !showBetaMessage && <TokenTablePlaceholder />}
            {!showConnect && !showBetaMessage && <AccountTablePlaceholder />}
            <Footer />
        </>
    )

}

export default Account