import { useState, useEffect } from 'react'
import "./TokenIndexList.css"
import { ColourCategories, ColourNumbers, DETFIconFilename, FormatPercentages } from './utils/Formatting'
import { Link } from "react-router-dom"
import { Currencies, FormatCurrency } from "./utils/Currency"
import { Loading } from './Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { TokenIndex } from './pages/TokenIndex'
import { TokenIndexData } from './api/GetTokenIndexData'
import { FormatTokenIndex, FormatTokenIndexArray, TokenIndexDataFormatted } from './FormatTokenIndex'

interface TokenIndexListProps {
    tokenIndex: Array<TokenIndexData>;
    currency: string;
}

export const TokenIndexList = (props: TokenIndexListProps) => {
    const [activeSort, setActiveSort] = useState("")

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


    const [tokenIndexData, setTokenIndexData] = useState<Array<TokenIndexDataFormatted>>(FormatTokenIndexArray(props.currency, props.tokenIndex))
    useEffect(() => {
        setTokenIndexData(FormatTokenIndexArray(props.currency, props.tokenIndex))
        sorting("global_market_cap_rank")
    }, [])

    console.log(tokenIndexData)

    return (
        <>
            <div className="token-index-container">
                <div className="token-index-header">
                    <div className="token-index-header-item-token">Digital Asset</div>
                    <div className="token-index-header-item-price" onClick={() => { sorting("price"); setActiveSort("price") }}>Price&nbsp;
                        {activeSort !== "price" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#E3E3E3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "price" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "price" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
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
                    <div className="token-index-header-item-market-cap" onClick={() => { sorting("market_cap"); setActiveSort("market_cap") }}>1 Year&nbsp;
                        {activeSort !== "market_cap" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#E3E3E3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "market_cap" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                        {activeSort === "market_cap" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                    </div>
                </div>
                <div>
                    {tokenIndexData.map((token: any, index: number) =>
                        <div key={index}>
                            <Link className="token-index-row-item-link" to={`/tokens/${token.token_name.replaceAll(".", "-").replaceAll(" ", "-").toLowerCase()}`} >
                                <div className="token-index-row-items" key={index}>
                                    <div className="token-index-row-item-token">
                                        <img className="token-index-row-item-logo" src=""></img>
                                        <div className="token-index-row-item-name">{token.token_name}</div>
                                    </div>
                                    <div className="token-index-row-item-price">{token.price}</div>
                                    <div className="token-index-row-item-one-day" >{token.one_day_return}</div>
                                    <div className="token-index-row-item-one-week" >{token.one_week_return}</div>
                                    <div className="token-index-row-item-one-month" >{token.one_month_return}</div>
                                    <div className="token-index-row-item-volume-24h">{token.volume_24h}</div>
                                    <div className="token-index-row-item-market_cap">{token.market_cap}</div>
                                </div>
                            </Link>
                        </div>)
                    }
                </div>
            </div >{/* 
                <div className="detf-index-container-mobile">
                    <div>
                        {detfIndex.map((detf: any) =>
                            <div key={detf.url}>
                                <Link className="detf-index-row-item-link" to={`/detfs/${detf.urlChainId}/${detf.urlCategoryId}/${detf.urlDimensionId}`} >
                                    <div className="detf-index-row-items-mobile" key={detf.url}>
                                        <div className="detf-index-row-item-detf-header-mobile">
                                            <div className="detf-index-row-item-detf-mobile">
                                                <img className="detf-index-row-item-logo-mobile" src={require(`../assets/icons/${DETFIconFilename(detf.category, detf.dimension)}`)}></img>
                                                <div className="detf-index-row-item-name-mobile">
                                                    <div className="detf-index-row-item-name-category-mobile" style={{ color: ColourCategories(detf.category) }}>
                                                        {detf.category}
                                                    </div>
                                                    <div className="detf-index-row-item-name-dimension-mobile">
                                                        {detf.dimension}
                                                    </div>
                                                </div>
                                            </div>
                                            <FontAwesomeIcon className="fa-right-long" icon={icon({ name: "right-long", style: "solid" })} />
                                        </div>
                                        <table className="detf-index-row-item-table">
                                            <tbody>
                                                <tr>
                                                    <td className="detf-index-row-item-table-header">Liquidity:</td>
                                                    <td className="detf-index-row-item-table-cell">{detf.liquidity}</td>
                                                </tr>
                                                <tr>
                                                    <td className="detf-index-row-item-table-header">1 Week:</td>
                                                    <td className="detf-index-row-item-table-cell" style={{ color: ColourNumbers(detf.returnOneWeek) }}>
                                                        {detf.returnOneWeek === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                        {detf.returnOneWeek > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                        {detf.returnOneWeek < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                        &nbsp;{parseFloat((detf.returnOneWeek * 100).toString()).toFixed(2).replace("-", "") + "%"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="detf-index-row-item-table-header">1 Month:</td>
                                                    <td className="detf-index-row-item-table-cell" style={{ color: ColourNumbers(detf.returnOneMonth) }}>
                                                        {detf.returnOneMonth === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                        {detf.returnOneMonth > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                        {detf.returnOneMonth < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                        &nbsp;{parseFloat((detf.returnOneMonth * 100).toString()).toFixed(2).replace("-", "") + "%"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="detf-index-row-item-table-header">3 Months:</td>
                                                    <td className="detf-index-row-item-table-cell" style={{ color: ColourNumbers(detf.returnThreeMonths) }}>
                                                        {detf.returnThreeMonths === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                        {detf.returnThreeMonths > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                        {detf.returnThreeMonths < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                        &nbsp;{parseFloat((detf.returnThreeMonths * 100).toString()).toFixed(2).replace("-", "") + "%"}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Link>
                            </div>)
                        }
                    </div>
                </div> */}
        </>
    )



}
