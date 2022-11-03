import { useState, useContext, useEffect } from 'react'
import "./DETFIndexList.css"
import { getNumValueColor } from '../utils'
import { Link } from "react-router-dom"
import detfIndexInfo from "../product/detfIndex.json"
import { FormatCurrency, CurrencyContext } from "./utils/Currency"

interface DETFIndex {
    "chainId": number;
    "detfId": number;
    "detfOracleAddress": string;
    "detfName": string;
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

    const GetDETFData = (urlId: string) => {
        console.log(urlId)
        let productData
        let performanceData
        let liquidity = 0
        let returnOneWeek: number = 0
        let returnOneMonth: number = 0
        let returnThreeMonths: number = 0
        let returnOneYear: number = 0
        let returnTwoYear: number = 0

        try {
            productData = require(`../product/detfs/${urlId}/token_data.json`)
            performanceData = require(`../product/detfs/${urlId}/rw_liquidity.json`)
        } catch {
            console.log("Product file not found.")
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

            returnOneWeek = performanceData.at(-1).rw_liquidity_7d
            returnOneMonth = performanceData.at(-1).rw_liquidity_30d
            returnThreeMonths = performanceData.at(-1).rw_liquidity_90d
            returnOneYear = performanceData.at(-1).rw_liquidity_365d
            returnTwoYear = performanceData.at(-1).rw_liquidity_730d
        }
        return [liquidity, returnOneWeek, returnOneMonth, returnThreeMonths, returnOneYear, returnTwoYear]
    }

    const GetDETFIndex = () => {
        let detfIndex: Array<any> = []
        {
            detfIndexInfo?.map((index => detfIndex.push({
                "chainId": index.chainId,
                "chainName": "BNB Smart Chain",
                "detfId": index.detfName,
                "detfOracleAddress": index.detfOracleAddress,
                "urlId": index.urlId,
                "detfName": index.detfName,
                "liquidity": GetDETFData(index.urlId)[0],
                "returnOneWeek": GetDETFData(index.urlId)[1],
                "returnOneMonth": GetDETFData(index.urlId)[2],
                "returnThreeMonths": GetDETFData(index.urlId)[3],
                "returnOneYear": GetDETFData(index.urlId)[4],
            })))
        }
        return detfIndex
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
                        <div className="detf-index-header-item" onClick={() => sorting("detfName")}>Strategy</div>
                        <div className="detf-index-header-item" onClick={() => sorting("liquidity")}>Total Liquidity</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnOneWeek")}>1 Week</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnOneMonth")}>1 Month</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnThreeMonths")}>3 Months</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnOneYear")}>1 Year</div>
                        <div className="detf-index-header-item"></div>
                    </div>
                    <div>
                        {detfIndexData.map((index) =>
                            <div className="detf-index-row-items" key={index.detfId}>
                                <div className="detf-index-row-item">
                                    <div className="detf-index-row-item-name">
                                        {index.detfName}
                                        <div className="detf-index-chain-title">
                                            <img className="detf-index-chain-logo" src={require("../assets/images/bsc-logo.png")} alt="Binance Smart Chain"></img>
                                            {index.chainName}
                                        </div>
                                    </div>
                                </div>
                                <div className="detf-index-row-item">{FormatCurrency(Number(GetDETFData(index.urlId)[0]), 0)}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneWeek) }}>{parseFloat((index.returnOneWeek * 100).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneMonth) }}>{parseFloat((index.returnOneMonth * 100).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnThreeMonths) }}>{parseFloat((index.returnThreeMonths * 100).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneYear) }}>{parseFloat((index.returnOneYear * 100).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item">
                                    <Link className="detf-index-row-item-link" to={`/detfs/${index.urlId}`} ><u>View this DETF</u></Link>
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