import { useState, useEffect } from 'react'
import "./DETFIndexList.css"
import { ColourCategories, ColourNumbers, DETFIconFilename, FormatPercentages } from './utils/Formatting'
import { Link } from "react-router-dom"
import { FormatCurrency } from "./utils/Currency"
import { Loading } from './Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import MainContainer from './containers/Main'

interface DETFIndex {
    "category": string;
    "dimension": string;
    "liquidity": string;
    "returnOneWeek": string;
    "returnOneMonth": string;
    "returnThreeMonths": string;
    "returnOneYear": string;
}

interface DETFIndexListProps {
    detfIndex: Array<any>;
    vsPrices: any;
    currency: string;
    categoryFilter: string;
    dimensionFilter: string;
}

const DETFIndexList = (props: DETFIndexListProps) => {
    const [activeSort, setActiveSort] = useState("")
    const FormatIndex = (data: Array<any>) => {
        const formatted: Array<any> = []

        data.map((detf) => {
            formatted.push({
                "category": detf.category,
                "dimension": detf.dimension,
                "urlChainId": detf.url_chain_id,
                "urlCategoryId": detf.url_category_id,
                "urlDimensionId": detf.url_dimension_id,
                "url": `/detfs/${detf.url_chain_id}/${detf.url_category_id}/${detf.url_dimension_id}`,
                "liquidity": FormatCurrency((Number(detf.total_liquidity) *
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
                    })()), 0),
                "returnOneWeek": detf.return_one_week,
                "returnOneMonth": detf.return_one_month,
                "returnThreeMonths": detf.return_three_months,
                "returnOneYear": detf.return_one_year
            })
        })
        return formatted
    }

    let filteredData: any = []
    const filterData = () => {
        if (props.categoryFilter === "All Categories" && props.dimensionFilter === "All Dimensions") {
            filteredData = props.detfIndex
        }
        if (props.categoryFilter !== "All Categories" && props.dimensionFilter === "All Dimensions") {
            filteredData = props.detfIndex.filter(detf => {
                return detf.category === props.categoryFilter
            })
        }
        if (props.categoryFilter === "All Categories" && props.dimensionFilter !== "All Dimensions") {
            filteredData = props.detfIndex.filter(detf => {
                return detf.dimension === props.dimensionFilter
            })
        }
        if (props.categoryFilter !== "All Categories" && props.dimensionFilter !== "All Dimensions") {
            filteredData = props.detfIndex.filter(detf => {
                return detf.category === props.categoryFilter && detf.dimension === props.dimensionFilter
            })
        }
    }
    filterData()
    const [detfIndexData, setDETFIndexData] = useState(filteredData)

    useEffect(() => {
        setDETFIndexData(filteredData)
    }, [props.currency, props.categoryFilter, props.dimensionFilter])

    const [order, setOrder] = useState("asc")
    const sorting = (column: string) => {
        if (order === "asc") {
            const sorted = [...detfIndexData].sort((a, b) =>
                a[column as keyof DETFIndex] > b[column as keyof DETFIndex] ? 1 : -1)
            setDETFIndexData(sorted)
            setOrder("dsc")
        }
        if (order === "dsc") {
            const sorted = [...detfIndexData].sort((a, b) =>
                a[column as keyof DETFIndex] < b[column as keyof DETFIndex] ? 1 : -1)
            setDETFIndexData(sorted)
            setOrder("asc")
        }
    }

    const detfIndex = FormatIndex(detfIndexData)

    if (detfIndex) {
        return (
            <>
                <div className="detf-index-container">
                    <div className="detf-index-header">
                        <div className="detf-index-header-item-detf"></div>
                        <div className="detf-index-header-item-liquidity" onClick={() => { sorting("liquidity"); setActiveSort("liquidity") }}>Liquidity&nbsp;
                            {activeSort === "liquidity" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "liquidity" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="detf-index-header-item-one-week" onClick={() => { sorting("returnOneWeek"); setActiveSort("returnOneWeek") }}>1 Week&nbsp;
                            {activeSort === "returnOneWeek" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneWeek" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="detf-index-header-item-one-month" onClick={() => { sorting("returnOneMonth"); setActiveSort("returnOneMonth") }}>1 Month&nbsp;
                            {activeSort === "returnOneMonth" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneMonth" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="detf-index-header-item-three-months" onClick={() => { sorting("returnThreeMonths"); setActiveSort("returnThreeMonths") }}>3 Months&nbsp;
                            {activeSort === "returnThreeMonths" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnThreeMonths" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="detf-index-header-item-one-year" onClick={() => { sorting("returnOneYear"); setActiveSort("returnOneYear") }}>1 Year&nbsp;
                            {activeSort === "returnOneYear" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneYear" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="detf-index-header-item-view"></div>
                    </div>
                    <div>
                        {detfIndex.map((detf: any) =>
                            <Link className="detf-index-row-item-link" to={`/detfs/${detf.urlChainId}/${detf.urlCategoryId}/${detf.urlDimensionId}`} >
                                <div className="detf-index-row-items" key={detf.url}>
                                    <div className="detf-index-row-item-detf">
                                        <img className="detf-index-row-item-logo" src={require(`../assets/icons/${DETFIconFilename(detf.category, detf.dimension)}`)}></img>
                                        <div className="detf-index-row-item-name">
                                            <div className="detf-index-row-item-name-category" style={{ color: ColourCategories(detf.category) }}>
                                                {detf.category}
                                            </div>
                                            <div className="detf-index-row-item-name-dimension">
                                                {detf.dimension}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detf-index-row-item-liquidity">{detf.liquidity}</div>
                                    <div className="detf-index-row-item-one-week" >{FormatPercentages(detf.returnOneWeek * 100)}</div>
                                    <div className="detf-index-row-item-one-month" >{FormatPercentages(detf.returnOneMonth * 100)}</div>
                                    <div className="detf-index-row-item-three-months" >{FormatPercentages(detf.returnThreeMonths * 100)}</div>
                                    <div className="detf-index-row-item-one-year" >{FormatPercentages(detf.returnOneYear * 100)}</div>
                                    <div className="detf-index-row-item-view">
                                        View
                                    </div>
                                </div>
                            </Link>)
                        }
                    </div>
                </div>
                <div className="detf-index-container-mobile">
                    <div className="detf-index-header-mobile">
                        <div className="detf-index-header-item-liquidity-mobile" onClick={() => { sorting("liquidity"); setActiveSort("liquidity") }}>Liquidity&nbsp;
                            {activeSort !== "liquidity" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "liquidity" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "liquidity" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="detf-index-header-item-one-week-mobile" onClick={() => { sorting("returnOneWeek"); setActiveSort("returnOneWeek") }}>Week&nbsp;
                            {activeSort !== "returnOneWeek" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneWeek" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneWeek" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="detf-index-header-item-one-month-mobile" onClick={() => { sorting("returnOneMonth"); setActiveSort("returnOneMonth") }}>Month&nbsp;
                            {activeSort !== "returnOneMonth" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneMonth" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneMonth" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="detf-index-header-item-one-year-mobile" onClick={() => { sorting("returnOneYear"); setActiveSort("returnOneYear") }}>Year&nbsp;
                            {activeSort !== "returnOneYear" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneYear" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "returnOneYear" && order === "dsc" && <div style={{ transform: "translateY(-16%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                    </div>
                    <div>
                        {detfIndex.map((detf: any) =>
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
                                                <td>Liquidity:</td>
                                                <td>{detf.liquidity}</td>
                                            </tr>
                                            <tr>
                                                <td>1 Week:</td>
                                                <td className="detf-index-row-item-table-cell" style={{ color: ColourNumbers(detf.returnOneWeek) }}>
                                                    {detf.returnOneWeek === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {detf.returnOneWeek > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {detf.returnOneWeek < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                    &nbsp;{parseFloat((detf.returnOneWeek * 100).toString()).toFixed(2).replace("-", "") + "%"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>1 Month:</td>
                                                <td className="detf-index-row-item-table-cell" style={{ color: ColourNumbers(detf.returnOneMonth) }}>
                                                    {detf.returnOneMonth === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {detf.returnOneMonth > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {detf.returnOneMonth < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                    &nbsp;{parseFloat((detf.returnOneMonth * 100).toString()).toFixed(2).replace("-", "") + "%"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>1 Year:</td>
                                                <td className="detf-index-row-item-table-cell" style={{ color: ColourNumbers(detf.returnOneYear) }}>
                                                    {detf.returnOneYear === 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {detf.returnOneYear > 0 && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#0FC421" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                                                    {detf.returnOneYear < 0 && <div style={{ transform: "translateY(-28%)", fontSize: "20px", color: "#C20000" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                                                    &nbsp;{parseFloat((detf.returnOneYear * 100).toString()).toFixed(2).replace("-", "") + "%"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Link>)
                        }
                    </div>
                </div>
            </>
        )
    }

    return (
        <Loading />
    )
}

export default DETFIndexList