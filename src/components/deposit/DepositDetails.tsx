import { useState, ChangeEvent, useEffect } from 'react'
import DateTypeDropDown from '../dropdowns/DateTypeDropdown'
import { FormatCurrency } from '../utils/Currency'
import { Button } from '../Buttons'
import "./DepositDetails.css"

interface DepositDetails {
    detfAddress: string;
    category: string;
    dimension: string;
    timeLock: number;
    timeLockRemaining: number;
    walletBalance: any;
    connector: any;
    vsPrices: any;
    currency: string;
    setDepositAmount: Function;
    setTimeLockAmount: Function;
    setShowDepositDetails: Function;
    setActiveStage: Function;
    activeStage: string;
}

export const DepositDetails = (props: DepositDetails) => {
    const moment = require('moment')
    const [checkboxTickNew, setCheckboxTickNew] = useState(false)
    const [checkboxTickExisting, setCheckboxTickExisting] = useState(false)
    const [depositInputValue, setdepositInputValue] = useState("0")
    const [timeLockInputValue, settimeLockInputValue] = useState("0")

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

    const GetTimeLockInputValueInSeconds = () => {
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

    const GetTimeToUnlock = (timeToUnlock: number) => {
        if (timeToUnlock > 0) {
            let now = moment().unix()
            let lockedUntil = moment.unix(now + timeToUnlock).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
            return lockedUntil
        }
        return 0
    }

    const GetTimeLockUnlockIncrease = (timeToUnlock: number) => {
        if (timeToUnlock > 0) {
            let lockedUntil = moment.unix(props.timeLock + timeToUnlock).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
            return lockedUntil
        }
        return 0
    }

    const walletBalanceCurrency = FormatCurrency(props.walletBalance.value ?
        (Number(props.walletBalance.value)
            / 10 ** 18 *
            (() => {
                switch (props.currency) {
                    case "AUD": return (props.vsPrices.aud)
                    case "BNB": return (props.vsPrices.bnb)
                    case "CNY": return (props.vsPrices.cny)
                    case "EURO": return (props.vsPrices.eur)
                    case "IDR": return (props.vsPrices.idr)
                    case "JPY": return (props.vsPrices.jpy)
                    case "KRW": return (props.vsPrices.krw)
                    case "RUB": return (props.vsPrices.rub)
                    case "TWD": return (props.vsPrices.twd)
                    case "USD": return (props.vsPrices.usd)
                }
            })()) : 0, 2)

    const ConvertDepositValue = () => {
        const depositAmount = (10 ** 18 * Number(depositInputValue)).toString()
        return depositAmount
    }

    const ConvertTimeLockValue = () => {
        let timeLock = 0
        // Set lock value for the first time
        if (props.timeLock === 0 && Number(timeLockInputValue) > 0) {
            timeLock = (moment().unix() + GetTimeLockInputValueInSeconds())
            //console.log("Set new value")
        }

        //Increase the lock value
        if (props.timeLock > 0 && Number(timeLockInputValue) > 0) {
            timeLock = (props.timeLock + GetTimeLockInputValueInSeconds())
            //console.log("Increase lock value")
        }

        //Return the existing lock value
        if (props.timeLock > 0 && Number(timeLockInputValue) === 0) {
            timeLock = props.timeLock
            //console.log("Existing time lock has not changed")
        }
        //console.log(Number(timeLock))
        return timeLock
    }

    return (
        <div className="deposit-box">
            <div className="deposit-box-container">
                <h2>Available {props.walletBalance?.symbol} in your {props.connector?.name} is {parseFloat((props.walletBalance.formatted).toString()).toFixed(4)} ({walletBalanceCurrency})</h2>
                <div className="deposit-box-form">
                    <div className="deposit-amount-input-title">{props.walletBalance?.symbol} amount:</div>
                    <div><input className="deposit-amount-input" type="number" value={depositInputValue} onChange={onChangeDeposit} placeholder="BNB 10.000" min="0" /></div>
                    <div className="timelock">
                        {props.timeLockRemaining === 0 && <div className="timelock-new">
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
                                    <input className="timelock-amount-input" type="number" value={timeLockInputValue} onChange={onChangeTimeLock} placeholder="12 months" min="0" />
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
                                    <p>Withdrawals from your investment theme will be locked until:</p>
                                    <b>{GetTimeToUnlock(Number(GetTimeLockInputValueInSeconds()))}</b>
                                </div>
                            </div>
                        </div>}
                        {props.timeLockRemaining > 0 && <div className="timelock-existing">
                            <div className="timelock-existing-message">
                                Your investment theme is currently locked from withdrawals until:
                                <b>{GetTimeToUnlock(props.timeLockRemaining)}</b>
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
                                <ul className="timelock-amount-input-group">
                                    <li><input className="timelock-amount-input" type="number" value={timeLockInputValue} onChange={onChangeTimeLock} placeholder="12 months" min="0" /></li>
                                    <li><button
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
                                    </button></li>
                                </ul>
                                <div className={Number(timeLockInputValue) > 0 ? "deposit-lock-set" : "deposit-lock-set-inactive"}>
                                    <p>Withdrawals from your investment theme will be locked until:</p>
                                    <div className="deposit-lock-set-lock-date">{GetTimeLockUnlockIncrease(Number(GetTimeLockInputValueInSeconds()))}</div>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className="deposit-details-button">
                        {(Number(depositInputValue) >= 0 && Number(timeLockInputValue) >= 0) && <Button buttonStyle="primary" buttonSize="standard-long" text="View investment summary" onClick={() => {
                            props.setDepositAmount(ConvertDepositValue());
                            props.setTimeLockAmount(ConvertTimeLockValue());
                            props.setShowDepositDetails(false);
                            props.setActiveStage(props.activeStage === "establish-deposit-details" ? "establish-deposit-summary" : "deposit-summary")
                        }} />}
                        {(Number(depositInputValue) < 0 || Number(timeLockInputValue) < 0) && <Button buttonStyle="primary" buttonSize="standard-long" text="View investment summary" status="disabled" />}
                    </div>
                </div>
            </div>
        </div>
    )
}