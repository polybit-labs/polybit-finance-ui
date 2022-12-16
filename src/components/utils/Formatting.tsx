import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'

export const TruncateAddress = (address: string) => {
    if (!address) return "No Account";
    const match = address.match(
        /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export const ColourNumbers = (num: number) => {
    if (num > 0) {
        return "#0FC421"
    }
    if (num < 0) {
        return "#C20000"
    }
    return "#909090"
}

const ArrowNumbers = (num: number) => {
    if (num > 0) {
        return <FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} />
    }
    if (num < 0) {
        return <FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} />
    }
    return "";
}

export const FormatPercentages = (percentage: number) => {
    return <div className="formatted-percentages" style={{ color: ColourNumbers(percentage), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "15px", paddingBottom: "0px" }}>{ArrowNumbers(percentage)}</div>
        <div>{parseFloat(percentage.toString()).toFixed(2).replace("-", "") + "%"}</div>
    </div>
}

export const ColourCategories = (category: string) => {
    if (category === "Defi") { return "#2100E9" }
    if (category === "Governance") { return "#2EB100" }
    if (category === "Web3 Gaming") { return "#FF0000" }
    if (category === "BSC Index Top 10") { return "#0094E8" }
    if (category === "Metaverse") { return "#E5008A" }
    return "#000000"
}