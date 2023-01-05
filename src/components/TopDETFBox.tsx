import "./TopDETFs.css"
import { Link } from "react-router-dom";
import { ReturnChartMini } from "./charts/ReturnChartMini";
import { useEffect, useState } from "react";
import { GetPerformanceData } from "./api/GetPerformanceData";
import { PerformanceData } from "./api/GetPerformanceData";
import { ColourCategories, ColourNumbers, DETFIconFilename } from "./utils/Formatting";


interface TopDETFBoxProps {
    category: string;
    dimension: string;
    returnValue: number;
    totalLiquidity: number;
    urlCategoryId: string;
    urlChainId: string;
    urlDimensionId: string;
    period: string;
}

export const TopDETFBox = (props: TopDETFBoxProps) => {
    let productUrl = `${props.urlChainId}/${props.urlCategoryId}/${props.urlDimensionId}`
    const [performanceData, setPerformanceData] = useState<Array<PerformanceData> | undefined>()
    const [performanceDataPeriod, setPerformanceDataPeriod] = useState<number>(30)
    const { response: performance, isLoading: performanceDataLoading, isSuccess: performanceDataSuccess } = GetPerformanceData(productUrl)

    useEffect(() => {
        if (props.period === "this week") {
            setPerformanceDataPeriod(7)
        }
        if (props.period === "this month") {
            setPerformanceDataPeriod(30)
        }
        if (props.period === "this year") {
            setPerformanceDataPeriod(365)
        }
    }, [props.period, performanceDataSuccess])

    useEffect(() => {
        setPerformanceData(performance)
    }, [performanceDataSuccess])

    if (performanceData && performanceDataSuccess && props.returnValue) {
        return (
            <>
                <div className="top-detfs-box-header">
                    <div className="top-detfs-box-header-title">
                        <img className="top-detfs-box-header-title-logo" src={require(`../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
                        <div className="top-detfs-box-header-title-name">
                            <div className="top-detfs-box-header-title-name-category" style={{ color: ColourCategories(props.category) }}>{props.category}</div>
                            <div className="top-detfs-box-header-title-name-dimension" style={{ color: "#000000" }}>{props.dimension}</div>
                        </div>
                    </div>
                    <div style={{ color: ColourNumbers(props.returnValue) }}>{parseFloat(props.returnValue ? (props.returnValue * 100).toString() : "").toFixed(2) + "%"}</div>
                </div>
                <div className="top-detfs-box-chart">{<ReturnChartMini height={160} width={320} period={performanceDataPeriod} performanceData={performanceData} />}</div>
                <Link className="top-detfs-box-cta" to={`/detfs/${props.urlChainId}/${props.urlCategoryId}/${props.urlDimensionId}`}>
                    <h3>Invest in this strategy</h3></Link>
            </>)
    }
    return (
        <div></div>
    )
}