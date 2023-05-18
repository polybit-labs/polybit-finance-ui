import { Link } from "react-router-dom";
import "./TokenTableRow.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FormatCurrency } from "../../../../components/utils/Currency";
import { ColourNumbers, FormatPercentages } from "../../../../components/utils/Formatting";

interface TokenTableRowProps {
    "address": string;
    "name": string;
    "symbol": string;
    "logoURI": string;
    "decimals": number;
    "latest_price": number;
    "current_assets": number;
    "current_value": number;
    "purchase_value": number;
    "current_return": number;
    "currency": string;
    "vsPrices": any;
}

export const TokenTableRow = (props: TokenTableRowProps) => {
    return (
        <>
            <div className="token-table-row">
                <div className="token-table-row-items">
                    <div className="token-table-row-item-asset" >
                        <img className="token-table-row-item-logo" src={props.logoURI}></img>
                        <div className="token-table-row-item-name">
                            <div className="token-table-row-item-asset-name">{props.name}</div>
                            <div className="token-table-row-item-asset-symbol">{props.symbol}
                                <Link className="token-table-row-item-link-to-asset" to={`/assets/${props.name.replaceAll(" ", "-").replaceAll("_", "-").replaceAll("(", "").replaceAll(")", "").toLocaleLowerCase()}`}>
                                    <FontAwesomeIcon icon={icon({ name: "up-right-from-square", style: "solid" })} /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="token-table-row-item-value">
                        {FormatCurrency(props.current_value ? Number(props.current_value) : 0, 6)}
                    </div>
                    <div className="token-table-row-item-price">
                        {FormatCurrency(props.latest_price ? Number(props.latest_price) : 0, 6)}</div>
                    <div className="token-table-row-item-return" style={{ color: ColourNumbers(props.current_return) }}>
                        {FormatPercentages(props.current_return * 100)}</div>
                    <div className="token-table-row-item-cta">
                        <Link className="token-table-row-item-link-to-swap" to={`/swap?address=${props.address}`} >Swap</Link></div>
                </div>
            </div>
        </>)
}