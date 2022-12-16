import { useState, useEffect } from 'react'
import "./DETFIndexList.css"
import { ColourCategories, ColourNumbers, FormatPercentages } from './utils/Formatting'
import { Link } from "react-router-dom"
import { FormatCurrency } from "./utils/Currency"
import { Loading } from './Loading'

interface DETFIndex {
    "chainId": number;
    "productId": number;
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
    console.log("DETFIndex", props.detfIndex)
    const FormatIndex = (data: Array<any>) => {
        /* const sorted = [...props.detfIndex].sort((a, b) =>
            a.returnOneWeek < b.returnOneWeek ? 1 : -1) */
        const formatted: Array<any> = []

        data.map((detf) => {
            formatted.push({
                "chainId": detf.chainId,
                "chainName": detf.chainName,
                "productId": detf.productId,
                "category": detf.category,
                "dimension": detf.dimension,
                "urlChainId": detf.urlChainId,
                "urlCategoryId": detf.urlCategoryId,
                "urlDimensionId": detf.urlDimensionId,
                "logos": detf.logos,
                "liquidity": FormatCurrency((Number(detf.liquidity) *
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
                "returnOneWeek": detf.returnOneWeek,
                "returnOneMonth": detf.returnOneMonth,
                "returnThreeMonths": detf.returnThreeMonths,
                "returnOneYear": detf.returnOneYear
            })
        })
        return formatted
    }

    /*  */
    /* const detfIndex = props.detfIndex */
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


    /* const FormatLogoChain = (logos: Array<string>) => {
        const formatted = <div className="token-logo-chain-items">
            {logos[0] && (<img className="token-logo-chain-item" src={logos[0]} style={{ marginLeft: `${160}px` }}></img>)}
            {logos[1] && (<img className="token-logo-chain-item" src={logos[1]} style={{ marginLeft: "144px" }}></img>)}
            {logos[2] && (<img className="token-logo-chain-item" src={logos[2]} style={{ marginLeft: "128px" }}></img>)}
            {logos[3] && (<img className="token-logo-chain-item" src={logos[3]} style={{ marginLeft: "112px" }}></img>)}
            {logos[4] && (<img className="token-logo-chain-item" src={logos[4]} style={{ marginLeft: "96px" }}></img>)}
            {logos[5] && (<img className="token-logo-chain-item" src={logos[5]} style={{ marginLeft: "80px" }}></img>)}
            {logos[6] && (<img className="token-logo-chain-item" src={logos[6]} style={{ marginLeft: "64px" }}></img>)}
            {logos[7] && (<img className="token-logo-chain-item" src={logos[7]} style={{ marginLeft: "48px" }}></img>)}
            {logos[8] && (<img className="token-logo-chain-item" src={logos[8]} style={{ marginLeft: "32px" }}></img>)}
            {logos[9] && (<img className="token-logo-chain-item" src={logos[9]} style={{ marginLeft: "16px" }}></img>)}
        </div>
        return formatted
    } */

    if (detfIndex) {
        return (
            <>
                <div className="detf-index-container">
                    <div className="detf-index-wrapper">
                        <div className="detf-index-header">
                            <div className="detf-index-header-item-detf" onClick={() => sorting("category")}>DETF</div>
                            <div className="detf-index-header-item-liquidity" onClick={() => sorting("liquidity")}>Total Liquidity</div>
                            <div className="detf-index-header-item-one-week" onClick={() => sorting("returnOneWeek")}>1 Week</div>
                            <div className="detf-index-header-item-one-month" onClick={() => sorting("returnOneMonth")}>1 Month</div>
                            <div className="detf-index-header-item-three-months" onClick={() => sorting("returnThreeMonths")}>3 Months</div>
                            <div className="detf-index-header-item-one-year" onClick={() => sorting("returnOneYear")}>1 Year</div>
                            {/* <div className="detf-index-header-item-logos"></div> */}
                            <div className="detf-index-header-item-view"></div>
                        </div>
                        <div>
                            {detfIndex.map((detf: any) =>
                                <div className="detf-index-row-items" key={detf.productId}>
                                    <div className="detf-index-row-item-detf">
                                        <div className="detf-index-row-item-name">
                                            <div className="detf-index-row-item-name-category" style={{ color: ColourCategories(detf.category) }}>
                                                {detf.category}
                                            </div>
                                            <div className="detf-index-chain-name-dimension">
                                                {detf.dimension}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detf-index-row-item-liquidity">{detf.liquidity}</div>
                                    <div className="detf-index-row-item-one-week" >{FormatPercentages(detf.returnOneWeek * 100)}</div>
                                    <div className="detf-index-row-item-one-month" >{FormatPercentages(detf.returnOneMonth * 100)}</div>
                                    <div className="detf-index-row-item-three-months" >{FormatPercentages(detf.returnThreeMonths * 100)}</div>
                                    <div className="detf-index-row-item-one-year" >{FormatPercentages(detf.returnOneYear * 100)}</div>
                                    {/* <div className="detf-index-row-item-logos">{FormatLogoChain(detf.logos)}</div> */}
                                    <div className="detf-index-row-item-view">
                                        <Link className="detf-index-row-item-link" to={`/detfs/${detf.urlChainId}/${detf.urlCategoryId}/${detf.urlDimensionId}`} >View</Link>
                                    </div>
                                </div>)
                            }
                        </div>
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