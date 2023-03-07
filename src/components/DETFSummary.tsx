import { ColourNumbers } from "./utils/Formatting"
import { PerformanceData } from "./api/GetPerformanceData"
import { ProductData } from "./api/GetProductData"
import { FormatCurrency } from "./utils/Currency"
import "./DETFSummary.css"

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
    const tokens: Array<any> = [] = props.productData.tokens
    const tokenCount: number = tokens.length
    const totalLiquidity = props.productData.total_liquidity.liquidity_bnb
    const depositFee = "0.5%"
    const performanceFee = "10%"

    return (
        <div>
            <div className="detf-summary">
                <div className="detf-summary-line"></div>
                <div className="detf-summary-info">
                    <div className="detf-summary-info-returns">
                        <div className="detf-summary-info-return-one-week">
                            <div className="detf-summary-info-return-title">1 Week</div>
                            <div className="detf-summary-info-return-result" style={{ color: ColourNumbers(Number(returnOneWeek)) }}>{returnOneWeek ? parseFloat((returnOneWeek * 100).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="detf-summary-info-return-one-month">
                            <div className="detf-summary-info-return-title">1 Month</div>
                            <div className="detf-summary-info-return-result" style={{ color: ColourNumbers(Number(returnOneMonth)) }}>{returnOneMonth ? parseFloat((returnOneMonth * 100).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="detf-summary-info-return-three-months">
                            <div className="detf-summary-info-return-title">3 Months</div>
                            <div className="detf-summary-info-return-result" style={{ color: ColourNumbers(Number(returnThreeMonths)) }}>{returnThreeMonths ? parseFloat((returnThreeMonths * 100).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="detf-summary-info-return-one-year">
                            <div className="detf-summary-info-return-title">1 Year</div>
                            <div className="detf-summary-info-return-result" style={{ color: ColourNumbers(Number(returnOneYear)) }}>{returnOneYear ? parseFloat((returnOneYear * 100).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                    </div>
                    <table className="detf-summary-info-table">
                        <tbody>
                            <tr>
                                <td className="detf-summary-info-table-cell-title">Blockchain</td>
                                <td className="detf-summary-info-table-cell-contents">BNB Smart Chain</td>
                            </tr>
                            <tr>
                                <td className="detf-summary-info-table-cell-title">Total Liquidity</td>
                                <td className="detf-summary-info-table-cell-contents">{FormatCurrency(Number(totalLiquidity) *
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
                                    })(), 0)}</td>
                            </tr>
                            <tr>
                                <td className="detf-summary-info-table-cell-title">Total Assets</td>
                                <td className="detf-summary-info-table-cell-contents">{tokenCount}</td>
                            </tr>
                            <tr>
                                <td className="detf-summary-info-table-cell-title">Rebalance Frequency</td>
                                <td className="detf-summary-info-table-cell-contents">{rebalancingPeriod}</td>
                            </tr>
                            <tr>
                                <td className="detf-summary-info-table-cell-title">Deposit Fee</td>
                                <td className="detf-summary-info-table-cell-contents">{parseFloat((depositFee).toString()).toFixed(1)}%</td>
                            </tr>
                            <tr>
                                <td className="detf-summary-info-table-cell-title">Performance Fee</td>
                                <td className="detf-summary-info-table-cell-contents">{parseFloat((performanceFee).toString()).toFixed(1)}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}