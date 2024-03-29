import { useState, useEffect, useContext } from 'react'
import { useAccount, useBalance } from "wagmi"
import { GetAccountData } from '../api/GetAccountData'
import { AccountData } from '../api/GetAccountDataAll'
import { DepositDetails } from '../deposit/DepositDetails'
import { CurrencyContext } from '../utils/Currency'
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { DepositSuccess } from '../deposit/DepositSuccess'
import { DepositSummary } from '../deposit/DepositSummary'
import { Loading } from '../Loading/Loading'
import { BigNumber } from 'ethers'

interface DepositContainerProps {
    category: string;
    dimension: string;
    theme_contract_address: string;
    setActiveStage: Function;
    activeStage: string;
    setDepositSuccess: Function;
    depositSuccess: boolean;
}

export const DepositContainer = (props: DepositContainerProps) => {
    const { response: detfDataResponse, isLoading, isSuccess: detfDataSuccess } = GetAccountData(props.theme_contract_address)
    const [detfAccountData, setDETFAccountData] = useState<AccountData>()
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const [vsPrices, setVsPrices] = useState<any>({})
    const [depositAmount, setDepositAmount] = useState(BigNumber.from(0))
    const [timeLockAmount, setTimeLockAmount] = useState(0)
    const [showDepositDetails, setShowDepositDetails] = useState(true)

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    useEffect(() => {
        setDETFAccountData(detfDataResponse)
    }, [detfDataSuccess])
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        address: walletOwner,
    })

    if (detfDataSuccess && detfAccountData) {
        return (
            <>
                {showDepositDetails && !props.depositSuccess && <DepositDetails
                    detfAddress={detfAccountData.theme_contract_address}
                    timeLock={detfAccountData.time_lock}
                    timeLockRemaining={detfAccountData.time_lock_remaining}
                    category={detfAccountData.category}
                    dimension={detfAccountData.dimension}
                    walletBalance={walletBalance}
                    connector={connector}
                    currency={currency}
                    vsPrices={vsPrices}
                    setDepositAmount={setDepositAmount}
                    setTimeLockAmount={setTimeLockAmount}
                    setShowDepositDetails={setShowDepositDetails}
                    setActiveStage={props.setActiveStage}
                    activeStage={props.activeStage}
                />}
                {
                    !showDepositDetails && !props.depositSuccess && <DepositSummary
                        detfAddress={detfAccountData.theme_contract_address}
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
                        setActiveStage={props.setActiveStage}
                        setDepositSuccess={props.setDepositSuccess}
                        activeStage={props.activeStage}
                    />
                }
                {
                    props.depositSuccess && <DepositSuccess
                        category={detfAccountData.category}
                        dimension={detfAccountData.dimension}
                    />
                }
            </>)
    }

    return (
        <Loading />
    )
}