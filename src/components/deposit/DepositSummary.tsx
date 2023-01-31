import { useState, useEffect } from 'react'
import "./DepositSummary.css"
import PolybitDETFInterface from "../../chain_info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'
import {
    useAccount,
    useNetwork,
    useBalance,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction
} from "wagmi"
import { GetOrderData } from '../api/GetOrderData'
import { FormatCurrency } from '../utils/Currency'
import { Button, TextLink } from '../Buttons'
import { Loading } from '../Loading'
import { TruncateAddress } from '../utils/Formatting'

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
    setDepositSuccess: Function;
    setActiveStage: Function;
    activeStage: string;
}

export const DepositSummary = (props: DepositSummary) => {
    const ethers = require("ethers")
    const utils = ethers.utils
    const moment = require('moment')
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

    const { config: detfDepositConfig, error: detfDepositError, isSuccess: prepareContractWriteSuccess, isLoading: prepareContractWriteLoading } = usePrepareContractWrite({
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

    const { data, isLoading: contractWriteLoading, isSuccess, write: detfDeposit } = useContractWrite(detfDepositConfig)

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
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

    if (!prepareContractWriteSuccess) {
        return (
            <Loading loadingMsg="Preparing your deposit" />
        )
    }

    if (!transactionLoading && prepareContractWriteSuccess) {
        return (
            <div className="deposit-summary">
                <div className="deposit-summary-container">
                    <div className="deposit-summary-info">
                        <div className="deposit-summary-info-bar"></div>
                        <table className="deposit-summary-table">
                            <tbody>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">DETF</td>
                                    <td className="deposit-summary-table-cell-contents">{props.category} {props.dimension}</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Blockchain</td>
                                    <td className="deposit-summary-table-cell-contents">{chain?.name}</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Deposit Fee</td>
                                    <td className="deposit-summary-table-cell-contents">0.5%</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Performance Fee</td>
                                    <td className="deposit-summary-table-cell-contents">10% of profit</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Time Locked</td>
                                    <td className="deposit-summary-table-cell-contents">{prettyTimeLockValue}</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Your wallet</td>
                                    <td className="deposit-summary-table-cell-contents">{TruncateAddress(walletOwner ? walletOwner : "")}</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title-final">Investment</td>
                                    <td className="deposit-summary-table-cell-contents-final">{`${walletBalance?.symbol} ${depositAmountFormatted} (${depositAmountCurrency})`}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="deposit-summary-info-mobile">
                        <div className="deposit-summary-info-bar-mobile"></div>
                        <table className="deposit-summary-table-mobile">
                            <tbody>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">DETF</td>
                                </tr>
                                <tr><td className="deposit-summary-table-cell-contents">{props.category} {props.dimension}</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Blockchain</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-contents">{chain?.name}</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Deposit Fee</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-contents">0.5%</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Performance Fee</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-contents">10% of profit</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Time Locked</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-contents">{prettyTimeLockValue}</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title">Your wallet</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-contents">{TruncateAddress(walletOwner ? walletOwner : "")}</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-title-final">Investment</td>
                                </tr>
                                <tr>
                                    <td className="deposit-summary-table-cell-contents-final">{`${walletBalance?.symbol} ${depositAmountFormatted} (${depositAmountCurrency})`}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="deposit-summary-button-wrapper">
                        {!contractWriteLoading && !transactionLoading && orderDataSuccess && <Button buttonStyle="primary" buttonSize="standard" text="Finalize and commit funds" onClick={() => detfDeposit?.()} />}
                        {contractWriteLoading && !transactionLoading && <Button buttonStyle="primary" buttonSize="standard" text="Finalize and commit funds" status="loading" loadingMsg={`waiting for ${connector?.name}`} />}
                    </div>
                    <TextLink to="" text="Make changes" arrowDirection="back" onClick={() => { props.setShowDepositDetails(true); props.setActiveStage(props.activeStage === "establish-deposit-summary" ? "establish-deposit-details" : "deposit-details") }} />
                </div>
            </div>
        )
    }

    if (transactionLoading) {
        return (
            <Loading loadingMsg="Sending transaction to the blockchain" />
        )
    }

    return (
        <Loading />
    )
}