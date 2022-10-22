import Footer from './Footer'
import "./Account.css"
import { getNumValueColor, truncateAddress } from '../../utils'
import { Link, useLocation } from 'react-router-dom'
import PolybitDETFFactoryInterface from "../../chain-info/IPolybitDETFFactory.json"
import PolybitDETFInterface from "../../chain-info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'
import map from "../../chain-info/map.json"
import {
    useAccount,
    useNetwork,
    useBalance,
    useContractRead
} from "wagmi"
import Table from '../AccountTable'
import Title from '../Title'
import { useEffect, useState } from 'react'

function Account() {
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const { data } = useBalance({
        addressOrName: walletOwner,
    })
    const detfFactoryAddress: Array<string> = map["5777"]["detf_factory"]
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
    const IPolybitDETF = new Interface(PolybitDETFInterface)

    const { data: ownedDETFs, isError, isLoading } = useContractRead({
        addressOrName: detfFactoryAddress[0],
        contractInterface: IPolybitDETFFactory,
        functionName: "getDETFAccounts",
        args: [walletOwner],
    })

    const previousCount = ownedDETFs ? ownedDETFs.length : 0
    const location = useLocation()
    const { detfCount } = location.state

    useEffect(() => {
        if (detfCount > previousCount) {
            window.location.reload();
        }
    }, [detfCount])

    const [ownedDETFData, setOwnedDETFData] = useState(ownedDETFs)

    useEffect(() => {
        const data = ownedDETFs ? ownedDETFs : []
        setOwnedDETFData(data)
    }, [ownedDETFs])

    function GetBalanceOfDETF(detfAddress: string) {
        const { data, isError, isLoading, isSuccess } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTotalBalanceInWeth"
        })
        const balance = data ? data : 0
        return balance
    }

    function GetTotalPortfolioWorth() {
        let totalBalance = 0
        ownedDETFData?.map((index: string) => {
            totalBalance = totalBalance + Number(GetBalanceOfDETF(index))
        })
        return totalBalance
    }

    let totalPortfolioWorth = GetTotalPortfolioWorth()

    function GetDepositedOfDETF(detfAddress: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTotalDeposited"
        })
        const deposited = data ? data : 0
        return deposited
    }

    function GetTotalDeposits() {
        let deposits = 0
        ownedDETFs?.map(index => {
            deposits = deposits + Number(GetDepositedOfDETF(index))
        })
        return deposits > 0 ? deposits : 0
    }

    let totalDeposited = GetTotalDeposits()

    function GetTotalReturnOfDETF(detfAddress: string) {
        const totalReturn = (totalPortfolioWorth - totalDeposited)
        return totalReturn
    }

    function GetTotalReturn() {
        let returns = 0
        ownedDETFs?.map(index => {
            returns = returns + Number(GetTotalReturnOfDETF(index))
        })
        return returns > 0 ? returns : 0
    }

    let totalReturn = GetTotalReturn()

    function GetTotalReturnPercentage() {
        let totalReturnPerc = totalReturn / totalDeposited
        return totalReturnPerc > 0 ? totalReturnPerc : 0
    }

    let totalReturnPercentage = GetTotalReturnPercentage()


    if (isConnected) {
        return (
            <>
                <Title title="Account" info={`You are currently connected to ${truncateAddress(walletOwner ? walletOwner : "")} on the ${chain?.name} network via ${connector?.name}.`}
                    switchButton={true} />
                <div className="account-summary">
                    <div className="account-summary-container">
                        <div className="account-summary-wrapper">
                            <ul className="account-summary-items">
                                <li className="account-summary-item">
                                    <div className="portfolio-box-title">
                                        <div className="portfolio-box-title-text">Total portfolio worth</div>
                                        <div className="portfolio-box-title-context">As of datestamp</div></div>
                                    <div className="portfolio-box-balance">{data?.symbol} {parseFloat(Number(totalPortfolioWorth / 10 ** 18).toString()).toFixed(4)}</div>
                                </li>
                                <li className="account-summary-item">
                                    <div className="return-box-title">
                                        <div><div className="return-box-title-text">Total return</div>
                                            <div className="return-box-title-context">As of datestamp</div></div>
                                        <div className="return-box-title-percentage" style={{ color: getNumValueColor(totalReturnPercentage) }}>{parseFloat(Number(totalReturnPercentage).toString()).toFixed(2)}%</div>
                                    </div>
                                    <div className="return-box-balance">{data?.symbol} {parseFloat(Number(totalReturn / 10 ** 18).toString()).toFixed(4)}</div>
                                </li>
                                <li className="account-summary-item">
                                    <div className="wallet-box-title">
                                        <div className="wallet-box-title-text">Available funds</div>
                                        <div className="wallet-box-title-context">in {connector?.name}</div></div>
                                    <div className="wallet-box-balance">{data?.symbol} {parseFloat((data ? data.formatted : 0).toString()).toFixed(4)}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Table />
                </div>
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