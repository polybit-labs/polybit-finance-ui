import { useState, ChangeEvent, useEffect } from 'react'
import "./pages/Deposit.css"
import { Link } from 'react-router-dom'
import PolybitDETFInterface from "../chain_info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'
import Title from "./containers/Title"
import SubTitle from "./containers/SubTitle"

import {
    useAccount,
    useNetwork,
    useBalance,
    useContractRead,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction
} from "wagmi"
import { Progress } from './Progress'
import { GetOrderData } from './api/GetOrderData'
import { FormatCurrency } from './utils/Currency'
import { Button } from './Button'
import ContentBoxContainer from './containers/ContentBox'

interface DepositSummary {
    detfAddress: string;
    category: string;
    dimension: string;
    timeLock: number;
    walletBalance: any;
    connector: any;
    vsPrices: any;
    currency: string;
    depositAmount: string;
    timeLockAmount: number;
    setShowDepositDetails: Function;
    setInternalActiveStage: Function;
    setDepositSuccess: Function;
}

export const DepositSummary = (props: DepositSummary) => {
    const ethers = require("ethers")
    const utils = ethers.utils
    const moment = require('moment')
    const [title, setTitle] = useState("Finalizing your investment")
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain } = useNetwork()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })

    const [orderData, setOrderData] = useState<Array<any>>();
    const { response: detfOrderData, isLoading: orderDataLoading, isSuccess: orderDataSuccess } = GetOrderData(props.detfAddress, props.depositAmount)

    useEffect(() => {
        setOrderData(detfOrderData ? detfOrderData : [])
    }, [detfOrderData, orderDataSuccess])

    const [depositStage, setDepositStage] = useState("summary")

    const PrettyTimeLockValue = () => {
        // Set lock value for the first time
        if (props.timeLock === 0 && props.timeLockAmount > 0) {
            return moment.unix(props.timeLockAmount).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }

        //Increase the lock value
        if (props.timeLock > 0 && props.timeLockAmount > 0) {
            return moment.unix(props.timeLockAmount).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }

        //Return the existing lock value
        if (props.timeLock > 0 && props.timeLockAmount === 0) {
            return moment.unix(props.timeLock).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }
        return "No time lock set"
    }

    let prettyTimeLockValue = PrettyTimeLockValue()

    console.log("orderdata", orderData)
    console.log("timelock", props.timeLockAmount === props.timeLock ? 0 : props.timeLockAmount)
    console.log("deposit amount", props.depositAmount)

    const { config: detfDepositConfig, error: detfDepositError } = usePrepareContractWrite({
        addressOrName: props.detfAddress,
        contractInterface: IPolybitDETF,
        functionName: 'deposit',
        args: [props.timeLockAmount === props.timeLock ? 0 : props.timeLockAmount, orderData],
        overrides: { from: walletOwner, value: props.depositAmount },
        onError(error) {
            console.log('detfDepositConfig Error', error)
        },
        onSuccess(data) {
            console.log('detfDepositConfig Success', data)
        },
    })

    const { data, isLoading, isSuccess, write: detfDeposit } = useContractWrite(detfDepositConfig)

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            console.log(data)
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            console.log(confirmedAmount)
            console.log(props.depositAmount)
            console.log("Amount confirmations", confirmedAmount, props.depositAmount)
            if (confirmedAmount === props.depositAmount) {
                props.setDepositSuccess(true)
            }
        }
    })

    const depositAmountFormatted = parseFloat((Number(props.depositAmount) / 10 ** 18).toString()).toFixed(4)
    const depositAmountCurrency = FormatCurrency(props.depositAmount ?
        (Number(props.depositAmount)
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

    return (
        <ContentBoxContainer>
            <div>
                {!transactionSuccess && <div className="deposit-summary">
                    <p>Polybit PGT20 aims to track the performance of an index (before fees and expenses) comprising 20 of the largest governance assets by liquidity on the Binance chain. The smart contract you generate at the time of investment will automatically facilitate ongoing trades to maintain pooled asset positions, as asset positions shift, leave, or enter the pool over time.
                        Your holdings will rebalance through automated buys and sells over time to maintain a reflection of the top assets in this fund. Holding weighting is determined according to oracle data including, but not limited to, market capitalisation and daily trading volume. Assets that do not meet our risk criteria for certification or minimum liquidity thresholds may be excluded from pool inclusion. Learn more about our pool policies.</p>
                    <div className="deposit-summary-info">
                        <div className="deposit-summary-info-bar"></div>
                        <div className="deposit-summary-info-titles">
                            <ul>
                                <li>Category</li>
                                <li>Dimension</li>
                                <li>Chain</li>
                                <li>Investment</li>
                                <li>Deposit Fee</li>
                                <li>Time Locked</li>
                                <li>Your Wallet Address</li>
                            </ul>
                        </div>
                        <div className="deposit-summary-info-results">
                            <ul>
                                <li>{props.category}</li>
                                <li>{props.dimension}</li>
                                <li>{chain?.name}</li>
                                <li>{`${walletBalance?.symbol} ${depositAmountFormatted} (${depositAmountCurrency})`}</li>
                                <li>0.05%</li>
                                <li>{prettyTimeLockValue}</li>
                                <li>{walletOwner}</li>
                            </ul>
                        </div>
                    </div>
                    {orderDataLoading && (<img height="90px" width="90px" src={require("../assets/images/loading.gif")} alt="Loading"></img>)}
                    {orderDataSuccess && (<button className="deposit-confirmation-button-primary" disabled={!detfDeposit} onClick={() => detfDeposit?.()}>Finalize and commit funds</button>)}
                    <div className="deposit-back-button" onClick={() => { setDepositStage("input"); props.setShowDepositDetails(true); props.setInternalActiveStage(1) }}>Make changes to investment setup</div>
                </div>}
                {transactionLoading && <div className="confirming-detf-wrapper">
                    <img height="90px" width="90px" src={require("../assets/images/loading.gif")} alt="Loading"></img>
                </div>}
            </div>
        </ContentBoxContainer>
    )
}