import { useState, ChangeEvent, useEffect } from 'react'
import "./Deposit.css"
import { Link } from 'react-router-dom'
import { TruncateAddress } from '../utils/Formatting'
import { useLocation } from 'react-router-dom'
import PolybitDETFInterface from "../../chain_info/IPolybitDETF.json"
import { Interface, parseUnits } from 'ethers/lib/utils'
import Title from "../containers/Title"
import SubTitle from "../containers/SubTitle"
import MainContainer from '../containers/Main'
import ContentBox from '../containers/ContentBox'
import {
    useAccount,
    useNetwork,
    useBalance,
    useContractRead,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction
} from "wagmi"
import Footer from './Footer'
import { Progress } from '../Progress'

import { GetOrderData } from '../api/GetOrderData'

function DepositSummary() {
    const ethers = require("ethers")
    const utils = ethers.utils
    const location = useLocation()
    const [title, setTitle] = useState("Finalizing your investment")
    const { category, dimension, productId, detfAddress, processOrigin, activeStage, depositInputValue, timeLockInputValue } = location.state
    console.log(depositInputValue)
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })

    const [orderData, setOrderData] = useState<Array<any>>();
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    const wethAmount = Math.round(10 ** 18 * depositInputValue).toString()

    console.log("detfAddress", detfAddress, "rpc", rpc, "weth", wethAmount)

    const { response: detfOrderData, isLoading: orderDataLoading, isSuccess: orderDataSuccess } = GetOrderData(detfAddress, wethAmount)

    useEffect(() => {
        setOrderData(detfOrderData ? detfOrderData : [])
    }, [orderDataLoading, orderDataSuccess])

    const [depositStage, setDepositStage] = useState("summary")
    const [internalActiveStage, setInternalActiveStage] = useState(activeStage ? activeStage : 1)
    const moment = require('moment')
    const [depositSuccess, setDepositSuccess] = useState(false)

    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectDateFormat, setDateFormat] = useState<string>("Years");
    const dateFormats = () => {
        return ["Days", "Months", "Years"];
    };

    /* 
    Validate that the address passed in props is owned by the wallet
    */

    function GetTimeNowInUnix() {
        let now = moment().unix()
        return now
    }

    function GetTimeLockInputValueInSeconds() {
        if (selectDateFormat === "Days") {
            return Number(timeLockInputValue) * 86400
        }
        if (selectDateFormat === "Months") {
            return Number(timeLockInputValue) * (86400 * 30)
        }
        if (selectDateFormat === "Years") {
            return Number(timeLockInputValue) * (86400 * 365)
        }
        return 0
    }
    /*     console.log(Number(depositInputValue) > 0 ? parseUnits(depositInputValue).toString() : 0)
     */

    function GetTimeLockRemainingOfDETF(detfAddress: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTimeLockRemaining"
        })
        const timeLockRemaining = data ? data : 0
        return timeLockRemaining
    }

    let lockTimeLeftOfDETF = GetTimeLockRemainingOfDETF(detfAddress)

    function GetUnlockTimeOfDETF() {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTimeLock"
        })
        const unlockTime = data ? data : 0
        return unlockTime
    }

    let unlockTimeOfDETF = GetUnlockTimeOfDETF()

    function GetTimeToUnlock(timeToUnlock: number) {
        if (timeToUnlock > 0) {
            let now = moment().unix()
            let lockedUntil = moment.unix(now + timeToUnlock).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
            return lockedUntil
        }
        return 0
    }

    function GetTimeLockUnlockIncrease(timeToUnlock: number) {
        if (timeToUnlock > 0) {
            let lockedUntil = moment.unix(Number(unlockTimeOfDETF) + timeToUnlock).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
            return lockedUntil
        }
        return 0
    }

    function SetTimeLockValue() {
        let timeLock = 0
        // Set lock value for the first time
        if (Number(unlockTimeOfDETF) === 0 && Number(timeLockInputValue) > 0) {
            timeLock = (Number(GetTimeNowInUnix()) + GetTimeLockInputValueInSeconds())
            console.log("Set new value")
        }

        //Increase the lock value
        if (Number(unlockTimeOfDETF) > 0 && Number(timeLockInputValue) > 0) {
            timeLock = (Number(unlockTimeOfDETF) + GetTimeLockInputValueInSeconds())
            console.log("Increase lock value")
        }

        //Return the existing lock value
        if (Number(unlockTimeOfDETF) > 0 && Number(timeLockInputValue) === 0) {
            timeLock = Number(unlockTimeOfDETF)
            console.log("Existing time lock has not changed")
        }
        console.log(Number(timeLock))
        return timeLock
    }

    let timeLockValue = SetTimeLockValue()

    function PrettyTimeLockValue() {
        // Set lock value for the first time
        if (Number(unlockTimeOfDETF) === 0 && Number(timeLockInputValue) > 0) {
            return moment.unix((Number(GetTimeNowInUnix()) + GetTimeLockInputValueInSeconds())).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }

        //Increase the lock value
        if (Number(unlockTimeOfDETF) > 0 && Number(timeLockInputValue) > 0) {
            return moment.unix((Number(unlockTimeOfDETF) + GetTimeLockInputValueInSeconds())).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }

        //Return the existing lock value
        if (Number(unlockTimeOfDETF) > 0 && Number(timeLockInputValue) === 0) {
            return moment.unix(Number(unlockTimeOfDETF)).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }
        return "No time lock set"
    }

    let prettyTimeLockValue = PrettyTimeLockValue()
    const depositAmount = (10 ** 18 * depositInputValue).toString()

    const { config: detfDepositConfig, error: detfDepositError } = usePrepareContractWrite({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: 'deposit',
        args: [Number(0), orderData],
        overrides: { from: walletOwner, value: depositAmount },
        onError(error) {
            console.log('detfDepositConfig Error', error)
        },
        onSuccess(data) {
            console.log('detfDepositConfig Success', data)
        },
    })

    const { data, isLoading, isSuccess, write: detfDeposit } = useContractWrite(detfDepositConfig)

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            console.log(data)
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            console.log(confirmedAmount)
            console.log(parseUnits(depositInputValue).toString())
            if (confirmedAmount === parseUnits(depositInputValue).toString()) {
                setDepositSuccess(true)
            }
        }
    })

    return (
        <>
            <Title title={title} />
            <SubTitle info={`You are about to deposit funds from your address ${TruncateAddress(walletOwner ? walletOwner : "")} into the ${category} ${dimension} DETF using ${connector?.name}.`} />
            <Progress processOrigin={processOrigin} activeStage={internalActiveStage} />
            <MainContainer>
                <ContentBox>
                    <div>
                        <div className={!depositSuccess && !transactionLoading && depositStage === "summary" ? "deposit-summary" : "deposit-summary-inactive"}>
                            <p>Polybit PGT20 aims to track the performance of an index (before fees and expenses) comprising 20 of the largest governance assets by liquidity on the Binance chain. The smart contract you generate at the time of investment will automatically facilitate ongoing trades to maintain pooled asset positions, as asset positions shift, leave, or enter the pool over time.
                                Your holdings will rebalance through automated buys and sells over time to maintain a reflection of the top assets in this fund. Holding weighting is determined according to oracle data including, but not limited to, market capitalisation and daily trading volume. Assets that do not meet our risk criteria for certification or minimum liquidity thresholds may be excluded from pool inclusion. Learn more about our pool policies.</p>
                            <div className="deposit-summary-info">
                                <div className="deposit-summary-info-bar"></div>
                                <div className="deposit-summary-info-titles">
                                    <ul>
                                        <li>DETF Strategy</li>
                                        <li>Ecosystem</li>
                                        <li>Investment</li>
                                        <li>Deposit Fee</li>
                                        <li>Time Locked</li>
                                        <li>Your Wallet Address</li>
                                    </ul>
                                </div>
                                <div className="deposit-summary-info-results">
                                    <ul>
                                        <li>{category}</li>
                                        <li>{chain?.name}</li>
                                        <li>{walletBalance?.symbol} {depositInputValue} {"(USD $302)"}</li>
                                        <li>0.05%</li> {/* get from detf factory */}
                                        <li>{prettyTimeLockValue}</li>
                                        <li>{walletOwner}</li>
                                    </ul>
                                </div>
                            </div>
                            {orderDataLoading && (<img height="90px" width="90px" src={require("../../assets/images/loading.gif")} alt="Loading"></img>)}
                            {orderDataSuccess && (<button className="deposit-confirmation-button-primary" disabled={!detfDeposit} onClick={() => detfDeposit?.()}>Finalize and commit funds</button>)}
                            <div className="deposit-back-button" onClick={() => { setDepositStage("input"); setInternalActiveStage(activeStage) }}>Make changes to investment setup</div>
                        </div>
                        <div className={transactionLoading ? "confirming-detf-wrapper" : "confirming-detf-wrapper-inactive"}>
                            {transactionLoading && (<div>Waiting for confirmation from the blockchain...</div>)}
                        </div>
                        <div className={depositSuccess ? "success-detf-wrapper" : "success-detf-wrapper-inactive"}>
                            <div>Congratulations, your deposit of BNB X into {category} {dimension} DETF has been confirmed on the blockchain.</div>
                            <Link className="success-deposit-button-link" to="/account">
                                <button className="success-deposit-button">Go To My Account</button></Link>
                        </div>
                    </div>
                </ContentBox>
            </MainContainer>
            <Footer />
        </>
    )
}

export default DepositSummary