import "./AccountSummary.css"
import { getNumValueColor } from '../utils'
import { useAccount, useBalance } from 'wagmi'
import { GetOwnedAssets, GetOwnedAssetsPrices, GetTotalBalanceInWeth, GetTotalDeposited } from './utils/DETFUtils'

const AccountSummary = (props: any) => {
    const ownedDETFsData: Array<string> = props.data
    const { address: walletOwner, connector } = useAccount()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })

    const GetTotalAccountDeposits = (ownedDETFsData: Array<string>) => {
        let deposits = 0
        for (let i = 0; i < ownedDETFsData.length; i++) {
            deposits = deposits + Number(GetTotalDeposited(ownedDETFsData[i]))
        }
        return deposits
    }

    const GetTotalPortfolioWorth = (ownedDETFsData: Array<string>) => {
        let totalBalance = 0
        for (let i = 0; i < ownedDETFsData.length; i++) {
            totalBalance = totalBalance + Number(GetTotalBalanceInWeth(ownedDETFsData[i], GetOwnedAssetsPrices(GetOwnedAssets(ownedDETFsData[i]))))
        }
        return totalBalance
    }

    let totalDeposited = GetTotalAccountDeposits(ownedDETFsData)
    let totalPortfolioWorth = GetTotalPortfolioWorth(ownedDETFsData)
    let totalReturn = (totalPortfolioWorth - totalDeposited)
    let totalReturnPercentage = totalReturn / totalDeposited

    return (
        <div className="account-summary">
            <div className="account-summary-container">
                <div className="account-summary-wrapper">
                    <ul className="account-summary-items">
                        <li className="account-summary-item">
                            <div className="portfolio-box-title">
                                <div className="portfolio-box-title-text">Total portfolio worth</div>
                                <div className="portfolio-box-title-context">As of datestamp</div></div>
                            <div className="portfolio-box-balance">{walletBalance?.symbol} {parseFloat(Number(totalPortfolioWorth / 10 ** 18).toString()).toFixed(4)}</div>
                        </li>
                        <li className="account-summary-item">
                            <div className="return-box-title">
                                <div><div className="return-box-title-text">Total return</div>
                                    <div className="return-box-title-context">As of datestamp</div></div>
                                <div className="return-box-title-percentage" style={{ color: getNumValueColor(totalReturnPercentage) }}>{parseFloat(Number(totalReturnPercentage).toString()).toFixed(2)}%</div>
                            </div>
                            <div className="return-box-balance">{walletBalance?.symbol} {parseFloat(Number(totalReturn / 10 ** 18).toString()).toFixed(4)}</div>
                        </li>
                        <li className="account-summary-item">
                            <div className="wallet-box-title">
                                <div className="wallet-box-title-text">Available funds</div>
                                <div className="wallet-box-title-context">in {connector?.name}</div></div>
                            <div className="wallet-box-balance">{walletBalance?.symbol} {parseFloat((walletBalance ? walletBalance.formatted : 0).toString()).toFixed(4)}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AccountSummary