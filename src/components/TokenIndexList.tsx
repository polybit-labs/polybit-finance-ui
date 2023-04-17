import { useState, useEffect, useContext } from 'react'
import "./TokenIndexList.css"
import { ColourNumbers } from './utils/Formatting'
import { Link } from "react-router-dom"
import { CurrencyContext, FormatCurrency } from "./utils/Currency"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { TokenIndexData } from './api/GetTokenIndexData'
import { FormatTokenIndexArray, TokenIndexDataFormatted } from './FormatTokenIndex'

interface TokenIndexListProps {
    tokenIndex: Array<TokenIndexData>;
    currency: string;
}

export const TokenIndexList = (props: TokenIndexListProps) => {
    const currency = useContext(CurrencyContext).currency
    const [activeSort, setActiveSort] = useState("")

    const [tokenIndexData, setTokenIndexData] = useState<Array<TokenIndexDataFormatted>>(FormatTokenIndexArray(props.currency, props.tokenIndex))
    useEffect(() => {
        setTokenIndexData(FormatTokenIndexArray(props.currency, props.tokenIndex))
    }, [currency])

    const [order, setOrder] = useState("asc")
    const sorting = (column: string) => {
        if (order === "asc") {
            const sorted = [...tokenIndexData].sort((a, b) =>
                a[column as keyof TokenIndexDataFormatted] > b[column as keyof TokenIndexDataFormatted] ? 1 : -1)
            setTokenIndexData(sorted)
            setOrder("dsc")
        }
        if (order === "dsc") {
            const sorted = [...tokenIndexData].sort((a, b) =>
                a[column as keyof TokenIndexDataFormatted] < b[column as keyof TokenIndexDataFormatted] ? 1 : -1)
            setTokenIndexData(sorted)
            setOrder("asc")
        }
    }

    return (
        <>
            <div className="token-index-container">
                <div className="token-index-header">
                    <div className="token-index-header-item-token">Token</div>
                    <div className="token-index-header-item-price" onClick={() => { sorting("current_price"); setActiveSort("current_price") }}>Price&nbsp;
                        {activeSort !== "current_price" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#E3E3E3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "current_price" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "current_price" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                    </div>
                    <div className="token-index-header-item-one-day" onClick={() => { sorting("one_day_return"); setActiveSort("one_day_return") }}>1 Day&nbsp;
                        {activeSort !== "one_day_return" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#E3E3E3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "one_day_return" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "one_day_return" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                    </div>
                    <div className="token-index-header-item-one-week" onClick={() => { sorting("one_week_return"); setActiveSort("one_week_return") }}>1 Week&nbsp;
                        {activeSort !== "one_week_return" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#E3E3E3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "one_week_return" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "one_week_return" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                    </div>
                    <div className="token-index-header-item-one-month" onClick={() => { sorting("one_month_return"); setActiveSort("one_month_return") }}>1 Month&nbsp;
                        {activeSort !== "one_month_return" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#E3E3E3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "one_month_return" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "one_month_return" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                    </div>
                    <div className="token-index-header-item-volume-24h" onClick={() => { sorting("volume_24h"); setActiveSort("volume_24h") }}>24h Volume&nbsp;
                        {activeSort !== "volume_24h" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#E3E3E3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "volume_24h" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "volume_24h" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                    </div>
                    <div className="token-index-header-item-market-cap" onClick={() => { sorting("market_cap"); setActiveSort("market_cap") }}>Market Cap&nbsp;
                        {activeSort !== "market_cap" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#E3E3E3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "market_cap" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "market_cap" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                    </div>
                </div>
                <div>
                    {tokenIndexData.map((token: any, index: number) =>
                        <div key={index}>
                            <Link className="token-index-row-item-link" to={`/tokens/${token.token_name.replaceAll(".", "-").replaceAll(" ", "-").replaceAll("(", "").replaceAll(")", "").toLowerCase()}`} >
                                <div className="token-index-row-items" key={index}>
                                    <div className="token-index-row-item-token">
                                        <img className="token-index-row-item-logo" src={token.token_logo}></img>
                                        <div className="token-index-row-item-name">{token.token_name}</div>
                                    </div>
                                    <div className="token-index-row-item-price">{FormatCurrency(token.current_price, 6)}</div>
                                    <div className="token-index-row-item-one-day" style={{ color: ColourNumbers(token.one_day_return) }} >
                                        {token.one_day_return === 0 && <div style={{ transform: "translateY(+16%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                        {token.one_day_return > 0 && <div style={{ transform: "translateY(+16%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                        {token.one_day_return < 0 && <div style={{ transform: "translateY(-20%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                        &nbsp;{parseFloat((token.one_day_return).toString()).toFixed(2).replace("-", "") + "%"}
                                    </div>
                                    <div className="token-index-row-item-one-week" style={{ color: ColourNumbers(token.one_week_return) }} >
                                        {token.one_week_return === 0 && <div style={{ transform: "translateY(+16%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                        {token.one_week_return > 0 && <div style={{ transform: "translateY(+16%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                        {token.one_week_return < 0 && <div style={{ transform: "translateY(-20%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                        &nbsp;{parseFloat((token.one_week_return).toString()).toFixed(2).replace("-", "") + "%"}
                                    </div>
                                    <div className="token-index-row-item-one-month" style={{ color: ColourNumbers(token.one_month_return) }} >
                                        {token.one_month_return === 0 && <div style={{ transform: "translateY(+16%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                        {token.one_month_return > 0 && <div style={{ transform: "translateY(+16%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                        {token.one_month_return < 0 && <div style={{ transform: "translateY(-20%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                        &nbsp;{parseFloat((token.one_month_return).toString()).toFixed(2).replace("-", "") + "%"}</div>
                                    <div className="token-index-row-item-volume-24h">{FormatCurrency(token.volume_24h, 2)}</div>
                                    <div className="token-index-row-item-market-cap">{FormatCurrency(token.market_cap, 2)}</div>
                                </div>
                            </Link>
                        </div>)
                    }
                </div>
            </div >
            <div className="token-index-container-mobile">
                <div>
                    {tokenIndexData.map((token: any, index: number) =>
                        <div key={index}>
                            <Link className="token-index-row-item-link" to={`/tokens/${token.token_name.replaceAll(".", "-").replaceAll(" ", "-").replaceAll("(", "").replaceAll(")", "").toLowerCase()}`} >
                                <div className="token-index-row-items-mobile" key={index}>
                                    <div className="token-index-row-item-token-header-mobile">
                                        <div className="token-index-row-item-token-mobile">
                                            <img className="token-index-row-item-logo-mobile" src={token.token_logo}></img>
                                            <div className="token-index-row-item-name-mobile">{token.token_name}</div>
                                        </div>
                                        <FontAwesomeIcon className="fa-right-long" icon={icon({ name: "right-long", style: "solid" })} />
                                    </div>
                                    <table className="token-index-row-item-table">
                                        <tbody>
                                            <tr>
                                                <td className="token-index-row-item-table-header">Price:</td>
                                                <td className="token-index-row-item-table-cell">{FormatCurrency(token.current_price, 6)}</td>
                                            </tr>
                                            <tr>
                                                <td className="token-index-row-item-table-header">1 Day:</td>
                                                <td className="token-index-row-item-table-cell" style={{ color: ColourNumbers(token.one_day_return) }}>
                                                    {token.one_day_return === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {token.one_day_return > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {token.one_day_return < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                    &nbsp;{parseFloat((token.one_day_return).toString()).toFixed(2).replace("-", "") + "%"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="token-index-row-item-table-header">1 Week:</td>
                                                <td className="token-index-row-item-table-cell" style={{ color: ColourNumbers(token.one_week_return) }}>
                                                    {token.one_week_return === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {token.one_week_return > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {token.one_week_return < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                    &nbsp;{parseFloat((token.one_week_return).toString()).toFixed(2).replace("-", "") + "%"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="token-index-row-item-table-header">1 Month:</td>
                                                <td className="token-index-row-item-table-cell" style={{ color: ColourNumbers(token.one_month_return) }}>
                                                    {token.one_month_return === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {token.one_month_return > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {token.one_month_return < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                    &nbsp;{parseFloat((token.one_month_return).toString()).toFixed(2).replace("-", "") + "%"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="token-index-row-item-table-header">24h Volume:</td>
                                                <td className="token-index-row-item-table-cell">
                                                    {FormatCurrency(token.volume_24h, 2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="token-index-row-item-table-header">Market Cap:</td>
                                                <td className="token-index-row-item-table-cell">
                                                    {FormatCurrency(token.market_cap, 2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Link>
                        </div>)
                    }
                </div>
            </div>
        </>
    )



}
