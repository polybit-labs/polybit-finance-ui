import { useState, ChangeEvent } from 'react'
import "./DepositDetailsBox.css"
import { useLocation } from 'react-router-dom'
import PolybitDETFInterface from "../chain_info/IPolybitDETF.json"
import { Interface, parseUnits } from 'ethers/lib/utils'

import {
    useBalance,
    useContractRead,
    usePrepareContractWrite,
    useContractWrite
} from "wagmi"
import DateTypeDropDown from './DateTypeDropdown'



interface DepositDetailsBoxProps {
    detfName: string;
    detfOracleAddress: string;
    detfFactoryAddress: string[];
    IPolybitDETFFactory: Interface;
    walletOwner: string | undefined;
    detfAddress: string;
    connectorName: string | undefined;
    prepDepositSummary: Function;
}

const DepositBox = (props: DepositDetailsBoxProps) => {
    const location = useLocation()
    const { data: walletBalance } = useBalance({
        addressOrName: props.walletOwner,
    })
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const [depositInputValue, setdepositInputValue] = useState("0")
    const [timeLockInputValue, settimeLockInputValue] = useState("0")
    const [checkboxTickNew, setCheckboxTickNew] = useState(false)
    const [checkboxTickExisting, setCheckboxTickExisting] = useState(false)

    const moment = require('moment')

    const onChangeDeposit = (e: ChangeEvent<HTMLInputElement>) => {
        setdepositInputValue(e.target.value);
        console.log("Deposit", depositInputValue)

    }

    const onChangeTimeLock = (e: ChangeEvent<HTMLInputElement>) => {
        settimeLockInputValue(e.target.value);
    }

    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectDateFormat, setDateFormat] = useState<string>("Years");
    const dateFormats = () => {
        return ["Days", "Months", "Years"];
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

    function GetTimeLockRemainingOfDETF(detfAddress: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTimeLockRemaining"
        })
        const timeLockRemaining = data ? data : 0
        return timeLockRemaining
    }

    let lockTimeLeftOfDETF = GetTimeLockRemainingOfDETF(props.detfAddress)

    function GetUnlockTimeOfDETF() {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: props.detfAddress,
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

    const { config: detfDepositConfig, error: detfDepositError } = usePrepareContractWrite({
        addressOrName: props.detfAddress,
        contractInterface: IPolybitDETF,
        functionName: 'deposit',
        args: [Number(timeLockValue)],
        overrides: { from: props.walletOwner, value: Number(depositInputValue) > 0 ? parseUnits(depositInputValue).toString() : 0 }
    })

    const { write: detfDeposit } = useContractWrite(detfDepositConfig)



    return (
        <div className="deposit-details-container">
            <div className="deposit-details-box">
                <div className="deposit-details-box-balance"><img className="chain-logo" src={require("../assets/images/binance-icon-circle.png")} alt="Binance Smart Chain"></img>Available {walletBalance?.symbol} in your {props.connectorName} is {parseFloat((walletBalance ? walletBalance.formatted : 0).toString()).toFixed(4)} (USD:$xxx)</div>
                <div className="deposit-details-box-notification"><p>{walletBalance?.symbol} is required to invest in the {props.detfName}, but you do not currently have any BNB in your {props.connectorName}. [insert Banxa or CB speil]</p></div>
                <div className="deposit-details-box-form">
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
                                <b>{GetTimeToUnlock(Number(GetTimeLockRemainingOfDETF(props.detfAddress)))}</b>
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
                        <button className="deposit-button-primary" disabled={Number(depositInputValue) === 0} onClick={() => props.prepDepositSummary()}>View investment summary</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DepositBox