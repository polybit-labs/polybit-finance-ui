import Footer from './Footer'
import { TruncateAddress } from '../utils/Formatting'
import { Link } from 'react-router-dom'
import { useAccount, useBalance, useNetwork } from "wagmi"
import AccountTable from '../AccountTable'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import MainContainer from '../containers/Main'
import AccountSummary from '../AccountSummary'
import { GetDETFAccounts } from '../api/GetDETFAccounts'
import { useEffect, useState, useContext } from 'react'
import { GetDETFAccountsData } from '../api/GetDETFAccountsData'
import { CurrencyContext, FormatCurrency } from "../utils/Currency"
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'


const Account = () => {
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })
    const { chain } = useNetwork()
    /* const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork() */
    const [detfAccounts, setDETFAccounts] = useState<Array<string>>([])
    const [detfAccountsData, setDETFAccountsData] = useState<Array<string>>([])
    const { response: detfAccountsList, isLoading: detfAccountsLoading, isSuccess: detfAccountsSuccess } = GetDETFAccounts(walletOwner ? walletOwner : "")
    const { response: detfAccountsListData, isLoading: detfAccountsDataLoading, isSuccess: detfAccountsDataSuccess } = GetDETFAccountsData(walletOwner ? walletOwner : "")
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

    const subTitle = <div>
        <div>{`You have connected Polybit to ${connector?.name} and are ready to invest in DETFs.`}</div>
        <br></br>
        <div><p style={{ color: "#909090" }}><b>{`Your connected wallet: [LOGO] ${TruncateAddress(walletOwner ? walletOwner : "")} (Available funds: ${FormatCurrency(walletBalance ?
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

    if (isConnected) {
        return (
            <>
                <TitleContainer title="Account" />
                <SubTitleContainer info={subTitle} />
                <MainContainer>
                    <AccountSummary detfAccounts={detfAccounts} detfAccountsData={detfAccountsData} vsPrices={vsPrices} currency={currency} />
                    <AccountTable detfAccounts={detfAccounts} detfAccountsData={detfAccountsData} vsPrices={vsPrices} currency={currency} />
                </MainContainer>
                <Footer />
            </>
        )
    }

    return (
        <>
            <div className="account-title-section">
                <div>
                    <h1>Account</h1>
                </div>
                <div>
                    <p>You are not currently connected to a crypto wallet. <Link to="/connect-wallet" className="account-switch-wallet">
                        <u>Connect wallet</u>.
                    </Link></p>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Account