import { ColourNumbers } from "./utils/Formatting"
import "./TokenSummary.css"
import { TokenIndexDataFormatted } from "./FormatTokenIndex"
import { FormatCurrency } from "./utils/Currency";
import { CurrencyContext } from "./utils/Currency"
import { useContext, useEffect, useState } from "react";

interface TokenSumaryProps {
    tokenContent: any;
    tokenData: TokenIndexDataFormatted;
    currency: string;
}

export const TokenSummary = (props: TokenSumaryProps) => {
    return (
        <div>
            <div className="token-summary">
                <div className="token-summary-line"></div>
                <div className="token-summary-info">
                    <div className="token-summary-info-returns">
                        <div className="token-summary-info-return-one-day">
                            <div className="token-summary-info-return-title">1 day</div>
                            <div className="token-summary-info-return-result" style={{ color: ColourNumbers(Number(props.tokenData.one_day_return)) }}>{props.tokenData.one_day_return ? parseFloat((props.tokenData.one_day_return).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="token-summary-info-return-one-week">
                            <div className="token-summary-info-return-title">1 Week</div>
                            <div className="token-summary-info-return-result" style={{ color: ColourNumbers(Number(props.tokenData.one_week_return)) }}>{props.tokenData.one_week_return ? parseFloat((props.tokenData.one_week_return).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="token-summary-info-return-one-month">
                            <div className="token-summary-info-return-title">1 Month</div>
                            <div className="token-summary-info-return-result" style={{ color: ColourNumbers(Number(props.tokenData.one_month_return)) }}>{props.tokenData.one_month_return ? parseFloat((props.tokenData.one_month_return).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                        <div className="token-summary-info-return-one-year">
                            <div className="token-summary-info-return-title">1 Year</div>
                            <div className="token-summary-info-return-result" style={{ color: ColourNumbers(Number(props.tokenData.one_year_return)) }}>{props.tokenData.one_year_return ? parseFloat((props.tokenData.one_year_return).toString()).toFixed(2) + "%" : ""}</div>
                        </div>
                    </div>
                    <table className="token-summary-info-table">
                        <tbody>
                            <tr>
                                <td className="token-summary-info-table-cell-title">Price</td>
                                <td className="token-summary-info-table-cell-contents">{FormatCurrency(Number(props.tokenData.current_price), 6)}</td>
                            </tr>
                            <tr>
                                <td className="token-summary-info-table-cell-title">24h Volume</td>
                                <td className="token-summary-info-table-cell-contents">{FormatCurrency(Number(props.tokenData.volume_24h), 2)}</td>
                            </tr>
                            <tr>
                                <td className="token-summary-info-table-cell-title">24h Low / 24h High</td>
                                <td className="token-summary-info-table-cell-contents">{`${FormatCurrency(Number(props.tokenData.low_24h), 3)} / ${FormatCurrency(Number(props.tokenData.high_24h), 3)}`}</td>
                            </tr>
                            <tr>
                                <td className="token-summary-info-table-cell-title">Market Cap</td>
                                <td className="token-summary-info-table-cell-contents">{FormatCurrency(Number(props.tokenData.market_cap), 2)}</td>
                            </tr>
                            <tr>
                                <td className="token-summary-info-table-cell-title">Global Market Cap Rank</td>
                                <td className="token-summary-info-table-cell-contents">{`#${Number(props.tokenData.global_market_cap_rank)}`}</td>
                            </tr>
                            {props.tokenData.sentiment_score > 0 && <tr>
                                <td className="token-summary-info-table-cell-title">Sentiment Score</td>
                                <td className="token-summary-info-table-cell-contents">{`${parseFloat((props.tokenData.sentiment_score).toString()).toFixed(2)}%`}</td>
                            </tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}