import "./CloseDETF.css"
import { useAccount } from "wagmi"
import { useLocation } from "react-router-dom"
import TitleContainer from "../containers/Title"
import SubTitleContainer from "../containers/SubTitle"
import Footer from "./Footer"
import { useState } from "react"
import { Loading } from "../Loading"
import { WithdrawSummary } from "../WithdrawSummary"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { GetSellToCloseOrderData } from "../api/GetSellToCloseOrderData"
import PolybitDETFInterface from "../../chain_info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'

export const CloseDETF = () => {
    const location = useLocation()
    const { category, dimension, productId, detfAddress, totalValue, totalDeposited, returnPercentage, lockTime, currency, vsPrices } = location.state
    const { address: walletOwner, connector, isConnected } = useAccount()
    const [prepared, setPrepared] = useState(false)
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const { response: orderData, isLoading: orderDataLoading, isSuccess: orderDataSuccess } = GetSellToCloseOrderData(detfAddress)

    console.log("sell to close order data", orderData)

    const { config: detfSellToCloseConfig, error: detfSellToCloseError, isSuccess: prepareContractWriteSuccess } = usePrepareContractWrite({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: 'sellToClose',
        args: [orderData],
        onError(error) {
            console.log('detfSellToClose Error', error)
        },
        onSuccess(data) {
            console.log('detfSellToClose Success', data)
            setPrepared(true)
        },
    })

    if (!prepared) {
        return (
            <Loading loadingMsg="Preparing your withdrawal" />
        )
    }

    if (prepared) {
        return (
            <>
                <TitleContainer title="Exit and withdraw funds" />
                <SubTitleContainer info="By exiting this strategy, your funds will be returned from your smart contract to your connected wallet. Trades will no longer be automatically made to maintain investment in the structure of this DETF."
                />
                <WithdrawSummary
                    detfAddress={detfAddress}
                    category={category}
                    dimension={dimension}
                    totalValue={totalValue}
                    totalDeposited={totalDeposited}
                    returnPercentage={returnPercentage}
                    currency={currency}
                    vsPrices={vsPrices}
                    detfSellToCloseConfig={detfSellToCloseConfig}
                />
                {/* <MainContainer>
                    
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
                                <Button buttonStyle="primary" buttonSize="standard" text="Go To My Account" /></Link>
                        </div>
                    </div>
                </MainContainer> */}
                <Footer />
            </>
        )
    }
    return (
        <Loading />
    )
}
