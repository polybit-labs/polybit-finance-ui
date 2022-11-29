import { useState, useContext, useEffect } from 'react'
import "./DETFIndexList.css"
import { getNumValueColor } from '../utils'
import { Link } from "react-router-dom"
import detfIndexInfo from "../product/detfIndex.json"
import { FormatCurrency, CurrencyContext } from "./utils/Currency"

interface DETFIndex {
    "chainId": number;
    "productId": number;
    "category": string;
    "dimension": string;
    "liquidity": number;
    "returnOneWeek": number;
    "returnOneMonth": number;
    "returnThreeMonths": number;
    "returnOneYear": number;
}

const DETFIndexList = () => {
    //const [detfIndexData, setDETFIndexData] = useState(detfIndex)

    const [liquidityCurrency, setLiquidityCurrency] = useState("BNB")
    const currency = useContext(CurrencyContext).currency
    useEffect(() => {
        setLiquidityCurrency(currency)
    }, [currency])

    const GetDETFIndex = () => {
        let detfIndex: Array<any> = []
        {
            detfIndexInfo?.map((index =>
                detfIndex.push({
                    "chainId": index.chainId,
                    "chainName": "BNB Smart Chain",
                    "productId": index.productId,
                    "category": index.category,
                    "dimension": index.dimension,
                    "urlChainId": index.urlChainId,
                    "urlCategoryId": index.urlCategoryId,
                    "urlDimensionId": index.urlDimensionId,
                    "liquidity": GetDETFData(`${index.urlChainId}/${index.urlCategoryId}/${index.urlDimensionId}`)[0],
                    "returnOneWeek": GetDETFData(`${index.urlChainId}/${index.urlCategoryId}/${index.urlDimensionId}`)[1],
                    "returnOneMonth": GetDETFData(`${index.urlChainId}/${index.urlCategoryId}/${index.urlDimensionId}`)[2],
                    "returnThreeMonths": GetDETFData(`${index.urlChainId}/${index.urlCategoryId}/${index.urlDimensionId}`)[3],
                    "returnOneYear": GetDETFData(`${index.urlChainId}/${index.urlCategoryId}/${index.urlDimensionId}`)[4],
                })))
        }
        return detfIndex
    }

    const GetDETFData = (url: string,) => {
        console.log(url)
        let productData
        let performanceData
        let liquidity = 0
        let returnOneWeek: number = 0
        let returnOneMonth: number = 0
        let returnThreeMonths: number = 0
        let returnOneYear: number = 0
        let returnTwoYear: number = 0

        try {
            productData = require(`../product/detfs/${url}/product-data.json`)
        } catch {
            console.log(`Token data ${url} file not found.`)
        }

        try {
            performanceData = require(`../product/detfs/${url}/performance-data.json`)
        } catch {
            console.log(`Performance data ${url} file not found.`)
        }

        if (productData) {
            liquidity = (() => {
                switch (liquidityCurrency) {
                    case "AUD": return (productData.total_liquidity.liquidity_aud)
                    case "BNB": return (productData.total_liquidity.liquidity_bnb)
                    case "CNY": return (productData.total_liquidity.liquidity_cny)
                    case "EURO": return (productData.total_liquidity.liquidity_eur)
                    case "IDR": return (productData.total_liquidity.liquidity_idr)
                    case "JPY": return (productData.total_liquidity.liquidity_jpy)
                    case "KRW": return (productData.total_liquidity.liquidity_krw)
                    case "RUB": return (productData.total_liquidity.liquidity_rub)
                    case "TWD": return (productData.total_liquidity.liquidity_twd)
                    case "USD": return (productData.total_liquidity.liquidity_usd)
                }
            })()

            returnOneWeek = performanceData.at(-1).performance_7d
            returnOneMonth = performanceData.at(-1).performance_30d
            returnThreeMonths = performanceData.at(-1).performance_90d
            returnOneYear = performanceData.at(-1).performance_365d
            returnTwoYear = performanceData.at(-1).performance_730d
        }
        return [liquidity, returnOneWeek, returnOneMonth, returnThreeMonths, returnOneYear, returnTwoYear]
    }

    const [detfIndexData, setDETFIndexData] = useState(GetDETFIndex())
    const [order, setOrder] = useState("asc")
    const sorting = (column: any) => {
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

    return (
        <>
            <div className="detf-index-container">
                <div className="detf-index-wrapper">
                    <div className="detf-index-header">
                        <div className="detf-index-header-item" onClick={() => sorting("category")}>Category</div>
                        <div className="detf-index-header-item" onClick={() => sorting("dimension")}>Dimension</div>
                        <div className="detf-index-header-item" onClick={() => sorting("liquidity")}>Total Liquidity</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnOneWeek")}>1 Week</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnOneMonth")}>1 Month</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnThreeMonths")}>3 Months</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnOneYear")}>1 Year</div>
                        <div className="detf-index-header-item"></div>
                    </div>
                    <div>
                        {detfIndexData.map((index) =>
                            <div className="detf-index-row-items" key={index.productId}>
                                <div className="detf-index-row-item">
                                    <div className="detf-index-row-item-name">
                                        {index.category}
                                        {/* <div className="detf-index-chain-title">
                                            <img className="detf-index-chain-logo" src={require("../assets/images/bsc-logo.png")} alt="Binance Smart Chain"></img>
                                            {index.dimension}
                                        </div> */}
                                    </div>
                                </div>
                                <div className="detf-index-row-item">
                                    {index.dimension}
                                </div>
                                <div className="detf-index-row-item">{FormatCurrency(Number(GetDETFData(`${index.urlChainId}/${index.urlCategoryId}/${index.urlDimensionId}`)[0]), 0)}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneWeek) }}>{parseFloat((index.returnOneWeek * 100).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneMonth) }}>{parseFloat((index.returnOneMonth * 100).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnThreeMonths) }}>{parseFloat((index.returnThreeMonths * 100).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneYear) }}>{parseFloat((index.returnOneYear * 100).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item">
                                    <Link className="detf-index-row-item-link" to={`/detfs/${index.urlChainId}/${index.urlCategoryId}/${index.urlDimensionId}`} ><u>View this DETF</u></Link>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default DETFIndexList