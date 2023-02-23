import { Button, TextLink } from "./Buttons"
import { Currencies, FormatCurrency } from "./utils/Currency"
import { ColourNumbers, FormatPercentages, TruncateAddress } from "./utils/Formatting"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount } from "wagmi"
import { GetSellToCloseOrderData } from "./api/GetSellToCloseOrderData"
import PolybitDETFInterface from "./../chain_info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'
import { Loading } from "./Loading"
import "./WithdrawSummary.css"
import { useState } from "react"

interface WithdrawSummary {
    detfAddress: string;
    category: string;
    dimension: string;
    totalValue: string;
    currentTotalValue: number;
    currentReturn: number;
    currentReturnPercentage: number;
    totalDeposited: number;
    currency: string;
    vsPrices: Currencies;
    setWithdrawSuccess: Function;
}

export const WithdrawSummary = (props: WithdrawSummary) => {
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const { address: walletOwner } = useAccount()
    const { response: orderData, isLoading: orderDataLoading, isSuccess: orderDataSuccess } = GetSellToCloseOrderData(props.detfAddress)
    const { config: detfSellToCloseConfig, error: detfSellToCloseError, isSuccess: prepareContractWriteSuccess } = usePrepareContractWrite({
        addressOrName: props.detfAddress,
        contractInterface: IPolybitDETF,
        functionName: 'sellToClose',
        args: [orderData],
        onError(error) {
            console.log('detfSellToClose Error', error)
        },
        onSuccess(data) {
            console.log('detfSellToClose Success', data)
        },
    })
    const { data, isLoading, isSuccess, write: detfSellToClose } = useContractWrite(detfSellToCloseConfig)
    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            console.log(data)
            props.setWithdrawSuccess(true)
        }
    })
    const [checkboxTick, setCheckboxTick] = useState(false)
    const currentTotalDepositedFormatted = FormatCurrency(props.totalDeposited, 2)
    const currentTotalValueFormatted = FormatCurrency(props.currentTotalValue, 2)
    const currentReturnFormatted = FormatCurrency(props.currentReturn, 2)
    const currentReturnPercentageFormatted = FormatPercentages(props.currentReturnPercentage * 100)
    const estimatedPerformanceFee = props.currentReturn > 0 ? (props.currentTotalValue - props.totalDeposited) * .1 : 0
    const estimatedPerformanceFormatted = FormatCurrency(estimatedPerformanceFee, 2)
    const estimatedWithdrawAmount = props.currentTotalValue - estimatedPerformanceFee
    const estimatedWithdrawAmountFormatted = FormatCurrency(estimatedWithdrawAmount, 2)

    if (!prepareContractWriteSuccess) {
        return (
            <Loading loadingMsg="Preparing your withdrawal" />
        )
    }

    if (prepareContractWriteSuccess) {
        return (
            <>
                <div className="withdraw-summary">
                    <div className="withdraw-summary-container">
                        <div className="withdraw-summary-info">
                            <div className="withdraw-summary-info-bar"></div>
                            <table className="withdraw-summary-table">
                                <tbody>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">DETF</td>
                                        <td className="withdraw-summary-table-cell-contents">{props.category} {props.dimension}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Current market value</td>
                                        <td className="withdraw-summary-table-cell-contents">{currentTotalValueFormatted}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Total investment made</td>
                                        <td className="withdraw-summary-table-cell-contents">{currentTotalDepositedFormatted}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Total return</td>
                                        <td className="withdraw-summary-table-cell-contents" style={{ color: ColourNumbers(props.currentReturn) }}>{currentReturnFormatted} ({currentReturnPercentageFormatted})</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Performance fees</td>
                                        <td className="withdraw-summary-table-cell-contents">{estimatedPerformanceFormatted}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Withdraw address</td>
                                        <td className="withdraw-summary-table-cell-contents">{TruncateAddress(walletOwner ? walletOwner : "")}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title-final">Final withdraw amount</td>
                                        <td className="withdraw-summary-table-cell-contents-final">{estimatedWithdrawAmountFormatted}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="withdraw-summary-info-mobile">
                            <div className="withdraw-summary-info-bar-mobile"></div>
                            <table className="withdraw-summary-table-mobile">
                                <tbody>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">DETF</td>
                                    </tr>
                                    <tr><td className="withdraw-summary-table-cell-contents">{props.category} {props.dimension}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Current market value</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-contents">{currentTotalValueFormatted}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Total investment made</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-contents">{currentTotalDepositedFormatted}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Total return</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-contents" style={{ color: ColourNumbers(props.currentReturn) }}>{currentReturnFormatted} ({currentReturnPercentageFormatted})</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Performance fees</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-contents">{estimatedPerformanceFormatted}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title">Withdraw address</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-contents">{TruncateAddress(walletOwner ? walletOwner : "")}</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-title-final">Final withdraw amount</td>
                                    </tr>
                                    <tr>
                                        <td className="withdraw-summary-table-cell-contents-final">{estimatedWithdrawAmountFormatted}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="withdraw-summary-button-wrapper">
                            <div className="withdraw-summary-button-acknowledge">
                                <div className="acknowledge-checkbox-wrapper">
                                    <div className={checkboxTick === false ? "acknowledge-checkbox" : "acknowledge-checkbox-ticked"}
                                        onClick={() => {
                                            setCheckboxTick(!checkboxTick);
                                        }}  ></div>
                                </div>
                                <div>I acknowledge that I am exiting this investment and withdrawing the balance, minus fees, to my connected wallet.</div>
                            </div>
                            {checkboxTick && <Button buttonStyle="primary" buttonSize="standard" text="Confirm DETF exit" onClick={() => detfSellToClose?.()} />}
                            {!checkboxTick && <Button buttonStyle="primary" buttonSize="standard" text="Confirm DETF exit" status="disabled" />}
                        </div>
                        <TextLink text="Cancel withdrawal" to="/account" arrowDirection="back" />
                    </div>
                </div>
            </>
        )
    }

    return (<></>)
}