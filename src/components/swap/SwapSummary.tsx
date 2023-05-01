import "./SwapSummary.css"
import {
    useAccount,
    useNetwork,
    useBalance,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction
} from "wagmi"

import { Loading } from '../Loading'
import { BigNumberToFloat, FormatDecimals } from '../utils/Formatting'
import { BigNumber } from 'ethers'
import { ERC20Token } from '../utils/ERC20Utils'
import { DEX } from './Types/DEX'
import { PriceImpact } from "./PriceImpact"
import { GetAssetLogo } from "./GetAssetLogo"
import { Allowance, Approve, SwapETHForExactTokens, SwapExactETHForTokens, SwapExactTokensForETH, SwapExactTokensForTokens, SwapTokensForExactETH } from "./SwapButton"
import PolybitInfo from "../../chain_info/PolybitInfo.json"
import { TextLink } from "../Buttons"
import { useEffect, useState } from "react"

interface SwapSummary {
    chainId: string;
    approvedList: Array<ERC20Token>
    tokenOne: ERC20Token;
    tokenTwo: ERC20Token;
    tokenOneInputValue: BigNumber;
    tokenTwoInputValue: BigNumber;
    factory: DEX;
    path: readonly `0x${string}`[];
    amountsOut: BigNumber;
    amountOutMin: BigNumber;
    amountInMax: BigNumber;
    amountType: number;
    slippage: number;
    deadline: number;
    tradingFee: number;
    tradingFeeAmount: BigNumber;
    dexPrice: number;
    setShowSwapBox: Function;
    setShowSwapSummary: Function;
    walletOwner: `0x${string}` | undefined;
    walletBalance: BigNumber;
    swapType: "swapETHForExactTokens" | "swapExactETHForTokens" | "swapExactTokensForETH" | "swapExactTokensForTokens" | "swapTokensForExactETH" | "swapTokensForExactTokens" | undefined;
}

export const SwapSummary = (props: SwapSummary) => {
    const swapRouterAddress: string = PolybitInfo[props.chainId as keyof typeof PolybitInfo]["addresses"]["swap_router"]
    const [spenderApproved, setSpenderApproved] = useState<boolean>(false)

    const checkApproved: boolean = props.walletOwner ? Allowance({
        token: props.path[0],
        user: props.walletOwner,
        spender: swapRouterAddress as `0x${string}`,
        amount: props.tokenOneInputValue
    })
        : false

    useEffect(() => {
        setSpenderApproved(checkApproved)
    }, [checkApproved])

    if (props.amountOutMin && props.amountInMax && props.walletOwner) {
        return (
            <div className="swap-summary">
                <div className="swap-summary-container">
                    <h2>Your Swap summary</h2>
                    <div className="swap-summary-info">
                        <div className="swap-summary-info-bar"></div>
                        <table className="swap-summary-table">
                            <tbody>
                                <tr>
                                    {props.amountType === 0 && <td className="swap-summary-table-cell-title">Sending</td>}
                                    {props.amountType === 1 && <td className="swap-summary-table-cell-title">Estimated Sending</td>}
                                    <td className="swap-summary-table-cell-contents">{`${FormatDecimals(BigNumberToFloat(props.tokenOneInputValue, props.tokenOne.decimals))} ${props.tokenOne.symbol}`}</td>
                                </tr>
                                <tr>
                                    <td className="swap-summary-table-cell-title">Swap fee</td>
                                    <td className="swap-summary-table-cell-contents">{`${FormatDecimals(BigNumberToFloat(props.tokenOneInputValue.mul(10000 * ((props.path.length - 1) * props.tradingFee)).div(10000), props.tokenOne.decimals))}  ${props.tokenOne.symbol}`}</td>
                                </tr>
                                <tr>
                                    <td className="swap-summary-table-cell-title">Price impact</td>
                                    <td className="swap-summary-table-cell-contents">
                                        <PriceImpact dexPrice={props.dexPrice}
                                            tokenOneInputValue={props.tokenOneInputValue}
                                            tokenTwoInputValue={props.tokenTwoInputValue}
                                            amountType={props.amountType}
                                            tradingFee={props.tradingFee}
                                            tokenOne={props.tokenOne}
                                            tokenTwo={props.tokenTwo}
                                            factory={props.factory}
                                            path={props.path} /></td>
                                </tr>
                                <tr>
                                    <td className="swap-summary-table-cell-title">Liquid Path</td>
                                    <td className="swap-summary-table-cell-contents">
                                        <div className="swap-summary-table-cell-contents-liquid-path">
                                            <img className="swap-summary-table-cell-contents-liquid-path-factory" src={props.factory.logoURI} alt={props.factory.name} />
                                            <div className="swap-summary-table-cell-contents-liquid-path-line"></div>
                                            <div className="swap-summary-table-cell-contents-liquid-path-assets">
                                                {props.path?.map((asset: string, index: number) =>
                                                    <>
                                                        <img key={index} className="swap-summary-table-cell-contents-liquid-path-asset" src={GetAssetLogo(asset, props.approvedList)[1] ? GetAssetLogo(asset, props.approvedList)[1] : require("../../assets/images/placeholder.png")} alt={GetAssetLogo(asset, props.approvedList)[0]} />
                                                        {index < props.path.length - 1 && <div>{">"}</div>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="swap-summary-table-cell-title">Wallet recipient</td>
                                    <td className="swap-summary-table-cell-contents">
                                        {props.chainId === "97" && <a href={`https://testnet.bscscan.com/address/${props.walletOwner}`} target="_blank" rel="noopener noreferrer"><p>{props.walletOwner}</p></a>}
                                        {props.chainId !== "97" && <a href={`https://testnet.bscscan.com/address/${props.walletOwner}`} target="_blank" rel="noopener noreferrer"><p>{props.walletOwner}</p></a>}
                                    </td>
                                </tr>
                                {props.amountType === 0 && <tr>
                                    <td className="swap-summary-table-cell-title-2nd-last">Minimum receiving</td>
                                    <td className="swap-summary-table-cell-contents-2nd-last">{`${FormatDecimals(BigNumberToFloat(props.amountOutMin, props.tokenTwo.decimals))} ${props.tokenTwo.symbol}`} </td>
                                </tr>}
                                {props.amountType === 1 && <tr>
                                    <td className="swap-summary-table-cell-title-2nd-last">Maximum sending</td>
                                    <td className="swap-summary-table-cell-contents-2nd-last">{`${FormatDecimals(BigNumberToFloat(props.amountInMax, props.tokenOne.decimals))} ${props.tokenOne.symbol}`}</td>
                                </tr>}
                                {props.amountType === 0 && <tr>
                                    <td className="swap-summary-table-cell-title-final">Estimated receiving</td>
                                    <td className="swap-summary-table-cell-contents-final">{`${FormatDecimals(BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals))} ${props.tokenTwo.symbol}`}</td>
                                </tr>}
                                {props.amountType === 1 && <tr>
                                    <td className="swap-summary-table-cell-title-final">Receiving</td>
                                    <td className="swap-summary-table-cell-contents-final">{`${FormatDecimals(BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals))} ${props.tokenTwo.symbol}`}</td>
                                </tr>}
                            </tbody>
                        </table>
                    </div>
                    {props.swapType === "swapETHForExactTokens" && <SwapETHForExactTokens
                        swapRouterAddress={swapRouterAddress}
                        tokenOneInputValue={props.tokenOneInputValue}
                        tokenTwoInputValue={props.tokenTwoInputValue}
                        factory={props.factory}
                        path={props.path}
                        amountOutMin={props.amountOutMin}
                        amountInMax={props.amountInMax}
                        deadline={props.deadline}
                        walletOwner={props.walletOwner}
                        walletBalance={props.walletBalance} />}
                    {props.swapType === "swapExactETHForTokens" && <SwapExactETHForTokens
                        swapRouterAddress={swapRouterAddress}
                        tokenOneInputValue={props.tokenOneInputValue}
                        tokenTwoInputValue={props.tokenTwoInputValue}
                        factory={props.factory}
                        path={props.path}
                        amountOutMin={props.amountOutMin}
                        amountInMax={props.amountInMax}
                        deadline={props.deadline}
                        walletOwner={props.walletOwner}
                        walletBalance={props.walletBalance} />}

                    {props.swapType === "swapExactTokensForETH" && spenderApproved && <SwapExactTokensForETH
                        swapRouterAddress={swapRouterAddress}
                        tokenOneInputValue={props.tokenOneInputValue}
                        tokenTwoInputValue={props.tokenTwoInputValue}
                        factory={props.factory}
                        path={props.path}
                        amountOutMin={props.amountOutMin}
                        amountInMax={props.amountInMax}
                        deadline={props.deadline}
                        walletOwner={props.walletOwner}
                        walletBalance={props.walletBalance} />}
                    {props.swapType === "swapExactTokensForETH" && !spenderApproved && <Approve
                        token={props.path[0]}
                        user={props.walletOwner}
                        spender={swapRouterAddress as `0x${string}`}
                        amount={props.tokenOneInputValue} />}

                    {props.swapType === "swapExactTokensForTokens" && spenderApproved && <SwapExactTokensForTokens
                        swapRouterAddress={swapRouterAddress}
                        tokenOneInputValue={props.tokenOneInputValue}
                        tokenTwoInputValue={props.tokenTwoInputValue}
                        factory={props.factory}
                        path={props.path}
                        amountOutMin={props.amountOutMin}
                        amountInMax={props.amountInMax}
                        deadline={props.deadline}
                        walletOwner={props.walletOwner}
                        walletBalance={props.walletBalance} />}
                    {props.swapType === "swapExactTokensForTokens" && !spenderApproved && <Approve
                        token={props.path[0]}
                        user={props.walletOwner}
                        spender={swapRouterAddress as `0x${string}`}
                        amount={props.tokenOneInputValue} />}

                    {props.swapType === "swapTokensForExactETH" && spenderApproved && <SwapTokensForExactETH
                        swapRouterAddress={swapRouterAddress}
                        tokenOneInputValue={props.tokenOneInputValue}
                        tokenTwoInputValue={props.tokenTwoInputValue}
                        factory={props.factory}
                        path={props.path}
                        amountOutMin={props.amountOutMin}
                        amountInMax={props.amountInMax}
                        deadline={props.deadline}
                        walletOwner={props.walletOwner}
                        walletBalance={props.walletBalance} />}
                    {props.swapType === "swapTokensForExactETH" && !spenderApproved && <Approve
                        token={props.path[0]}
                        user={props.walletOwner}
                        spender={swapRouterAddress as `0x${string}`}
                        amount={props.tokenOneInputValue} />}

                    {/* SwapExactTokensForTokens */}
                    {/* SwapTokensForExactETH */}

                    <TextLink to="" text="Make changes" arrowDirection="back" onClick={() => { props.setShowSwapBox(true); props.setShowSwapSummary(false) }} />
                </div>
            </div>
        )
    }

    return (<></>)



    /*   if (transactionLoading) {
          return (
              <Loading loadingMsg="Sending transaction to the blockchain" />
          )
      }  */
}