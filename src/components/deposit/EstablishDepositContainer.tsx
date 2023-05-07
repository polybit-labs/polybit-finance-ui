import { useState, useEffect, useContext } from 'react'
import { useAccount, useBalance } from "wagmi"
import { DepositDetails } from '../deposit/DepositDetails'
import { CurrencyContext } from '../utils/Currency'
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { DepositSuccess } from '../deposit/DepositSuccess'
import { Loading } from '../Loading/Loading'
import { useLocation } from 'react-router-dom'
import { EstablishDepositSummary } from './EstablishDepositSummary'
import { BigNumber } from 'ethers'

interface Deposit {
    category: string;
    dimension: string;
    detfAddress: string;
    setActiveStage: Function;
    activeStage: string;
    setDepositSuccess: Function;
    depositSuccess: boolean;
}

export const EstablishDepositContainer = (props: Deposit) => {
    const location = useLocation()
    const { productId, category, dimension } = location.state
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const [vsPrices, setVsPrices] = useState<any>({})
    const [depositAmount, setDepositAmount] = useState(BigNumber.from(0))
    const [timeLockAmount, setTimeLockAmount] = useState(0)
    const [showDepositDetails, setShowDepositDetails] = useState(true)

    console.log(productId, category, dimension)

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        address: walletOwner,
    })

    if (walletBalance) {
        return (
            <>
                {showDepositDetails && !props.depositSuccess && <DepositDetails
                    detfAddress={""}
                    timeLock={0}
                    timeLockRemaining={0}
                    category={category}
                    dimension={dimension}
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
                    !showDepositDetails && !props.depositSuccess && <EstablishDepositSummary
                        timeLock={0}
                        productId={productId}
                        category={category}
                        dimension={dimension}
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
                        category={category}
                        dimension={dimension}
                    />
                }
            </>)
    }

    return (
        <Loading />
    )
}