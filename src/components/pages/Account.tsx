import Footer from './Footer'
import { TruncateAddress } from '../utils/Formatting'
import { Link } from 'react-router-dom'
import { useAccount, useBalance, useNetwork } from "wagmi"
import AccountTable from '../account/AccountTable'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import MainContainer from '../containers/Main'
import AccountSummary from '../account/AccountSummary'
import { GetDETFAccounts } from '../api/GetDETFAccounts'
import { useEffect, useState, useContext } from 'react'
import { GetDETFAccountsDataAll } from '../api/GetDETFAccountsDataAll'
import { CurrencyContext, FormatCurrency } from "../utils/Currency"
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { GetHistoricalPrices } from '../api/GetHistoricalPrices'
import wethAddress from "../../chain_info/weth.json"
import { Connect } from '../Connect'

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
    const { address: walletOwner, connector, isConnected } = useAccount()
    const [previousWalletOwner, setPreviousWalletOwner] = useState(walletOwner)
    useEffect(() => {
        if (previousWalletOwner !== walletOwner) {
            window.location.reload()
        }
    }, [walletOwner])
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })
    const { chain } = useNetwork()
    /* const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork() */
    const [detfAccounts, setDETFAccounts] = useState<Array<string>>([])
    const [detfAccountsData, setDETFAccountsData] = useState<Array<string>>([])
    const { response: detfAccountsList, isLoading: detfAccountsLoading, isSuccess: detfAccountsSuccess } = GetDETFAccounts(walletOwner ? walletOwner : "")
    const { response: detfAccountsListData, isLoading: detfAccountsDataLoading, isSuccess: detfAccountsDataSuccess } = GetDETFAccountsDataAll(walletOwner ? walletOwner : "")
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const [vsPrices, setVsPrices] = useState<any>({})

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    useEffect(() => {
        setDETFAccounts(detfAccountsList ? detfAccountsList : [])
        setDETFAccountsData(detfAccountsListData ? detfAccountsListData : [])
    }, [detfAccountsLoading, detfAccountsDataLoading, detfAccountsSuccess, detfAccountsDataSuccess])
    const { response: historicalPriceData, isSuccess: historicalPricesSuccess } = GetHistoricalPrices()
    const { response: currentPriceData, isSuccess: currentPricesSuccess } = GetPriceVsCurrency(wethAddress["56"]["wethAddress"])
    const [historicalPrices, setHistoricalPrices] = useState<Array<Currencies>>([])
    const [currentPrices, setCurrentPrices] = useState<Currencies>()

    useEffect(() => {
        setHistoricalPrices(historicalPriceData ? historicalPriceData : [])
        setCurrentPrices(currentPriceData ? currentPriceData : [])
    }, [historicalPriceData, historicalPricesSuccess, currentPriceData, currentPricesSuccess])

    const subTitle = <div>
        <div>{`You have connected Polybit to ${connector?.name} and are ready to invest in DETFs.`}</div>
        <br></br>
        <div><p style={{ color: "#909090" }}><b>Your connected wallet: </b>
            {connector?.name === "MetaMask" && <img width="20px" height="20px" src={require("../../assets/images/metamask_icon.png")} />}
            {connector?.name === "CoinbaseWallet" && <img width="20px" height="20px" src={require("../../assets/images/coinbasewallet_icon.png")} />}
            {connector?.name === "WalletConnect" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
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
                    })()) : 0, 2)})`}</b></p></div>
    </div>

    const subTitleNotConnected = <div><h2>You are not currently connected to a crypto wallet. Please connect your wallet to access all of the features of this app.</h2></div>

    if (isConnected) {
        return (
            <>
                <TitleContainer title="Account" />
                <SubTitleContainer info={subTitle} />
                <MainContainer>
                    <AccountSummary
                        detfAccounts={detfAccounts}
                        detfAccountsSuccess={detfAccountsSuccess}
                        detfAccountsData={detfAccountsData}
                        detfAccountsDataSuccess={detfAccountsDataSuccess}
                        vsPrices={vsPrices}
                        currency={currency}
                    />
                    <AccountTable
                        detfAccounts={detfAccounts}
                        detfAccountsSuccess={detfAccountsSuccess}
                        detfAccountsData={detfAccountsData}
                        vsPrices={vsPrices}
                        currency={currency}
                        historicalPrices={historicalPrices}
                        currentPrices={currentPrices}
                    />
                </MainContainer>
                <Footer />
            </>
        )
    }

    return (
        <>
            <TitleContainer title="Account" />
            <SubTitleContainer info={subTitleNotConnected} />
            <MainContainer>
                <Connect />
            </MainContainer>
            <Footer />
        </>
    )
}

export default Account