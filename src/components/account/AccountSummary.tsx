import "./AccountSummary.css"
import { ColourNumbers } from '../utils/Formatting'
import { useAccount, useBalance } from 'wagmi'
import { FormatCurrency } from "../utils/Currency"
import { useEffect, useState } from "react"
import { FormatPercentages } from "../utils/Formatting"

interface AccountSummaryProps {
    detfAccounts: Array<string>;
    detfAccountsSuccess: boolean;
    detfAccountsData: Array<any>;
    detfAccountsDataSuccess: boolean;
    vsPrices: any;
    currency: string;
}

type FinalReturn = {
    "aud": number;
    "bnb": number;
    "cny": number;
    "eur": number;
    "idr": number;
    "jpy": number;
    "krw": number;
    "rub": number;
    "twd": number;
    "usd": number;
}

type DETFAccountData = {
    balance_in_weth: string;
    category: string;
    deposits: Array<string>;
    detf_address: string;
    dimension: string;
    final_return_percentage: number;
    final_return_weth: number;
    final_return: FinalReturn;
    product_id: number;
    return_percentage: number;
    return_weth: string;
    status: number;
    time_lock: number;
    time_lock_remaining: number;
    total_deposits: number;
}

const AccountSummary = (props: AccountSummaryProps) => {
    const detfAccountsData: Array<DETFAccountData> = props.detfAccountsData
    const [currentBalance, setCurrentBalance] = useState<number>(0)
    const [currentReturn, setCurrentReturn] = useState<number>(0)
    const [currentReturnPercentage, setCurrentReturnPercentage] = useState<number>(0)
    const [lifetimeReturn, setLifetimeReturn] = useState<number>(0)
    const [lifetimeReturnPercentage, setLifetimeReturnPercentage] = useState<number>(0)
    console.log(props.detfAccountsDataSuccess)
    const CurrentPortfolio = () => {
        const active = detfAccountsData.filter(detf => {
            return detf.status === 1
        })
        let deposits = 0
        for (let i = 0; i < active.length; i++) {
            deposits = deposits + Number(active[i].total_deposits)
        }
        let totalBalance = 0
        let totalReturn = 0
        let totalReturnPercentage = 0
        if (deposits > 0) {
            for (let i = 0; i < active.length; i++) {
                totalBalance = totalBalance + Number(active[i].balance_in_weth)
            }
            totalReturn = (totalBalance - deposits)
            totalReturnPercentage = totalReturn / deposits
        }
        return { deposits, totalBalance, totalReturn, totalReturnPercentage }
    }
    const { deposits: currentPortfolioDeposits,
        totalBalance: currentPortfolioBalance,
        totalReturn: currentPortfolioReturn,
        totalReturnPercentage: currentPortfolioReturnPercentage } = CurrentPortfolio()

    const LifetimePortfolio = (currentPortfolioDeposits: number, currentPortfolioReturn: number) => {
        const inactive = detfAccountsData.filter(detf => {
            return detf.status === 0
        })
        let deposits = 0
        for (let i = 0; i < inactive.length; i++) {
            deposits = deposits + Number(inactive[i].total_deposits)
        }
        let totalReturn = 0
        let totalReturnBNB = 0
        for (let i = 0; i < inactive.length; i++) {
            const detfReturn = Number((() => {
                switch (props.currency) {
                    case "AUD": return (inactive[i].final_return.aud)
                    case "BNB": return (inactive[i].final_return.bnb)
                    case "CNY": return (inactive[i].final_return.cny)
                    case "EURO": return (inactive[i].final_return.eur)
                    case "IDR": return (inactive[i].final_return.idr)
                    case "JPY": return (inactive[i].final_return.jpy)
                    case "KRW": return (inactive[i].final_return.krw)
                    case "RUB": return (inactive[i].final_return.rub)
                    case "TWD": return (inactive[i].final_return.twd)
                    case "USD": return (inactive[i].final_return.usd)
                }
            })())
            totalReturn = totalReturn + detfReturn
            totalReturnBNB = totalReturnBNB + (10 ** 18 * inactive[i].final_return.bnb)
        }
        let lifetimePortfolioReturn: number = 0
        let lifetimePortfolioReturnBNB: number = 0
        let lifetimePortfolioReturnPercentage: number = 0
        lifetimePortfolioReturn = totalReturn + (Number(currentPortfolioReturn)
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
            })())
        lifetimePortfolioReturnBNB = totalReturnBNB + currentPortfolioReturn
        lifetimePortfolioReturnPercentage = lifetimePortfolioReturnBNB / (currentPortfolioDeposits + deposits)
        return { lifetimePortfolioReturn, lifetimePortfolioReturnPercentage }
    }
    const { lifetimePortfolioReturn, lifetimePortfolioReturnPercentage } = LifetimePortfolio(currentPortfolioDeposits, currentPortfolioReturn)

    useEffect(() => {
        setCurrentReturn(currentPortfolioReturn)
        setCurrentReturnPercentage(currentPortfolioReturnPercentage)
        setCurrentBalance(currentPortfolioBalance)
        setLifetimeReturn(lifetimePortfolioReturn ? lifetimePortfolioReturn : 0)
        setLifetimeReturnPercentage(lifetimePortfolioReturnPercentage ? lifetimePortfolioReturnPercentage : 0)
    }, [props.currency, detfAccountsData, currentPortfolioReturn])

    const currentBalanceFormatted = FormatCurrency((Number(currentBalance)
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
        })()), 2)
    const currentReturnFormatted = FormatCurrency((Number(currentReturn)
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
        })()), 2)
    const lifetimeReturnFormatted = FormatCurrency((Number(lifetimeReturn)), 2)

    if (detfAccountsData) {
        return (
            <div className="account-summary-container">
                <ul className="account-summary-items">
                    <li className="account-summary-item">
                        <div className="portfolio-box-title">
                            <div className="portfolio-box-title-text">Current portfolio worth</div>
                        </div>
                        <div className="portfolio-box-balance">
                            {(!props.detfAccountsSuccess || !props.detfAccountsDataSuccess) && <img src={require("../../assets/images/polybit-loader-60px.gif")} />}
                            {props.detfAccountsSuccess && props.detfAccountsDataSuccess && <div>{currentBalanceFormatted}</div>}
                        </div>
                    </li>
                    <li className="account-summary-item">
                        <div className="return-box-title">
                            <div className="return-box-title-text">Current portfolio return</div>
                            <div className="return-box-title-percentage" >
                                {(props.detfAccountsSuccess && props.detfAccountsDataSuccess) && FormatPercentages(currentReturnPercentage)}
                            </div>
                        </div>
                        <div className="return-box-balance" style={{ color: ColourNumbers(currentReturn) }}>
                            {(!props.detfAccountsSuccess || !props.detfAccountsDataSuccess) && <img src={require("../../assets/images/polybit-loader-60px.gif")} />}
                            {props.detfAccountsSuccess && props.detfAccountsDataSuccess && <div>{currentReturnFormatted}</div>}
                        </div>
                    </li>
                    <li className="account-summary-item">
                        <div className="return-box-title">
                            <div className="return-box-title-text">Total lifetime return</div>
                            <div className="return-box-title-percentage" >
                                {props.detfAccountsSuccess && props.detfAccountsDataSuccess && FormatPercentages(lifetimeReturnPercentage)}
                            </div>
                        </div>
                        <div className="return-box-balance" style={{ color: ColourNumbers(lifetimeReturn) }}>
                            {(!props.detfAccountsSuccess || !props.detfAccountsDataSuccess) && <img src={require("../../assets/images/polybit-loader-60px.gif")} />}
                            {props.detfAccountsSuccess && props.detfAccountsDataSuccess && <div>{lifetimeReturnFormatted}</div>}
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
    return (<></>)
}

export default AccountSummary