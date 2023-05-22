import "./SwapSummary.css"
import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction
} from "wagmi"

import { Loading } from "../../components/Loading/Loading"
import { BigNumberToFloat, FormatDecimals, TruncateAddress } from '../../components/utils/Formatting'
import { BigNumber } from 'ethers'
import { ERC20Token } from '../../components/utils/ERC20Utils'
import { DEX } from './Types/DEX'
import { PriceImpact } from "./PriceImpact"
import { GetAssetLogo } from "./GetAssetLogo"
import { Allowance } from "./Allowance"
import { Approve } from "./Approve"
import PolybitInfo from "../../context/PolybitInfo.json"
import { Button } from "../../components/Buttons/Buttons"
import { TextLink } from "../../components/Buttons/TextLink"
import { useEffect, useState } from "react"
import { SwapSuccess } from "./SwapSuccess"
import { IPolybitSwapRouter } from "../../context/abi/IPolybitSwapRouter"
import moment from 'moment'

interface SwapSummaryProps {
    isConnected: boolean;
    chainId: string;
    approvedList: Array<ERC20Token>
    nativeSymbol: string;
    tokenOne: ERC20Token;
    tokenTwo: ERC20Token;
    tokenOneInputValue: BigNumber | undefined;
    tokenTwoInputValue: BigNumber | undefined;
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
    setShowTitle: Function;
    walletOwner: `0x${string}` | undefined;
    walletBalance: BigNumber;
    swapType: "swapETHForExactTokens" | "swapExactETHForTokens" | "swapExactTokensForETH" | "swapExactTokensForTokens" | "swapTokensForExactETH" | "swapTokensForExactTokens" | undefined;
}

export const SwapSummary = (props: SwapSummaryProps) => {
    const swapRouterAddress: string = PolybitInfo[props.chainId as keyof typeof PolybitInfo]["addresses"]["swap_router"]
    const [txHash, setTxHash] = useState<string>("")
    const [swapArgs, setSwapArgs] = useState<any>({})
    const [swapOverrideArgs, setSwapOverrideArgs] = useState<any>({})
    const [spenderApproved, setSpenderApproved] = useState<boolean>(false)
    console.log(spenderApproved)

    const swapTypeArgs = {
        "swapETHForExactTokens": [props.factory.address, props.path, props.tokenTwoInputValue, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        "swapExactETHForTokens": [props.factory.address, props.path, props.amountOutMin, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        "swapExactTokensForETH": [props.factory.address, props.path, props.tokenOneInputValue, props.amountOutMin, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        "swapExactTokensForTokens": [props.factory.address, props.path, props.tokenOneInputValue, props.amountOutMin, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        "swapTokensForExactETH": [props.factory.address, props.path, props.tokenTwoInputValue, props.amountInMax, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        "swapTokensForExactTokens": [props.factory.address, props.path, props.tokenTwoInputValue, props.amountInMax, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
    }

    useEffect(() => {
        setSwapArgs(swapTypeArgs[props.swapType as keyof typeof swapTypeArgs])
        if (props.tokenOne.symbol === props.nativeSymbol) {
            setSwapOverrideArgs({ "from": props.walletOwner, "value": props.tokenOneInputValue })
        }
    }, [props.swapType, props.tokenOne])

    const checkApproved: boolean = props.walletOwner ? Allowance({
        token: props.path[0],
        user: props.walletOwner,
        spender: swapRouterAddress as `0x${string}`,
        amount: props.tokenOneInputValue ? props.tokenOneInputValue : BigNumber.from(0)
    })
        : false

    const { config, isSuccess: configIsSuccess, refetch } = usePrepareContractWrite({
        address: swapRouterAddress as `0x${string}`,
        abi: IPolybitSwapRouter,
        functionName: props.swapType,
        args: swapArgs,
        overrides: swapOverrideArgs,
        onError(error) {
            console.log('swapTokensForExactTokens Config Error', error)
        },
        onSuccess(data) {
            console.log('swapTokensForExactTokens Config Success', data)
        },
    })

    const { data, write, reset } = useContractWrite(config)

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onError(error) {
            console.log('write swap Error', error)
        },
        onSettled(data, error) {
            console.log("write swap data", data)
            setTxHash(data?.transactionHash as string)
            props.setShowTitle(false)
        },
    })

    if (props.isConnected &&
        props.amountOutMin &&
        props.amountInMax &&
        props.walletOwner &&
        !transactionSuccess &&
        !transactionLoading) {
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
                                    <td className="swap-summary-table-cell-contents">{`${props.tokenOneInputValue && FormatDecimals(BigNumberToFloat(props.tokenOneInputValue, props.tokenOne.decimals))} ${props.tokenOne.symbol}`}</td>
                                </tr>
                                <tr>
                                    <td className="swap-summary-table-cell-title">Swap fee</td>
                                    <td className="swap-summary-table-cell-contents">{`${props.tokenOneInputValue && FormatDecimals(BigNumberToFloat(props.tokenOneInputValue.mul(10000 * ((props.path.length - 1) * props.tradingFee)).div(10000), props.tokenOne.decimals))}  ${props.tokenOne.symbol}`}</td>
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
                                        {props.chainId === "97" && <a href={`https://testnet.bscscan.com/address/${props.walletOwner}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.walletOwner)}</p></a>}
                                        {props.chainId !== "97" && <a href={`https://testnet.bscscan.com/address/${props.walletOwner}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.walletOwner)}</p></a>}
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
                                    <td className="swap-summary-table-cell-contents-final">{`${props.tokenTwoInputValue && FormatDecimals(BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals))} ${props.tokenTwo.symbol}`}</td>
                                </tr>}
                                {props.amountType === 1 && <tr>
                                    <td className="swap-summary-table-cell-title-final">Receiving</td>
                                    <td className="swap-summary-table-cell-contents-final">{`${props.tokenTwoInputValue && FormatDecimals(BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals))} ${props.tokenTwo.symbol}`}</td>
                                </tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="swap-summary-info-mobile">
                        <div className="swap-summary-info-bar-mobile"></div>
                        <table className="swap-summary-table-mobile">
                            <tbody>
                                {props.amountType === 0 && <tr><td className="swap-summary-table-cell-title">Sending</td></tr>}
                                {props.amountType === 1 && <tr><td className="swap-summary-table-cell-title">Estimated Sending</td></tr>}
                                <tr><td className="swap-summary-table-cell-contents">{`${props.tokenOneInputValue && FormatDecimals(BigNumberToFloat(props.tokenOneInputValue, props.tokenOne.decimals))} ${props.tokenOne.symbol}`}</td></tr>
                                <tr><td className="swap-summary-table-cell-title">Swap fee</td></tr>
                                <tr><td className="swap-summary-table-cell-contents">{`${props.tokenOneInputValue && FormatDecimals(BigNumberToFloat(props.tokenOneInputValue.mul(10000 * ((props.path.length - 1) * props.tradingFee)).div(10000), props.tokenOne.decimals))}  ${props.tokenOne.symbol}`}</td></tr>
                                <tr><td className="swap-summary-table-cell-title">Price impact</td></tr>
                                <tr><td className="swap-summary-table-cell-contents">
                                    <PriceImpact dexPrice={props.dexPrice}
                                        tokenOneInputValue={props.tokenOneInputValue}
                                        tokenTwoInputValue={props.tokenTwoInputValue}
                                        amountType={props.amountType}
                                        tradingFee={props.tradingFee}
                                        tokenOne={props.tokenOne}
                                        tokenTwo={props.tokenTwo}
                                        factory={props.factory}
                                        path={props.path} /></td></tr>
                                <tr><td className="swap-summary-table-cell-title">Liquid Path</td></tr>
                                <tr><td className="swap-summary-table-cell-contents">
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
                                </td></tr>
                                <tr><td className="swap-summary-table-cell-title">Wallet recipient</td></tr>
                                <tr><td className="swap-summary-table-cell-contents">
                                    {props.chainId === "97" && <a href={`https://testnet.bscscan.com/address/${props.walletOwner}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.walletOwner)}</p></a>}
                                    {props.chainId !== "97" && <a href={`https://testnet.bscscan.com/address/${props.walletOwner}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.walletOwner)}</p></a>}
                                </td></tr>
                                {props.amountType === 0 &&
                                    <>
                                        <tr><td className="swap-summary-table-cell-title">Minimum receiving</td></tr>
                                        <tr><td className="swap-summary-table-cell-contents">{`${FormatDecimals(BigNumberToFloat(props.amountOutMin, props.tokenTwo.decimals))} ${props.tokenTwo.symbol}`} </td></tr>
                                    </>}
                                {props.amountType === 1 &&
                                    <>
                                        <tr><td className="swap-summary-table-cell-title">Maximum sending</td></tr>
                                        <tr><td className="swap-summary-table-cell-contents">{`${FormatDecimals(BigNumberToFloat(props.amountInMax, props.tokenOne.decimals))} ${props.tokenOne.symbol}`}</td></tr>
                                    </>}
                                {props.amountType === 0 &&
                                    <>
                                        <tr><td className="swap-summary-table-cell-title-final">Estimated receiving</td></tr>
                                        <tr><td className="swap-summary-table-cell-contents-final">{`${props.tokenTwoInputValue && FormatDecimals(BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals))} ${props.tokenTwo.symbol}`}</td></tr>
                                    </>}
                                {props.amountType === 1 &&
                                    <>
                                        <tr><td className="swap-summary-table-cell-title-final">Receiving</td></tr>
                                        <tr><td className="swap-summary-table-cell-contents-final">{`${props.tokenTwoInputValue && FormatDecimals(BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals))} ${props.tokenTwo.symbol}`}</td></tr>
                                    </>}
                            </tbody>
                        </table>
                    </div>
                    <div className="swap-summary-button-wrapper" >
                        {props.swapType !== "swapETHForExactTokens" &&
                            props.swapType !== "swapExactETHForTokens" &&
                            !spenderApproved &&
                            props.tokenOneInputValue && <Approve
                                token={props.path[0]}
                                user={props.walletOwner}
                                spender={swapRouterAddress as `0x${string}`}
                                amount={props.tokenOneInputValue}
                                setSpenderApproved={setSpenderApproved}
                                spenderApproved={spenderApproved}
                                refetch={refetch}
                            />}
                        {props.swapType !== "swapETHForExactTokens" &&
                            props.swapType !== "swapExactETHForTokens" &&
                            !configIsSuccess &&
                            spenderApproved &&
                            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" status="disabled" />}
                        {props.swapType !== "swapETHForExactTokens" &&
                            props.swapType !== "swapExactETHForTokens" &&
                            configIsSuccess &&
                            spenderApproved &&
                            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" onClick={() => write?.()} />}
                        {(props.swapType === "swapETHForExactTokens" ||
                            props.swapType === "swapExactETHForTokens") &&
                            configIsSuccess &&
                            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" onClick={() => write?.()} />}
                    </div>
                    <TextLink to="" text="Make changes" arrowDirection="back" onClick={() => { props.setShowSwapBox(true); props.setShowSwapSummary(false) }} />
                </div>
            </div>
        )
    }
    if (transactionLoading && !transactionSuccess) {
        return (<Loading loadingMsg="Sending transaction to the blockchain" />)
    }

    if (!transactionLoading && transactionSuccess) {
        return (<SwapSuccess tokenOne={props.tokenOne} tokenTwo={props.tokenTwo} txHash={txHash} walletOwner={props.walletOwner} />)
    }

    return (<Loading />)
}