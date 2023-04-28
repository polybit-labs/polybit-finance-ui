import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { BigNumberToFloat } from "../utils/Formatting";
import { ERC20Token } from "../utils/ERC20Utils";

interface PriceImpactProps {
    dexPrice: number;
    tokenOneInputValue: BigNumber;
    tokenTwoInputValue: BigNumber;
    amountType: number;
    tradingFee: number;
    tokenOne: ERC20Token;
    tokenTwo: ERC20Token;
}
export const PriceImpact = (props: PriceImpactProps) => {
    const [priceImpact, setPriceImpact] = useState<any>(<div style={{ color: "black" }}>0%</div>)

    useEffect(() => {
        const tradingFeeAmount = Number(props.tradingFee) * BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals)
        const amountLessFee = BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals) + tradingFeeAmount
        const swapPrice = amountLessFee / BigNumberToFloat(props.tokenOneInputValue, props.tokenOne.decimals)
        const priceImpact = 1 - (swapPrice / props.dexPrice)

        if (priceImpact > 0.05) {
            setPriceImpact(<div style={{ color: "red" }}>{`${parseFloat((priceImpact * 100).toString()).toFixed(2)}%`}</div>)
        }
        setPriceImpact(<div style={{ color: "black" }}>{`${parseFloat((priceImpact * 100).toString()).toFixed(2)}%`}</div>)
    }, [props.amountType, props.tokenOneInputValue, props.tokenTwoInputValue, props.dexPrice])

    return priceImpact
}