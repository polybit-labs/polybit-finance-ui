import { ColourCategories, ColourNumbers, DETFIconFilename } from "./utils/Formatting";
import "./pages/Category.css"
import { useEffect, useState } from "react";
import { GetPerformanceData, PerformanceData } from "./api/GetPerformanceData";
import { ReturnChartMini } from "./charts/ReturnChartMini";
import { Button, TextLink } from "./Buttons";
import { Link } from "react-router-dom";

interface DETFBoxProps {
    chainId: string;
    chainName: string;
    category: string;
    dimension: string;
    description: string;
}

export const CategoryDETFBox = (props: DETFBoxProps) => {

    const performanceUrl = `${props.chainId}/${props.category.replaceAll(" ", "-").toLowerCase()}/${props.dimension.replaceAll(" ", "-").toLowerCase()}`
    const [performanceData, setPerformanceData] = useState<Array<PerformanceData> | undefined>()
    const { response: performance, isLoading: performanceDataLoading, isSuccess: performanceDataSuccess } = GetPerformanceData((performanceUrl))

    useEffect(() => {
        performanceDataSuccess && setPerformanceData(performance)
    }, [performanceDataSuccess])

    const performanceData90Days = performanceData ? performanceData.slice(-90) : []
    const performanceData90DaysReturn = performanceData ? performanceData.slice(-1)[0].performance_90d : 0

    return (<>
        <div className="category-detf-header">
            <div className="category-detf-name-wrapper">
                <img className="category-detf-name-logo" src={require(`../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
                <div className="category-detf-name">
                    <div className="category-detf-name-category" style={{ color: ColourCategories(props.category) }}>
                        {props.category}
                    </div>
                    <div className="category-detf-name-dimension">
                        {props.dimension}
                    </div>
                </div>
            </div>
            <div className="category-detf-return" >
                <div className="category-detf-return-title">3 months</div>
                <div className="category-detf-return-amount" style={{ color: ColourNumbers(performanceData90DaysReturn) }}>{parseFloat((performanceData90DaysReturn * 100).toFixed(2)) + "%"}</div>
            </div>
        </div>
        {props.description}
        <div className="category-detf-chart">
            <ReturnChartMini height="90%" width="100%" performanceData={performanceData90Days} />
        </div>
        <Link className="detf-invest-button" to={`/detfs/${props.chainName.replaceAll(" ", "-").toLowerCase()}/${props.category.replaceAll(" ", "-").toLowerCase()}/${props.dimension.replaceAll(" ", "-").toLowerCase()}`} >
            <Button buttonStyle="primary" buttonSize="standard" text="Invest in this DETF" />
        </Link>
    </>)
}