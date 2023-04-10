import "./TokenDETFBox.css"
import { ReturnChartMini } from "./charts/ReturnChartMini"
import { ColourCategories, ColourNumbers, DETFIconFilename } from "./utils/Formatting"
import { TextLink } from "./Buttons"
import { useNetwork } from "wagmi";

interface TokenDETFBoxProps {
    urlCategoryId: string;
    urlChainId: string;
    urlDimensionId: string;
    return: number;
    performanceData: Array<any>;
}

export const TokenDETFBox = (props: TokenDETFBoxProps) => {
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    const productContent = require(`../product/detfs/${chainId}/${props.urlCategoryId}/${props.urlDimensionId}/content.json`)

    if (productContent && props.performanceData) {
        return (
            <div className="token-detf-box">
                <div className="token-detf-box-header">
                    <div className="token-detf-box-header-title">
                        <img className="token-detf-box-header-title-logo" src={require(`../assets/icons/${DETFIconFilename(productContent["category"], productContent["dimension"])}`)}></img>
                        <div className="token-detf-box-header-title-name">
                            <div className="token-detf-box-header-title-name-category" style={{ color: ColourCategories(productContent["category"]) }}>{productContent["category"]}</div>
                            <div className="token-detf-box-header-title-name-dimension" style={{ color: "#000000" }}>{productContent["dimension"]}</div>
                        </div>
                    </div>
                    <div className="token-detf-box-header-return" style={{ color: ColourNumbers(props.return) }}>{`${parseFloat(props.return ? (props.return * 100).toString() : "").toFixed(2)} % this week`}</div>
                </div>
                <div className="token-detf-box-chart">{<ReturnChartMini height="80%" width="100%" performanceData={props.performanceData} />}</div>
                <TextLink to={`/detfs/${props.urlChainId}/${props.urlCategoryId}/${props.urlDimensionId}`} text="Invest in this strategy" underline={true} />
            </div>)
    }
    return (
        <div></div>
    )
}