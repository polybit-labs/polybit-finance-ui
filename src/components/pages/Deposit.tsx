import { useState, ChangeEvent } from 'react'
import "./Deposit.css"
import { Link } from 'react-router-dom'
import { TruncateAddress } from '../utils/Formatting'
import { useLocation } from 'react-router-dom'
import PolybitDETFInterface from "../../chain_info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'
import TitleContainer from "../containers/Title"
import SubTitleContainer from '../containers/SubTitle'
import MainContainer from '../containers/Main'
import ContentBoxContainer from '../containers/ContentBox'

import {
    useAccount,
    useNetwork,
    useBalance,
    useContractRead
} from "wagmi"
import Footer from './Footer'
import DateTypeDropDown from '../dropdowns/DateTypeDropdown'
import { Progress } from '../Progress'


function Deposit() {
    const location = useLocation()
    const [title, setTitle] = useState("Your investment amount")
    const { category, dimension, productId, detfAddress, processOrigin, activeStage } = location.state
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })
    const [depositStage, setDepositStage] = useState("input")
    const [depositInputValue, setdepositInputValue] = useState("0")
    const [timeLockInputValue, settimeLockInputValue] = useState("0")
    const [checkboxTickNew, setCheckboxTickNew] = useState(false)
    const [checkboxTickExisting, setCheckboxTickExisting] = useState(false)
    const [internalActiveStage, setInternalActiveStage] = useState(activeStage ? activeStage : 1)
    const moment = require('moment')
    const [depositSuccess, setDepositSuccess] = useState(false)
    const onChangeDeposit = (e: ChangeEvent<HTMLInputElement>) => {
        setdepositInputValue(e.target.value)
    }

    const onChangeTimeLock = (e: ChangeEvent<HTMLInputElement>) => {
        settimeLockInputValue(e.target.value)
    }

    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const [selectDateFormat, setDateFormat] = useState<string>("Years")
    const dateFormats = () => {
        return ["Days", "Months", "Years"]
    };

    const toggleDropDown = () => {
        setShowDropDown(!showDropDown);
    };

    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShowDropDown(false);
        }
    };

    const dateFormatSelection = (dateFormat: string): void => {
        setDateFormat(dateFormat);
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



    return (
        <>
            <TitleContainer title={title} />
            <SubTitleContainer info={`You are about to deposit funds from your address ${TruncateAddress(walletOwner ? walletOwner : "")} into the ${category} ${dimension} DETF using ${connector?.name}.`} />
            <Progress processOrigin={processOrigin} activeStage={internalActiveStage} />
            <MainContainer>
                <ContentBoxContainer>
                    <div>
                        <div className={!depositSuccess && depositStage === "input" ? "deposit-box" : "deposit-box-inactive"}>
                            <div className="deposit-box-balance"><img className="chain-logo" src={require("../../assets/images/bsc-logo.png")} alt="Binance Smart Chain"></img>Available {walletBalance?.symbol} in your {connector?.name} is {parseFloat((walletBalance ? walletBalance.formatted : 0).toString()).toFixed(4)} (USD:$xxx)</div>
                            <div className="deposit-box-notification"><p>{walletBalance?.symbol} is required to invest in the {category} {dimension}, but you do not currently have any BNB in your {connector?.name}. [insert Banxa or CB speil]</p></div>
                            <div className="deposit-box-form">
                                <div className="deposit-amount-input-title">{walletBalance?.symbol} amount:</div>
                                <div><input className="deposit-amount-input" type="number" value={depositInputValue} onChange={onChangeDeposit} placeholder="BNB 10.000" /></div>
                                <div className="timelock">
                                    <div className={Number(lockTimeLeftOfDETF) === 0 ? "timelock-new" : "timelock-new-inactive"}>
                                        <div className="timelock-selector">
                                            <div className={checkboxTickNew === false ? "timelock-checkbox" : "timelock-checkbox-ticked"}
                                                onClick={() => {
                                                    setCheckboxTickNew(!checkboxTickNew);
                                                    settimeLockInputValue("0")
                                                }}  ></div>
                                            <div>Time lock my DETF</div>
                                        </div>
                                        <div className={checkboxTickNew ? "timelock-new-inputs" : "timelock-new-inputs-inactive"}>
                                            <div className="timelock-amount-input-title">Lock term:</div>
                                            <div className="timelock-amount-input-group">
                                                <input className="timelock-amount-input" type="number" value={timeLockInputValue} onChange={onChangeTimeLock} placeholder="12 months" />
                                                <button
                                                    className="timelock-date-format"
                                                    onClick={(): void => toggleDropDown()}
                                                    onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                                                        dismissHandler(e)
                                                    }
                                                >
                                                    <div>{selectDateFormat ? selectDateFormat : "Select ..."} </div>
                                                    {showDropDown && (
                                                        <DateTypeDropDown
                                                            dateFormats={dateFormats()}
                                                            showDropDown={false}
                                                            toggleDropDown={(): void => toggleDropDown()}
                                                            dateFormatSelection={dateFormatSelection}
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                            <div className={Number(timeLockInputValue) > 0 ? "deposit-lock-set" : "deposit-lock-set-inactive"}>
                                                <p>Withdrawals from your DETF will be locked until:</p>
                                                <b>{GetTimeToUnlock(Number(GetTimeLockInputValueInSeconds()))}</b>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={Number(lockTimeLeftOfDETF) > 0 ? "timelock-existing" : "timelock-existing-inactive"}>
                                        <div className="timelock-existing-message">
                                            Your DETF is currently locked from withdrawals until:
                                            <b>{GetTimeToUnlock(Number(GetTimeLockRemainingOfDETF(detfAddress)))}</b>
                                        </div>
                                        <div className="timelock-selector">
                                            <div className={checkboxTickExisting === false ? "timelock-checkbox" : "timelock-checkbox-ticked"}
                                                onClick={() => {
                                                    setCheckboxTickExisting(!checkboxTickExisting);
                                                    settimeLockInputValue("0")
                                                }} ></div>
                                            <div>Increase lock time</div>
                                        </div>
                                        <div className={checkboxTickExisting ? "timelock-existing-inputs" : "timelock-existing-inputs-inactive"}>
                                            <div className="timelock-amount-input-title">Lock term:</div>
                                            <div className="timelock-amount-input-group">
                                                <input className="timelock-amount-input" type="number" value={timeLockInputValue} onChange={onChangeTimeLock} placeholder="12 months" />
                                                <button
                                                    className="timelock-date-format"
                                                    onClick={(): void => toggleDropDown()}
                                                    onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                                                        dismissHandler(e)
                                                    }
                                                >
                                                    <div>{selectDateFormat ? selectDateFormat : "Select ..."} </div>
                                                    {showDropDown && (
                                                        <DateTypeDropDown
                                                            dateFormats={dateFormats()}
                                                            showDropDown={false}
                                                            toggleDropDown={(): void => toggleDropDown()}
                                                            dateFormatSelection={dateFormatSelection}
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                            <div className={Number(timeLockInputValue) > 0 ? "deposit-lock-set" : "deposit-lock-set-inactive"}>
                                                <p>Withdrawals from your DETF will be locked until:</p>
                                                <div className="deposit-lock-set-lock-date">{GetTimeLockUnlockIncrease(Number(GetTimeLockInputValueInSeconds()))}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Link className="success-deposit-summary-button-link" to="/deposit-summary" state={{ category: category, dimension: dimension, productId: productId.toString(), detfAddress: detfAddress, processOrigin: "establish", activeStage: 2, depositInputValue: depositInputValue, timeLockInputValue: timeLockInputValue }}>
                                        <button className="success-deposit-button">View investment summary</button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentBoxContainer>
            </MainContainer>
            <Footer />
        </>
    )
}

export default Deposit