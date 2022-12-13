import "./AccountSummary.css"
import { ColourNumbers } from './utils/Formatting'
import { useAccount, useBalance } from 'wagmi'
import { FormatCurrency } from "./utils/Currency";

interface AccountSummaryProps {
    detfAccounts: Array<string>;
    detfAccountsData: Array<any>;
    vsPrices: any;
    currency: string;
}
const AccountSummary = (props: AccountSummaryProps) => {
    const detfAccounts: Array<string> = props.detfAccounts
    const detfAccountsData: Array<any> = props.detfAccountsData
    const { address: walletOwner, connector } = useAccount()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })

    const GetTotalAccountDeposits = (detfAccountsData: Array<any>) => {
        let deposits = 0
        for (let i = 0; i < detfAccountsData.length; i++) {
            deposits = deposits + Number(detfAccountsData[i].total_deposits)
        }
        return deposits
    }

    const GetTotalPortfolioWorth = (detfAccountsData: Array<any>) => {
        let totalBalance = 0
        for (let i = 0; i < detfAccountsData.length; i++) {
            totalBalance = totalBalance + Number(detfAccountsData[i].balance_in_weth)
        }
        return totalBalance
    }

    let totalDeposited = GetTotalAccountDeposits(detfAccountsData)
    let totalPortfolioWorth = GetTotalPortfolioWorth(detfAccountsData)
    let totalReturn = (totalPortfolioWorth - totalDeposited)
    let totalReturnPercentage = totalReturn / totalDeposited

    console.log(walletBalance?.value.toString())

    if (detfAccountsData) {
        return (
            <div className="account-summary">
                <div className="account-summary-container">
                    <div className="account-summary-wrapper">
                        <ul className="account-summary-items">
                            <li className="account-summary-item">
                                <div className="portfolio-box-title">
                                    <div className="portfolio-box-title-text">Total portfolio worth</div>
                                    <div className="portfolio-box-title-context">As of datestamp</div></div>
                                <div className="portfolio-box-balance">
                                    {FormatCurrency((Number(totalPortfolioWorth)
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
                                        })()), 2)}</div>
                            </li>
                            <li className="account-summary-item">
                                <div className="return-box-title">
                                    <div><div className="return-box-title-text">Total return</div>
                                        <div className="return-box-title-context">As of datestamp</div></div>
                                    <div className="return-box-title-percentage" style={{ color: ColourNumbers(totalReturnPercentage) }}>{parseFloat(Number(totalReturnPercentage).toString()).toFixed(2)}%</div>
                                </div>
                                <div className="return-box-balance">
                                    {FormatCurrency((Number(totalReturn)
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
                                        })()), 2)}</div>
                            </li>
                            <li className="account-summary-item">
                                <div className="wallet-box-title">
                                    <div className="wallet-box-title-text">Available funds</div>
                                    <div className="wallet-box-title-context">in {connector?.name}</div></div>
                                <div className="wallet-box-balance">
                                    {FormatCurrency(walletBalance ?
                                        (Number(walletBalance.value)
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
                                            })()) : 0, 2)}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        )
    }
    return (<></>)
}

export default AccountSummary