import { useState, ChangeEvent } from 'react'
import "./Deposit.css"
import { Link } from 'react-router-dom'
import { truncateAddress } from '../../utils'
import { useLocation } from 'react-router-dom'
import PolybitDETFInterface from "../../chain-info/IPolybitDETF.json"
import { Interface, parseUnits } from 'ethers/lib/utils'
import Title from "../Title"
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
import DateTypeDropDown from '../DateTypeDropdown'
import { Progress } from '../Progress'
import ContentBox from '../ContentBox'
import { OwnedDETFCount } from '../OwnedDETFCount'

function Deposit() {
    const ethers = require("ethers")
    const utils = ethers.utils
    const location = useLocation()
    const [title, setTitle] = useState("Your investment amount")
    const { detfName, detfAddress, processOrigin, activeStage } = location.state
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
    const ownedDETFCount = OwnedDETFCount()
    const onChangeDeposit = (e: ChangeEvent<HTMLInputElement>) => {
        setdepositInputValue(e.target.value);
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

    const { config: detfDepositConfig, error: detfDepositError } = usePrepareContractWrite({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: 'deposit',
        args: [Number(timeLockValue)],
        overrides: { from: walletOwner, value: Number(depositInputValue) > 0 ? parseUnits(depositInputValue).toString() : 0 }
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
            <Title title={title} info={`You are about to deposit funds from your address ${truncateAddress(walletOwner ? walletOwner : "")} into the ${detfName} DETF using ${connector?.name}.`}
                switchButton={false} />
            <Progress processOrigin={processOrigin} activeStage={internalActiveStage} />
            <ContentBox>
                <div>
                    <div className={!depositSuccess && depositStage === "input" ? "deposit-box" : "deposit-box-inactive"}>
                        <div className="deposit-box-balance"><img className="chain-logo" src={require("../../assets/images/bsc-logo.png")} alt="Binance Smart Chain"></img>Available {walletBalance?.symbol} in your {connector?.name} is {parseFloat((walletBalance ? walletBalance.formatted : 0).toString()).toFixed(4)} (USD:$xxx)</div>
                        <div className="deposit-box-notification"><p>{walletBalance?.symbol} is required to invest in the {detfName}, but you do not currently have any BNB in your {connector?.name}. [insert Banxa or CB speil]</p></div>
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
                                <button className="deposit-button-primary" disabled={Number(depositInputValue) === 0} onClick={() => { setTitle("Finalizing your investment"); setDepositStage("summary"); setInternalActiveStage(activeStage + 1) }}>View investment summary</button>
                            </div>
                        </div>
                    </div>
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
                                    <li>{detfName}</li>
                                    <li>{chain?.name}</li>
                                    <li>{walletBalance?.symbol} {depositInputValue} {"(USD $302)"}</li>
                                    <li>0.05%</li> {/* get from detf factory */}
                                    <li>{prettyTimeLockValue}</li>
                                    <li>{walletOwner}</li>
                                </ul>
                            </div>
                        </div>
                        <button className="deposit-confirmation-button-primary" onClick={() => detfDeposit?.()}>Finalize and commit funds</button>
                        <div className="deposit-back-button" onClick={() => { setDepositStage("input"); setInternalActiveStage(activeStage) }}>Make changes to investment setup</div>
                    </div>
                    <div className={transactionLoading ? "confirming-detf-wrapper" : "confirming-detf-wrapper-inactive"}>
                        {transactionLoading && (<div>Waiting for confirmation from the blockchain...</div>)}
                    </div>
                    <div className={depositSuccess ? "success-detf-wrapper" : "success-detf-wrapper-inactive"}>
                        <div>Congratulations, your deposit of BNB X into {detfName} DETF has been confirmed on the blockchain.</div>
                        <Link className="success-deposit-button-link" to="/account" state={{ detfCount: { ownedDETFCount } }}>
                            <button className="success-deposit-button">Go To My Account</button></Link>
                        {/* 
                        validate the deposit amount is available - transactionrecipt emit event */}
                    </div>
                </div>
            </ContentBox>
            <Footer />
        </>
    )
}

export default Deposit