import { ColourNumbers } from "./utils/Formatting";
import { PerformanceData } from "./api/GetPerformanceData";
import { ProductData } from "./api/GetProductData";
import { FormatCurrency } from "./utils/Currency";
import { Link } from "react-router-dom";

interface DETFSumaryProps {
    productContent: any;
    productData: ProductData;
    performanceData: Array<PerformanceData>;
    vsPrices: any;
    currency: string;
}

export const DETFSummary = (props: DETFSumaryProps) => {
    const rebalancingPeriod: string = props.productContent.rebalancingPeriod
    const returnOneWeek: number = props.performanceData[props.performanceData.length - 1].performance_7d
    const returnOneMonth: number = props.performanceData[props.performanceData.length - 1].performance_30d
    const returnThreeMonths: number = props.performanceData[props.performanceData.length - 1].performance_90d
    const returnOneYear: number = props.performanceData[props.performanceData.length - 1].performance_365d
    const returnTwoYear: number = props.performanceData[props.performanceData.length - 1].performance_730d
    const tokens: Array<any> = [] = props.productData.tokens
    const tokenCount: number = tokens.length
    const totalLiquidity = props.productData.total_liquidity.liquidity_bnb
    const depositFee = "0.5%"

    return (
        <div>
            <div className="detf-summary">
                <div className="detf-summary-line"></div>
                <div className="detf-summary-info">
                    <div className="detf-summary-info-returns">
                        <div className="detf-summary-info-return">
                            <div className="detf-summary-info-return-title">1 Week</div>
                            <div className="detf-summary-info-return-result" style={{ color: ColourNumbers(Number(returnOneWeek)) }}>{returnOneWeek ? parseFloat((returnOneWeek * 100).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="detf-summary-info-return">
                            <div className="detf-summary-info-return-title">1 Month</div>
                            <div className="detf-summary-info-return-result" style={{ color: ColourNumbers(Number(returnOneMonth)) }}>{returnOneMonth ? parseFloat((returnOneMonth * 100).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="detf-summary-info-return">
                            <div className="detf-summary-info-return-title">3 Months</div>
                            <div className="detf-summary-info-return-result" style={{ color: ColourNumbers(Number(returnThreeMonths)) }}>{returnThreeMonths ? parseFloat((returnThreeMonths * 100).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="detf-summary-info-return">
                            <div className="detf-summary-info-return-title">1 Year</div>
                            <div className="detf-summary-info-return-result" style={{ color: ColourNumbers(Number(returnOneYear)) }}>{returnOneYear ? parseFloat((returnOneYear * 100).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                    </div>
                    <div className="detf-summary-info-text">
                        <div className="detf-summary-info-titles">
                            <ul>
                                <li>Blockchain</li>
                                <li>Total Liquidity</li>
                                <li>Total Assets</li>
                                <li>Rebalance Frequency</li>
                                <li>Deposit Fee</li>
                            </ul>
                        </div>
                        <div className="detf-summary-info-results">
                            <ul>
                                <li>BNB Smart Chain</li>
                                <li>{FormatCurrency(Number(totalLiquidity) *
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
                                    })(), 0)}</li>
                                <li>{tokenCount}</li>
                                <li>{rebalancingPeriod}</li>
                                <li>{parseFloat((depositFee).toString()).toFixed(1)}%</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="detf-summary-fine-print">
                <div>*Past performance is not indicative of future performance. This is not financial advice. There are risks associated with crytpocurrency investing. Do your own research.</div>
                <div>**Certain additional costs apply. Please refer to our <Link className="detf-summary-fine-print" to="/fees">Fee Schedule</Link>.</div>
            </div>
        </div>
    )
}