import { useState, useEffect, useContext } from 'react'
import "./Deposit.css"
import { TruncateAddress } from '../utils/Formatting'
import { useLocation } from 'react-router-dom'
import TitleContainer from "../containers/Title"
import SubTitleContainer from '../containers/SubTitle'
import MainContainer from '../containers/Main'
import { useAccount, useBalance } from "wagmi"
import Footer from './Footer'
import { Progress } from '../Progress'
import { DETFAccountData, GetDETFAccountData } from '../api/GetDETFAccountData'
import { Loading } from '../Loading'
import { DepositDetails } from '../deposit/DepositDetails'
import { CurrencyContext } from '../utils/Currency'
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { DepositSuccess } from '../deposit/DepositSuccess'
import { DepositSummary } from '../deposit/DepositSummary'

function Deposit() {
    const location = useLocation()
    const [title, setTitle] = useState("Your investment amount")
    const { category, dimension, productId, detfAddress, processOrigin, activeStage } = location.state
    const { response: detfDataResponse, isLoading, isSuccess: detfDataSuccess } = GetDETFAccountData(detfAddress)
    const [detfAccountData, setDETFAccountData] = useState<DETFAccountData>()
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const [vsPrices, setVsPrices] = useState<any>({})
    const [depositAmount, setDepositAmount] = useState("")
    const [timeLockAmount, setTimeLockAmount] = useState(0)
    const [showDepositDetails, setShowDepositDetails] = useState(true)
    const [depositSuccess, setDepositSuccess] = useState(false)

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    useEffect(() => {
        setDETFAccountData(detfDataResponse)
    }, [detfDataSuccess])
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })
    const [internalActiveStage, setInternalActiveStage] = useState(activeStage ? activeStage : 1)

    console.log(depositAmount, timeLockAmount)

    if (detfDataSuccess && detfAccountData) {
        return (
            <>
                {!depositSuccess &&
                    <div>
                        <TitleContainer title={title} />
                        <SubTitleContainer info={`You are about to deposit funds from your address ${TruncateAddress(walletOwner ? walletOwner : "")} into the ${category} ${dimension} DETF using ${connector?.name}.`} />
                        <Progress processOrigin={processOrigin} activeStage={internalActiveStage} />
                    </div>}
                <MainContainer>
                    {showDepositDetails && !depositSuccess && <DepositDetails
                        detfAddress={detfAccountData.detf_address}
                        timeLock={detfAccountData.time_lock}
                        timeLockRemaining={detfAccountData.time_lock_remaining}
                        productId={detfAccountData.product_id}
                        category={detfAccountData.category}
                        dimension={detfAccountData.dimension}
                        walletBalance={walletBalance}
                        connector={connector}
                        currency={currency}
                        vsPrices={vsPrices}
                        setDepositAmount={setDepositAmount}
                        setTimeLockAmount={setTimeLockAmount}
                        setShowDepositDetails={setShowDepositDetails}
                        setInternalActiveStage={setInternalActiveStage}
                    />}
                    {!showDepositDetails && !depositSuccess && <DepositSummary
                        detfAddress={detfAccountData.detf_address}
                        timeLock={detfAccountData.time_lock}
                        category={detfAccountData.category}
                        dimension={detfAccountData.dimension}
                        walletBalance={walletBalance}
                        connector={connector}
                        currency={currency}
                        vsPrices={vsPrices}
                        depositAmount={depositAmount}
                        timeLockAmount={timeLockAmount}
                        setShowDepositDetails={setShowDepositDetails}
                        setInternalActiveStage={setInternalActiveStage}
                        setDepositSuccess={setDepositSuccess}
                    />}
                    {depositSuccess && <DepositSuccess
                        category={detfAccountData.category}
                        dimension={detfAccountData.dimension}
                    />}
                </MainContainer>
                <Footer />
            </>
        )
    }
    return (
        <>
            <TitleContainer title={title} />
            <SubTitleContainer info={`You are about to deposit funds from your address ${TruncateAddress(walletOwner ? walletOwner : "")} into the ${category} ${dimension} DETF using ${connector?.name}.`} />
            <Loading />
            <Footer />
        </>
    )
}

export default Deposit