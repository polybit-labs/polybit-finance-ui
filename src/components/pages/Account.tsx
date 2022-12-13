import Footer from './Footer'
import { TruncateAddress } from '../utils/Formatting'
import { Link } from 'react-router-dom'
import { useAccount, useNetwork } from "wagmi"
import AccountTable from '../AccountTable'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import MainContainer from '../containers/Main'
import AccountSummary from '../AccountSummary'
import { GetDETFAccounts } from '../api/GetDETFAccounts'
import { useEffect, useState, useContext } from 'react'
import { GetDETFAccountsData } from '../api/GetDETFAccountsData'
import { CurrencyContext } from "../utils/Currency"
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'


const Account = () => {
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain } = useNetwork()
    console.log(chain)
    /* const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork() */
    const [detfAccounts, setDETFAccounts] = useState<Array<string>>([])
    const [detfAccountsData, setDETFAccountsData] = useState<Array<string>>([])
    const { response: detfAccountsList, isLoading: detfAccountsLoading, isSuccess: detfAccountsSuccess } = GetDETFAccounts(walletOwner ? walletOwner : "")
    const { response: detfAccountsListData, isLoading: detfAccountsDataLoading, isSuccess: detfAccountsDataSuccess } = GetDETFAccountsData(walletOwner ? walletOwner : "")
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const [vsPrices, setVsPrices] = useState({})

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    useEffect(() => {
        setDETFAccounts(detfAccountsList ? detfAccountsList : [])
        setDETFAccountsData(detfAccountsListData ? detfAccountsListData : [])
    }, [detfAccountsLoading, detfAccountsDataLoading, detfAccountsSuccess, detfAccountsDataSuccess])

    console.log(chain)

    if (isConnected) {
        return (
            <>
                <TitleContainer title="Account" />
                <SubTitleContainer info={`You are currently connected to ${TruncateAddress(walletOwner ? walletOwner : "")} on the ${chain?.name} network via ${connector?.name}.`} />
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