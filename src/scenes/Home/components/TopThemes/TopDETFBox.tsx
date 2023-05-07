import "./TopDETFs.css"
import { ReturnChartMini } from "../../../../components/charts/ReturnChartMini"
import { ColourCategories, ColourNumbers, DETFIconFilename } from "../../../../components/utils/Formatting"
import { TextLink } from "../../../../components/Buttons/TextLink"

interface TopDETFBoxProps {
    category: string;
    dimension: string;
    returnValue: number;
    totalLiquidity: number;
    urlCategoryId: string;
    urlChainId: string;
    urlDimensionId: string;
    performanceData: Array<any>;
}

export const TopDETFBox = (props: TopDETFBoxProps) => {
    let productUrl = `${props.urlChainId}/${props.urlCategoryId}/${props.urlDimensionId}`

    if (props.returnValue) {
        return (
            <div className="top-detfs-box">
                <div className="top-detfs-box-header">
                    <div className="top-detfs-box-header-title">
                        <img className="top-detfs-box-header-title-logo" src={require(`../../../../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
                        <div className="top-detfs-box-header-title-name">
                            <div className="top-detfs-box-header-title-name-category" style={{ color: ColourCategories(props.category) }}>{props.category}</div>
                            <div className="top-detfs-box-header-title-name-dimension" style={{ color: "#000000" }}>{props.dimension}</div>
                        </div>
                    </div>
                    <div className="top-detfs-box-header-return" style={{ color: ColourNumbers(props.returnValue) }}>{parseFloat(props.returnValue ? (props.returnValue * 100).toString() : "").toFixed(2) + "%"}</div>
                </div>
                <div className="top-detfs-box-chart">{<ReturnChartMini height="80%" width="100%" performanceData={props.performanceData} />}</div>
                <TextLink to={`/themes/${props.urlChainId}/${props.urlCategoryId}/${props.urlDimensionId}`} text="Invest in this theme" underline={true} />
            </div>)
    }
    return (
        <div></div>
    )
}