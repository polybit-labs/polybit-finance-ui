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
        return <div style={{ transform: "translateY(+15%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} />&nbsp;</div>
    }
    if (num < 0) {
        return <div style={{ transform: "translateY(-15%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} />&nbsp;</div>
    }
    return "";
}

export const FormatPercentages = (percentage: number) => {
    return <div className="formatted-percentages" style={{ color: ColourNumbers(percentage), display: "flex", alignItems: "left", justifyContent: "left", textAlign: "left" }}>
        <div>{ArrowNumbers(percentage)}</div>
        <div>{parseFloat(percentage.toString()).toFixed(2).replace("-", "") + "%"}</div>
    </div>
}

export const ColourCategories = (category: string) => {
    if (category === "DeFi") { return "#2100E9" }
    if (category === "Governance") { return "#24A78F" }
    if (category === "BSC Index Top 10") { return "#CD9A00" }
    if (category === "Metaverse") { return "#E5008A" }
    return "#000000"
}

export const DETFIconFilename = (category: string, dimension: string) => {
    const filename = `${category.replaceAll(" ", "_").toLowerCase()}__${dimension.replaceAll(" ", "_").toLowerCase()}.png`
    return filename
}

export const toTitleCase = (str: string) => {
    str = str.replaceAll("-", " ")
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}