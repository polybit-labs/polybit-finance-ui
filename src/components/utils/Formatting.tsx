import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils.js';

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

export const FormatDecimals = (num: number) => {
    if (num >= 100) {
        return Number(parseFloat(num.toString()).toFixed(3))
    } else if (num < 100 && num >= 10) {
        return Number(parseFloat(num.toString()).toFixed(4))
    } else if (num < 10 && num >= 1) {
        return Number(parseFloat(num.toString()).toFixed(5))
    } else if (num < 1 && num >= 0.1) {
        return Number(parseFloat(num.toString()).toFixed(6))
    } else if (num < 0.1 && num >= 0.01) {
        return Number(parseFloat(num.toString()).toFixed(7))
    } else if (num < 0.01 && num >= 0.001) {
        return Number(parseFloat(num.toString()).toFixed(8))
    } else if (num < 0.001 && num >= 0.0001) {
        return Number(parseFloat(num.toString()).toFixed(9))
    } else if (num < 0.0001 && num >= 0.00001) {
        return Number(parseFloat(num.toString()).toFixed(10))
    } else {
        return num
    }
}

const BigNumberJS = require('bignumber.js');
export const BigNumberToFloat = (num: BigNumber, decimals: number) => {
    let numerator = new BigNumberJS(num)
    let denominator = new BigNumberJS(10).pow(decimals)
    let answer = numerator.div(denominator).toNumber()
    return answer
}

export const FloatToBigNumber = (num: number, decimals: number) => {
    let numerator = new BigNumberJS(num)
    let denominator = new BigNumberJS(10).pow(decimals)
    let answer = numerator.mul(denominator).toFixed(0)
    let BNAnswer = BigNumber.from(answer)
    return BNAnswer
}

