import "./AccountSummary.css"
import { ColourNumbers } from "../../../../components/utils/Formatting"
import { FormatCurrency } from "../../../../components/utils/Currency"
import { useEffect, useState } from "react"
import { FormatPercentages } from "../../../../components/utils/Formatting"
import { AccountData } from "../../../../components/api/GetAccountData"

interface AccountSummaryPlaceholderProps {
    vsPrices: any;
    currency: string;
}

export const AccountSummaryPlaceholder = (props: AccountSummaryPlaceholderProps) => {
    const currentBalanceFormatted = FormatCurrency(0, 2)
    const currentReturnFormatted = FormatCurrency(0, 2)
    const lifetimeReturnFormatted = FormatCurrency(0, 2)

    return (
        <>
            <div className="account-summary-container">
                <ul className="account-summary-items">
                    <li className="account-summary-item">
                        <div className="portfolio-box-title">
                            <div className="portfolio-box-title-text">Current portfolio worth</div>
                        </div>
                        <div className="portfolio-box-balance">
                            {<div>{currentBalanceFormatted}</div>}
                        </div>
                    </li>
                    <li className="account-summary-item">
                        <div className="return-box-title">
                            <div className="return-box-title-text">Current portfolio return</div>
                            <div className="return-box-title-percentage" >
                                {FormatPercentages(0)}
                            </div>
                        </div>
                        <div className="return-box-balance" style={{ color: ColourNumbers(0) }}>
                            {<div>{currentReturnFormatted}</div>}
                        </div>
                    </li>
                    <li className="account-summary-item">
                        <div className="return-box-title">
                            <div className="return-box-title-text">Total lifetime return</div>
                            <div className="return-box-title-percentage" >
                                {FormatPercentages(0)}
                            </div>
                        </div>
                        <div className="return-box-balance" style={{ color: ColourNumbers(0) }}>
                            {<div>{lifetimeReturnFormatted}</div>}
                        </div>
                    </li>
                </ul>
            </div>
            <div className="account-summary-container-mobile">
                <ul className="account-summary-items-mobile">
                    <li className="account-summary-item-mobile">
                        <div className="title-text-mobile">Current portfolio worth</div>
                        <div className="portfolio-box-balance">
                            {<div>{currentBalanceFormatted}</div>}
                        </div>
                    </li>
                    <li className="account-summary-item-mobile">
                        <div className="title-text-mobile">Current portfolio return</div>
                        <div >
                            {<div className="return-box-balance-mobile" style={{ color: ColourNumbers(0) }}>
                                {currentReturnFormatted}&nbsp; ({FormatPercentages(0)})</div>}
                        </div>
                    </li>
                    <li className="account-summary-item-mobile">
                        <div className="title-text-mobile">Total lifetime return</div>
                        <div >
                            {<div className="return-box-balance-mobile" style={{ color: ColourNumbers(0) }}>
                                {lifetimeReturnFormatted}&nbsp; ({FormatPercentages(0)})</div>}
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}
