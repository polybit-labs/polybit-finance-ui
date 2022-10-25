import { useState } from 'react'
import "./DETFIndexList.css"
import { getNumValueColor } from '../utils'
import { Link } from "react-router-dom"
import detfIndex from "../product/detfIndex.json"
import { GetTotalLiquidity } from "./utils/Liquidity"
import { FormatCurrency } from "./utils/Currency"

interface DETFIndex {
    "chainId": number;
    "detfId": number;
    "detfOracleAddress": string;
    "detfName": string;
    "liquidity": number;
    "returnOneWeek": number;
    "returnOneMonth": number;
    "returnOneYear": number;
}

const DETFIndexList = () => {
    const [detfIndexData, setDETFIndexData] = useState(detfIndex)
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

    const GetDETFLiquidity = (urlId: string) => {
        let productFile
        try {
            productFile = require(`../product/detfs/${urlId}.json`)
        } catch {
            console.log("File not found.")
        }

        if (productFile) {
            const chainId: number = productFile[0].chainId
            const tokens: Array<any> = [] = productFile[0].tokens
            const totalLiquidity: number = GetTotalLiquidity({ tokens }, chainId)
            return totalLiquidity ? totalLiquidity : 0
        }
    }

    return (
        <>
            <div className="detf-index-container">
                <div className="detf-index-wrapper">
                    <div className="detf-index-header">
                        <div className="detf-index-header-item" onClick={() => sorting("detfName")}>DETF Strategy</div>
                        <div className="detf-index-header-item" onClick={() => sorting("liquidity")}>Total Liquidity</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnOneWeek")}>1 Week</div>
                        <div className="detf-index-header-item" onClick={() => sorting("returnOneMonth")}>1 Month</div>
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
                                <div className="detf-index-row-item">{FormatCurrency(Number(GetDETFLiquidity(index.urlId)), 0)}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneWeek) }}>{parseFloat((index.returnOneWeek).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneMonth) }}>{parseFloat((index.returnOneMonth).toString()).toFixed(2) + "%"}</div>
                                <div className="detf-index-row-item" style={{ color: getNumValueColor(index.returnOneYear) }}>{parseFloat((index.returnOneYear).toString()).toFixed(2) + "%"}</div>
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