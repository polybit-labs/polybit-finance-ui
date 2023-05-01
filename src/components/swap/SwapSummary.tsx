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
import { SwapETHForExactTokens, SwapExactETHForTokens, SwapExactTokensForETH } from "./SwapButton"
import PolybitInfo from "../../chain_info/PolybitInfo.json"
import { TextLink } from "../Buttons"

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
    const ethers = require("ethers")
    const utils = ethers.utils
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain } = useNetwork()
    const { data: walletBalance } = useBalance({
        address: walletOwner,
    })

    if (props.amountOutMin && props.amountInMax) {
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
                    {props.swapType === "swapExactTokensForETH" && <SwapExactTokensForETH
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
                    <TextLink to="" text="Make changes" arrowDirection="back" onClick={() => { props.setShowSwapBox(true); props.setShowSwapSummary(false) }} />
                </div>
            </div>
        )
    }

    return (<></>)

    /* 
        const { config: detfDepositConfig, error: detfDepositError, isSuccess: prepareContractWriteSuccess, isLoading: prepareContractWriteLoading } = usePrepareContractWrite({
            address: props.detfAddress as `0x${string}`,
            abi: [],
            functionName: 'deposit',
            // @ts-ignore
            args: [BigNumber.from(props.timeLockAmount) === BigNumber.from(props.timeLock) ? BigNumber.from(0) : BigNumber.from(props.timeLockAmount), orderData],
            overrides: { from: walletOwner, value: BigNumber.from(props.depositAmount) },
            onError(error) {
                console.log('detfDepositConfig Error', error)
            },
            onSuccess(data) {
                console.log('detfDepositConfig Success', data)
            },
        })
    
        const { data, isLoading: contractWriteLoading, isSuccess, write: detfDeposit } = useContractWrite(detfDepositConfig)
    
        const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
            hash: data?.hash,
            onSettled(data, error) {
                const response = data ? data.logs[2].data : []
                const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
                if (confirmedAmount === props.depositAmount) {
                    props.setDepositSuccess(true)
                }
            },
            onError(error) {
                console.log('useWaitForTransaction Error', error)
            },
        })
    
        const depositAmountFormatted = parseFloat((Number(props.depositAmount) / 10 ** 18).toString()).toFixed(4)
        const depositAmountCurrency = FormatCurrency(props.depositAmount ?
            (Number(props.depositAmount)
                / 10 ** 18 *
                (() => {
                    switch (props.currency) {
                        case "AUD": return (props.vsPrices.aud)
                        case "BNB": return (props.vsPrices.bnb)
                        case "CNY": return (props.vsPrices.cny)
                        case "EURO": return (props.vsPrices.eur)
                        case "IDR": return (props.vsPrices.idr)
                        case "JPY": return (props.vsPrices.jpy)
                        case "KRW": return (props.vsPrices.krw)
                        case "RUB": return (props.vsPrices.rub)
                        case "TWD": return (props.vsPrices.twd)
                        case "USD": return (props.vsPrices.usd)
                    }
                })()) : 0, 2)
    
        if (!prepareContractWriteSuccess) {
            return (
                <Loading loadingMsg="Preparing your investment" />
            )
        }
    
        if (!transactionLoading && prepareContractWriteSuccess) {
            return (
                <div className="deposit-summary">
                    <div className="deposit-summary-container">
                        <h2>Your DETF investment summary</h2>
                        <div className="deposit-summary-info">
                            <div className="deposit-summary-info-bar"></div>
                            <table className="deposit-summary-table">
                                <tbody>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">DETF</td>
                                        <td className="deposit-summary-table-cell-contents">{props.category} {props.dimension}</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Blockchain</td>
                                        <td className="deposit-summary-table-cell-contents">{chain?.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Entry Fee</td>
                                        <td className="deposit-summary-table-cell-contents">0.5%</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Exit Fee</td>
                                        <td className="deposit-summary-table-cell-contents">0.5%</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Time Locked</td>
                                        <td className="deposit-summary-table-cell-contents">{prettyTimeLockValue}</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Your wallet</td>
                                        <td className="deposit-summary-table-cell-contents">{TruncateAddress(walletOwner ? walletOwner : "")}</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title-final">Investment</td>
                                        <td className="deposit-summary-table-cell-contents-final">{`${walletBalance?.symbol} ${depositAmountFormatted} (${depositAmountCurrency})`}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="deposit-summary-info-mobile">
                            <div className="deposit-summary-info-bar-mobile"></div>
                            <table className="deposit-summary-table-mobile">
                                <tbody>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">DETF</td>
                                    </tr>
                                    <tr><td className="deposit-summary-table-cell-contents">{props.category} {props.dimension}</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Blockchain</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-contents">{chain?.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Entry Fee</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-contents">0.5%</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Exit Fee</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-contents">0.5%</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Time Locked</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-contents">{prettyTimeLockValue}</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title">Your wallet</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-contents">{TruncateAddress(walletOwner ? walletOwner : "")}</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-title-final">Investment</td>
                                    </tr>
                                    <tr>
                                        <td className="deposit-summary-table-cell-contents-final">{`${walletBalance?.symbol} ${depositAmountFormatted} (${depositAmountCurrency})`}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="deposit-summary-button-wrapper">
                            {!contractWriteLoading && !transactionLoading && orderDataSuccess && <Button buttonStyle="primary" buttonSize="standard" text="Finalise and commit funds" onClick={() => detfDeposit?.()} />}
                            {contractWriteLoading && !transactionLoading && <Button buttonStyle="primary" buttonSize="standard" text="Finalise and commit funds" status="loading" loadingMsg={`waiting for ${connector?.name}`} />}
                        </div>
                        <TextLink to="" text="Make changes" arrowDirection="back" onClick={() => { props.setShowDepositDetails(true); props.setActiveStage(props.activeStage === "establish-deposit-summary" ? "establish-deposit-details" : "deposit-details") }} />
                    </div>
                </div>
            )
        }
    
        if (transactionLoading) {
            return (
                <Loading loadingMsg="Sending transaction to the blockchain" />
            )
        } */
}