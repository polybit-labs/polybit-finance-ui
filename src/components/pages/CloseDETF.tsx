import { useAccount } from "wagmi"
import { useLocation } from "react-router-dom"
import TitleContainer from "../containers/Title"
import SubTitleContainer from "../containers/SubTitle"
import Footer from "./Footer"
import { useEffect, useState } from "react"
import { Loading } from "../Loading"
import { WithdrawSummary } from "../WithdrawSummary"
import { WithdrawSuccess } from "../WithdrawSuccess"
import { initialiseGA4 } from "../utils/Analytics"
import ReactGA from "react-ga4"

export const CloseDETF = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const { category, dimension, detfAddress, totalValue, currentTotalValue, currentReturn, currentReturnPercentage, currency, vsPrices, totalDeposited } = location.state
    const { address: walletOwner, connector, isConnected } = useAccount()
    const [withdrawSuccess, setWithdrawSuccess] = useState(false)

    if (!withdrawSuccess) {
        return (
            <>
                <TitleContainer title="Exit and withdraw funds" />
                <SubTitleContainer info="By exiting this DETF, the balance of your funds will be returned to your connected wallet in BNB."
                />
                <WithdrawSummary
                    detfAddress={detfAddress}
                    category={category}
                    dimension={dimension}
                    totalValue={totalValue}
                    currentTotalValue={currentTotalValue}
                    currentReturn={currentReturn}
                    currentReturnPercentage={currentReturnPercentage}
                    totalDeposited={totalDeposited}
                    currency={currency}
                    vsPrices={vsPrices}
                    setWithdrawSuccess={setWithdrawSuccess}
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

    if (withdrawSuccess) {
        return (
            <WithdrawSuccess category={category} dimension={dimension} />
        )
    }

    return (
        <Loading />
    )
}
