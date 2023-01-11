import "./CloseDETF.css"
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { GetSellToCloseOrderData } from "../api/GetSellToCloseOrderData"
import { Link, useLocation } from "react-router-dom"
import TitleContainer from "../containers/Title"
import SubTitleContainer from "../containers/SubTitle"
import MainContainer from "../containers/Main"
import Footer from "./Footer"
import PolybitDETFInterface from "../../chain_info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'
import { GetTimeToUnlock } from "../utils/TimeLock"
import { ColourNumbers } from "../utils/Formatting"
import { FormatCurrency } from "../utils/Currency"
import { useState } from "react"

export const CloseDETF = () => {
    const location = useLocation()
    const { category, dimension, productId, detfAddress, totalValue, totalDeposited, returnPercentage, lockTime, currency, vsPrices } = location.state
    const { address: walletOwner, connector, isConnected } = useAccount()
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const [sellToCloseSuccess, setSellToCloseSuccess] = useState(false)
    const { response: orderData, isLoading: orderDataLoading, isSuccess: orderDataSuccess } = GetSellToCloseOrderData(detfAddress)

    const { config: detfSellToCloseConfig, error: detfSellToCloseError } = usePrepareContractWrite({
        addressOrName: detfAddress,
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

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            console.log(data)
            setSellToCloseSuccess(true)
            /* const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            console.log(confirmedAmount)
            console.log(parseUnits(depositInputValue).toString())
            if (confirmedAmount === parseUnits(depositInputValue).toString()) {
                setDepositSuccess(true)
            } */
        }
    })

    if (detfAddress) {
        return (
            <>
                <TitleContainer title="Exit and withdraw funds" />
                <SubTitleContainer info="By exiting this strategy, your funds will be returned from your smart contract to your connected wallet. Trades will no longer be automatically made to maintain investment in the structure of this DETF."
                />
                <MainContainer>
                    <div className={!sellToCloseSuccess ? "close-table-container" : "close-table-container-inactive"}>
                        <div className="close-detf-container">
                            <div className="close-detf-header">
                                <div className="close-detf-header-item-detf" >DETF</div>
                                <div className="close-detf-header-item-value" >Market Value</div>
                                <div className="close-detf-header-item-return" >Return</div>
                                <div className="close-detf-header-item-return-percentage" >Return (%)</div>
                                <div className="close-detf-header-item-timelock" >Time Lock</div>
                            </div>
                            <div className="close-detf-row">
                                <div className="close-detf-row-items">
                                    <div className="close-detf-row-item-detf">
                                        <div className="close-index-row-item-name">
                                            {category}
                                            <div className="close-index-chain-title">
                                                {/* <img className="account-index-chain-logo" src={require("../assets/images/bsc-logo.png")} alt="Binance Smart Chain"></img> */}
                                                {dimension}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="close-detf-row-item-value">
                                        {FormatCurrency((Number(totalValue)
                                            / 10 ** 18 *
                                            (() => {
                                                switch (currency) {
                                                    case "AUD": return (vsPrices.aud)
                                                    case "BNB": return (vsPrices.bnb)
                                                    case "CNY": return (vsPrices.cny)
                                                    case "EURO": return (vsPrices.eur)
                                                    case "IDR": return (vsPrices.idr)
                                                    case "JPY": return (vsPrices.jpy)
                                                    case "KRW": return (vsPrices.krw)
                                                    case "RUB": return (vsPrices.rub)
                                                    case "TWD": return (vsPrices.twd)
                                                    case "USD": return (vsPrices.usd)
                                                }
                                            })()), 2)}</div>
                                    <div className="close-detf-row-item-return">{FormatCurrency((Number(totalValue - totalDeposited)
                                        / 10 ** 18 *
                                        (() => {
                                            switch (currency) {
                                                case "AUD": return (vsPrices.aud)
                                                case "BNB": return (vsPrices.bnb)
                                                case "CNY": return (vsPrices.cny)
                                                case "EURO": return (vsPrices.eur)
                                                case "IDR": return (vsPrices.idr)
                                                case "JPY": return (vsPrices.jpy)
                                                case "KRW": return (vsPrices.krw)
                                                case "RUB": return (vsPrices.rub)
                                                case "TWD": return (vsPrices.twd)
                                                case "USD": return (vsPrices.usd)
                                            }
                                        })()), 2)}</div>
                                    <div className="close-detf-row-item-return-percentage" style={{ color: ColourNumbers(returnPercentage) }}> {parseFloat((returnPercentage).toString()).toFixed(2) + "%"}</div>
                                    <div className="close-detf-row-item-timelock">{GetTimeToUnlock(Number(lockTime))}</div>
                                </div>
                            </div>
                        </div>
                        <div className="close-detf-button">
                            {orderDataLoading && (<img height="90px" width="90px" src={require("../../assets/images/loading.gif")} alt="Loading"></img>)}
                            {orderDataSuccess && (<button className="button-primary" disabled={!detfSellToClose} onClick={() => detfSellToClose?.()}>Confirm DETF exit</button>)}
                        </div>
                    </div>
                    <div>
                        <div className={transactionLoading ? "confirming-close-wrapper" : "confirming-close-wrapper-inactive"}>
                            {transactionLoading && (<div>Waiting for confirmation from the blockchain...</div>)}
                        </div>
                        <div className={sellToCloseSuccess ? "success-close-wrapper" : "success-close-wrapper-inactive"}>
                            <div>Your {category} {dimension} DETF exit has been confirmed on the blockchain and funds have been returned to your wallet.</div>
                            <h2>Final Summary</h2>
                            <p><b>Total Deposited:</b> {FormatCurrency((Number(totalDeposited)
                                / 10 ** 18 *
                                (() => {
                                    switch (currency) {
                                        case "AUD": return (vsPrices.aud)
                                        case "BNB": return (vsPrices.bnb)
                                        case "CNY": return (vsPrices.cny)
                                        case "EURO": return (vsPrices.eur)
                                        case "IDR": return (vsPrices.idr)
                                        case "JPY": return (vsPrices.jpy)
                                        case "KRW": return (vsPrices.krw)
                                        case "RUB": return (vsPrices.rub)
                                        case "TWD": return (vsPrices.twd)
                                        case "USD": return (vsPrices.usd)
                                    }
                                })()), 2)}</p>
                            <p><b>Profit / Loss:</b> {FormatCurrency((Number(totalValue - totalDeposited)
                                / 10 ** 18 *
                                (() => {
                                    switch (currency) {
                                        case "AUD": return (vsPrices.aud)
                                        case "BNB": return (vsPrices.bnb)
                                        case "CNY": return (vsPrices.cny)
                                        case "EURO": return (vsPrices.eur)
                                        case "IDR": return (vsPrices.idr)
                                        case "JPY": return (vsPrices.jpy)
                                        case "KRW": return (vsPrices.krw)
                                        case "RUB": return (vsPrices.rub)
                                        case "TWD": return (vsPrices.twd)
                                        case "USD": return (vsPrices.usd)
                                    }
                                })()), 2)}</p>
                            <p><b>Deposit Fee:</b> {FormatCurrency((Number(totalDeposited * .05)
                                / 10 ** 18 *
                                (() => {
                                    switch (currency) {
                                        case "AUD": return (vsPrices.aud)
                                        case "BNB": return (vsPrices.bnb)
                                        case "CNY": return (vsPrices.cny)
                                        case "EURO": return (vsPrices.eur)
                                        case "IDR": return (vsPrices.idr)
                                        case "JPY": return (vsPrices.jpy)
                                        case "KRW": return (vsPrices.krw)
                                        case "RUB": return (vsPrices.rub)
                                        case "TWD": return (vsPrices.twd)
                                        case "USD": return (vsPrices.usd)
                                    }
                                })()), 2)}</p>
                            <p><b>Performance Fee:</b> {FormatCurrency((totalValue - totalDeposited > 0) ? (Number((totalValue - totalDeposited) * .1))
                                / 10 ** 18 *
                                (() => {
                                    switch (currency) {
                                        case "AUD": return (vsPrices.aud)
                                        case "BNB": return (vsPrices.bnb)
                                        case "CNY": return (vsPrices.cny)
                                        case "EURO": return (vsPrices.eur)
                                        case "IDR": return (vsPrices.idr)
                                        case "JPY": return (vsPrices.jpy)
                                        case "KRW": return (vsPrices.krw)
                                        case "RUB": return (vsPrices.rub)
                                        case "TWD": return (vsPrices.twd)
                                        case "USD": return (vsPrices.usd)
                                    }
                                })() : 0, 2)}</p>
                            <Link className="success-close-button-link" to="/account">
                                <button className="button-primary">Go To My Account</button></Link>
                        </div>
                    </div>
                </MainContainer>
                <Footer />
            </>
        )
    }
    return (
        <>
            <div><b>OrderData</b></div>
            {orderDataLoading && (<div>Order Data loading...</div>)}
            {orderDataSuccess && (
                <div>{JSON.stringify(orderData)}</div>)}
        </>
    )
}
