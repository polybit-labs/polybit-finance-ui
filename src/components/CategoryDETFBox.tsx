import { ColourCategories, ColourNumbers, DETFIconFilename } from "./utils/Formatting";
import "./pages/Category.css"
import { ReturnChartMini } from "./charts/ReturnChartMini";
import { Button } from "./Buttons/Buttons";
import { Link } from "react-router-dom";

interface DETFBoxProps {
    chainId: string;
    chainName: string;
    category: string;
    dimension: string;
    description: string;
    performance7d: number;
    performanceData: Array<number>;
}

export const CategoryDETFBox = (props: DETFBoxProps) => {
    if (props.performanceData) {
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
                    <div className="category-detf-return-title">1 week:</div>
                    <div className="category-detf-return-amount" style={{ color: ColourNumbers(props.performance7d) }}>{parseFloat((props.performance7d * 100).toFixed(2)) + "%"}</div>
                </div>
            </div>
            {props.description}
            <div className="category-detf-chart">
                <ReturnChartMini height="90%" width="100%" performanceData={props.performanceData} />
            </div>
            <Link className="detf-invest-button" to={`/themes/${props.chainName.replaceAll(" ", "-").toLowerCase()}/${props.category.replaceAll(" ", "-").toLowerCase()}/${props.dimension.replaceAll(" ", "-").toLowerCase()}`} >
                <Button buttonStyle="primary" buttonSize="standard" text="Invest in this theme" />
            </Link>
        </>)
    }

    return (
        <></>)
}