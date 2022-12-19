import "./TopDETFs.css"
import { Link } from "react-router-dom";
import { ReturnChartMini } from "./ReturnChartMini";
import { useEffect, useState } from "react";
import { GetPerformanceData } from "./api/GetPerformanceData";
import { PerformanceData } from "./api/GetPerformanceData";
import { ColourCategories, ColourNumbers } from "./utils/Formatting";


interface TopDETFBoxProps {
    category: string;
    dimension: string;
    returnOneMonth: number;
    returnOneWeek: number;
    returnOneYear: number;
    returnThreeMonths: number;
    totalLiquidity: number;
    urlCategoryId: string;
    urlChainId: string;
    urlDimensionId: string;
    period: string;
}

export const TopDETFBox = (props: TopDETFBoxProps) => {
    //const S3PATH = "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/detfs/"
    let productUrl = `${props.urlChainId}/${props.urlCategoryId}/${props.urlDimensionId}`
    const [performanceData, setPerformanceData] = useState<Array<PerformanceData> | undefined>()
    const [performanceDataPeriod, setPerformanceDataPeriod] = useState<number>(30)
    const { response: performance, isLoading: performanceDataLoading, isSuccess: performanceDataSuccess } = GetPerformanceData(productUrl)
    const [returnValue, setReturnValue] = useState<number>(0)

    useEffect(() => {
        if (props.period === "this week") {
            setReturnValue(props.returnOneWeek)
            setPerformanceDataPeriod(7)
        }
        if (props.period === "this month") {
            setReturnValue(props.returnOneMonth)
            setPerformanceDataPeriod(30)
        }
        if (props.period === "this year") {
            setReturnValue(props.returnOneYear)
            setPerformanceDataPeriod(365)
        }
    }, [props.period])

    useEffect(() => {
        setPerformanceData(performance)
    }, [performanceDataSuccess])

    if (performanceData && performanceDataSuccess) {
        return (
            <>
                <div className="top-detfs-box-header">
                    <div className="top-detfs-box-header-title">
                        <img className="top-detfs-box-header-title-logo" src={require("../assets/images/placeholder.png")}></img>
                        <div className="top-detfs-box-header-title-name">
                            <div className="top-detfs-box-header-title-name-category" style={{ color: ColourCategories(props.category) }}>{props.category}</div>
                            <div className="top-detfs-box-header-title-name-dimension" style={{ color: "#000000" }}>{props.dimension}</div>
                        </div>
                    </div>
                    <div style={{ color: ColourNumbers(returnValue) }}>{parseFloat(returnValue ? (returnValue * 100).toString() : "").toFixed(2) + "%"}</div>
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