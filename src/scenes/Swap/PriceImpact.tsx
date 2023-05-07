import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { BigNumberToFloat } from "../../components/utils/Formatting";
import { ERC20Token } from "../../components/utils/ERC20Utils";
import { DEX } from "./Types/DEX";
import { GetDEXPrice } from "./GetDEXPrice";

interface PriceImpactProps {
    dexPrice: number;
    tokenOneInputValue: BigNumber | undefined;
    tokenTwoInputValue: BigNumber | undefined;
    amountType: number;
    tradingFee: number;
    tokenOne: ERC20Token;
    tokenTwo: ERC20Token;
    factory: DEX;
    path: readonly `0x${string}`[];
}
export const PriceImpact = (props: PriceImpactProps) => {
    const [priceImpact, setPriceImpact] = useState<any>(<div style={{ color: "black" }}>0%</div>)

    useEffect(() => {
        if (props.tokenOneInputValue && props.tokenTwoInputValue) {
            const tradingFeeAmount = Number(props.tradingFee) * BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals)
            const amountLessFee = BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals) + tradingFeeAmount
            const swapPrice = amountLessFee / BigNumberToFloat(props.tokenOneInputValue, props.tokenOne.decimals)
            const priceImpact = (swapPrice - props.dexPrice) / props.dexPrice

            if (priceImpact > 0.05) {
                setPriceImpact(<div style={{ color: "#F74040" }}>{`${parseFloat((priceImpact * 100).toString()).toFixed(2)}%`}</div>)
            }
            if (priceImpact < -0.0001) {
                setPriceImpact(<div style={{ color: "#000000" }}>{`<0.1%`}</div>)
            }
            setPriceImpact(<div style={{ color: "#000000" }}>{`${parseFloat((priceImpact * 100).toString()).toFixed(2)}%`}</div>)
        } else {
            const priceImpact = 0
        }
    }, [props.amountType, props.tokenOneInputValue, props.tokenTwoInputValue, props.dexPrice, props.tokenOne, props.tokenTwo])

    return priceImpact
}