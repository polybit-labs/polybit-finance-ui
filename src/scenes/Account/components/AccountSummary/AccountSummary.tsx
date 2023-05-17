import "./AccountSummary.css"
import { ColourNumbers } from "../../../../components/utils/Formatting"
import { FormatCurrency } from "../../../../components/utils/Currency"
import { FormatPercentages } from "../../../../components/utils/Formatting"

interface AccountSummaryProps {
    vsPrices: any;
    currency: string;
    totalDigitalAssetValue: number | undefined;
    totalDigitalAssetReturn: number | undefined;
    totalInvestmentThemeValue: number | undefined;
    totalInvestmentThemeReturn: number | undefined;
}

const AccountSummary = (props: AccountSummaryProps) => {
    const totalPortfolioFormatted: string | undefined = props.totalDigitalAssetValue &&
        props.totalInvestmentThemeValue ?
        FormatCurrency(props.totalDigitalAssetValue + props.totalInvestmentThemeValue, 2) : undefined
    const totalDigitalAssetValueFormatted: string | undefined = props.totalDigitalAssetValue ? FormatCurrency(props.totalDigitalAssetValue, 2) : undefined
    const totalInvestmentThemeValueFormatted: string | undefined = props.totalInvestmentThemeValue ? FormatCurrency(props.totalInvestmentThemeValue, 2) : undefined
    return (
        <>
            <div className="account-summary-container">
                <ul className="account-summary-items">
                    <li className="account-summary-item">
                        <div className="portfolio-box-title">
                            <div className="portfolio-box-title-text">Total Portfolio</div>
                        </div>
                        <div className="portfolio-box-balance">
                            {(!props.totalDigitalAssetValue ||
                                !props.totalInvestmentThemeValue) &&
                                <img src={require("../../../../assets/images/polybit-loader-60px.gif")} />}
                            {props.totalDigitalAssetValue && props.totalInvestmentThemeValue && <div>{totalPortfolioFormatted}</div>}
                        </div>
                    </li>
                    <li className="account-summary-item">
                        <div className="return-box-title">
                            <div className="return-box-title-text">Digital Assets</div>
                            <div className="return-box-title-percentage" >
                                {props.totalDigitalAssetReturn && FormatPercentages(props.totalDigitalAssetReturn * 100)}
                            </div>
                        </div>
                        <div className="return-box-balance" style={{ color: ColourNumbers(props.totalDigitalAssetReturn ? props.totalDigitalAssetReturn : 0) }}>
                            {!props.totalDigitalAssetValue && <img src={require("../../../../assets/images/polybit-loader-60px.gif")} />}
                            {props.totalDigitalAssetValue && <div>{totalDigitalAssetValueFormatted}</div>}
                        </div>
                    </li>
                    <li className="account-summary-item">
                        <div className="return-box-title">
                            <div className="return-box-title-text">Investment Themes</div>
                            <div className="return-box-title-percentage" >
                                {props.totalInvestmentThemeReturn && FormatPercentages(props.totalInvestmentThemeReturn * 100)}
                            </div>
                        </div>
                        <div className="return-box-balance" style={{ color: ColourNumbers(props.totalInvestmentThemeReturn ? props.totalInvestmentThemeReturn : 0) }}>
                            {!props.totalInvestmentThemeValue && <img src={require("../../../../assets/images/polybit-loader-60px.gif")} />}
                            {props.totalInvestmentThemeValue && <div>{totalInvestmentThemeValueFormatted}</div>}
                        </div>
                    </li>
                </ul>
            </div>
            <div className="account-summary-container-mobile">
                <ul className="account-summary-items-mobile">
                    <li className="account-summary-item-mobile">
                        <div className="title-text-mobile">Total Portfolio</div>
                        <div className="portfolio-box-balance">
                            {!props.totalDigitalAssetValue && !props.totalInvestmentThemeValue && <img src={require("../../../../assets/images/polybit-loader-60px.gif")} />}
                            {props.totalDigitalAssetValue && props.totalInvestmentThemeValue && <div>{totalPortfolioFormatted}</div>}
                        </div>
                    </li>
                    <li className="account-summary-item-mobile">
                        <div className="title-text-mobile">Digital Assets</div>
                        <div >
                            {(!props.totalDigitalAssetValue) && <img src={require("../../../../assets/images/polybit-loader-60px.gif")} />}
                            {props.totalDigitalAssetValue && <div className="return-box-balance-mobile" style={{ color: ColourNumbers(props.totalDigitalAssetReturn ? props.totalDigitalAssetReturn : 0) }}>
                                {totalDigitalAssetValueFormatted}&nbsp; ({props.totalDigitalAssetReturn && FormatPercentages(props.totalDigitalAssetReturn * 100)})</div>}
                        </div>
                    </li>
                    <li className="account-summary-item-mobile">
                        <div className="title-text-mobile">Investment Themes</div>
                        <div >
                            {(!props.totalInvestmentThemeValue) && <img src={require("../../../../assets/images/polybit-loader-60px.gif")} />}
                            {props.totalDigitalAssetValue && <div className="return-box-balance-mobile" style={{ color: ColourNumbers(props.totalInvestmentThemeReturn ? props.totalInvestmentThemeReturn : 0) }}>
                                {totalInvestmentThemeValueFormatted}&nbsp; ({props.totalInvestmentThemeReturn && FormatPercentages(props.totalInvestmentThemeReturn)})</div>}
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )

}

export default AccountSummary