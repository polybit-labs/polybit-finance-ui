import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import "./SwapBox.css"
import { useState, useEffect, ChangeEvent } from 'react'
import { AssetList } from './AssetList'
import { ERC20Token } from '../utils/ERC20Utils'
import { Link } from 'react-router-dom'
import { SwapSettings } from './SwapSettings'
import PolybitInfo from "../../chain_info/PolybitInfo.json"
import { useContractRead, useDisconnect } from 'wagmi'
import { BigNumber } from 'ethers'
import { GetDEXPrice } from './GetDEXPrice'
import { BigNumberToFloat, FloatToBigNumber, FormatDecimals, TruncateAddress } from '../utils/Formatting'
import DEXInfo from "../../chain_info/DEXInfo.json"
import ChainInfo from "../../chain_info/ChainInfo.json"
import { GetBalances } from './GetBalances'
import { FormatCurrency } from '../utils/Currency'
import { Button, TextLink } from '../Buttons'
import { DEX } from './Types/DEX'
import { IPolybitLiquidPath } from '../../chain_info/abi/IPolybitLiquidPath'

interface SwapBoxProps {
    chainId: string;
    approvedList: Array<ERC20Token>;
    tokenOne: ERC20Token;
    setTokenOne: Function;
    tokenTwo: ERC20Token;
    setTokenTwo: Function;
    tokenOneInputValue: BigNumber;
    setTokenOneInputValue: Function;
    tokenTwoInputValue: BigNumber;
    setTokenTwoInputValue: Function;
    factory: DEX;
    setFactory: Function;
    path: readonly `0x${string}`[];
    setPath: Function;
    amountsOut: BigNumber;
    setAmountsOut: Function;
    amountOutMin: BigNumber;
    setAmountOutMin: Function;
    amountInMax: BigNumber;
    setAmountInMax: Function;
    amountType: number;
    setAmountType: Function;
    dexPrice: number;
    setDexPrice: Function;
    slippage: number;
    setSlippage: Function;
    deadline: number;
    setDeadline: Function;
    setTradingFee: Function;
    setTradingFeeAmount: Function;
    walletOwner: `0x${string}` | undefined;
    walletBalance: BigNumber;
    connector: any;
    currency: string;
    vsPrices: any;
    setShowSwapBox: Function;
    setShowSwapSummary: Function;
    setSwapType: Function;
}

export const SwapBox = (props: SwapBoxProps) => {
    const { disconnect } = useDisconnect()
    const [showAssetListTokenOne, setShowAssetListTokenOne] = useState(false)
    const [showAssetListTokenTwo, setShowAssetListTokenTwo] = useState(false)
    const [showSwapSettings, setShowSwapSettings] = useState(false)

    const [priceColor, setPriceColor] = useState("")
    const liquidPathAddress: string = PolybitInfo[props.chainId as keyof typeof PolybitInfo]["addresses"]["liquid_path"]
    const nativeSymbol: string = ChainInfo[props.chainId as keyof typeof ChainInfo]["native_symbol"]
    const wethAddress: string = ChainInfo[props.chainId as keyof typeof ChainInfo]["weth_address"]
    const polybitSwapFee: number = PolybitInfo[props.chainId as keyof typeof PolybitInfo]["fees"]["swap_fee"]

    console.log("swap fee", polybitSwapFee)
    const onChangeTokenOneInput = (e: ChangeEvent<HTMLInputElement>) => {
        props.setTokenOneInputValue(FloatToBigNumber(Number(e.target.value), props.tokenOne.decimals))
        props.setAmountType(0)
    }

    const onChangeTokenTwoInput = (e: ChangeEvent<HTMLInputElement>) => {
        props.setTokenTwoInputValue(FloatToBigNumber(Number(e.target.value), props.tokenTwo.decimals))
        props.setAmountType(1)
    }

    useEffect(() => {
        props.amountType === 0 && props.setTokenTwoInputValue(props.amountsOut)
        props.amountType === 1 && props.setTokenOneInputValue(props.amountsOut)

    }, [props.amountsOut])

    const { data, isError, isLoading } = useContractRead({
        address: liquidPathAddress as `0x${string}`,
        abi: IPolybitLiquidPath,
        functionName: "getLiquidPath",
        args: [props.tokenOne.address as `0x${string}`, props.tokenTwo.address as `0x${string}`, props.amountType == 0 ? BigNumber.from(props.tokenOneInputValue) : BigNumber.from(props.tokenTwoInputValue), props.amountType],
        watch: true,
        onSettled(data, error) {
            //console.log('Settled', { data, error })
        },
        onSuccess(data) {
            //console.log('Success', data)
            DEXInfo[props.chainId as keyof typeof DEXInfo].map(dex =>
                dex.address === data[0] && props.setFactory({ address: dex.address, name: dex.name, logoURI: dex.logoURI, swapFee: Number(dex.swapFee) }))
            props.setPath(data[1])
            props.setAmountsOut(BigNumber.from(data[2]))
            props.setAmountOutMin(data[2].sub(data[2].mul(10000 * props.slippage).div(10000)))
            props.setAmountInMax(data[2].add(data[2].mul(10000 * props.slippage).div(10000)))
            props.setDexPrice(dexPriceResponse)

            props.setTradingFee((data[1].length - 1) * (props.factory.swapFee + polybitSwapFee))
            //props.setTradingFeeAmount(BigNumber.from(((data[1].length - 1) * (Number(props.tokenOneInputValue) * props.factory.swapFee)).toString()))
            console.log(data[1].length)
            console.log((data[1].length - 1) * props.factory.swapFee)
            console.log(props.factory.swapFee)
            props.setTradingFeeAmount(props.tokenOneInputValue.mul(10000 * ((data[1].length - 1) * props.factory.swapFee)).div(10000))

            props.amountType === 0 && props.tokenOne.symbol === nativeSymbol && props.setSwapType("swapExactETHForTokens")
            props.amountType === 0 && props.tokenTwo.symbol === nativeSymbol && props.setSwapType("swapExactTokensForETH")

            props.amountType === 0 && props.tokenOne.symbol !== nativeSymbol && props.tokenTwo.symbol !== nativeSymbol && props.setSwapType("swapExactTokensForTokens")
            props.amountType === 1 && props.tokenOne.symbol !== nativeSymbol && props.tokenTwo.symbol !== nativeSymbol && props.setSwapType("swapTokensForExactTokens")

            props.amountType === 1 && props.tokenOne.symbol === nativeSymbol && props.setSwapType("swapETHForExactTokens")
            props.amountType === 1 && props.tokenTwo.symbol === nativeSymbol && props.setSwapType("swapTokensForExactETH")
        }
    })
    console.log(props.amountOutMin.toString())
    console.log(props.amountInMax.toString())

    const dexPriceResponse = GetDEXPrice({ factory: props.factory.address, tokenOne: props.tokenOne, tokenTwo: props.tokenTwo })

    const SwitchToken = () => {
        const tempTokenOne: ERC20Token = props.tokenOne
        const tempTokenTwo: ERC20Token = props.tokenTwo
        props.setTokenOne(tempTokenTwo)
        props.setTokenOneInputValue(BigNumber.from(0))
        props.setTokenTwo(tempTokenOne)
        props.setTokenTwoInputValue(BigNumber.from(0))
    }

    return (
        <div className="swap-box">
            <div className="swap-box-wrapper">
                <div className="swap-box-wrapper-header" >
                    <p style={{ color: "#909090" }}>Wallet:
                        {props.connector?.name === "MetaMask" && <img width="20px" height="20px" src={require("../../assets/images/metamask_icon.png")} />}
                        {props.connector?.name === "Coinbase Wallet" && <img width="20px" height="20px" src={require("../../assets/images/coinbasewallet_icon.png")} />}
                        {props.connector?.name === "WalletConnect" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
                        {props.connector?.name === "WalletConnectLegacy" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
                        {` ${TruncateAddress(props.walletOwner ? props.walletOwner : "")}`}</p>
                    <TextLink to="" text="Disconnect Wallet" arrowDirection="forward-logout" onClick={() => disconnect()} /></div>
                <div className="swap-box-container">
                    {showAssetListTokenOne && props.approvedList && <AssetList setShowAssetList={setShowAssetListTokenOne} setTokenOne={props.setTokenOne} setTokenTwo={props.setTokenTwo} tokenOne={props.tokenOne} tokenTwo={props.tokenTwo} whichToken="tokenOne" approvedList={props.approvedList} setTokenOneInputValue={props.setTokenOneInputValue} setTokenTwoInputValue={props.setTokenTwoInputValue} />}
                    {showAssetListTokenTwo && props.approvedList && <AssetList setShowAssetList={setShowAssetListTokenTwo} setTokenOne={props.setTokenOne} setTokenTwo={props.setTokenTwo} tokenOne={props.tokenOne} tokenTwo={props.tokenTwo} whichToken="tokenTwo" approvedList={props.approvedList} setTokenOneInputValue={props.setTokenOneInputValue} setTokenTwoInputValue={props.setTokenTwoInputValue} />}
                    {showSwapSettings && <SwapSettings setSlippage={props.setSlippage} slippage={props.slippage} setShowSwapSettings={setShowSwapSettings} />}
                    <div className="swap-box-token">
                        <div className="swap-box-token-header" >
                            <div className="swap-box-token-header-token">
                                <div className="swap-box-token-header-token-button" onClick={() => setShowAssetListTokenOne(true)}>
                                    <img className="swap-box-token-header-token-logo" src={props.tokenOne.logoURI ? props.tokenOne.logoURI : require("../../assets/images/placeholder.png")}></img>
                                    <div className="swap-box-token-header-token-name">{props.tokenOne.symbol}</div>
                                    <div style={{ transform: "translateY(-18%)", fontSize: "24px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>
                                </div>
                                {props.tokenOne.symbol !== "BNB" && <Link className="swap-box-token-header-token-link" to={`/tokens/${props.tokenOne.name.replaceAll(" ", "-").replaceAll(".", "-").replaceAll("(", "-").replaceAll(")", "-").toLocaleLowerCase()}`}>
                                    <div style={{ transform: "translateY(0%)", fontSize: "12px" }}><FontAwesomeIcon icon={icon({ name: "up-right-from-square", style: "solid" })} /></div>
                                </Link>}
                            </div>
                            <div className="swap-box-token-header-balance">
                                {`Balance: ${props.walletOwner && FormatDecimals(BigNumberToFloat(GetBalances({
                                    walletOwner: props.walletOwner,
                                    tokenOne: props.tokenOne,
                                    tokenTwo: props.tokenTwo,
                                    nativeSymbol: nativeSymbol,
                                    walletBalance: props.walletBalance
                                })[0], props.tokenOne.decimals))}`}
                            </div>
                            <div onClick={() => setShowSwapSettings(true)} style={{ transform: "translateY(0%)", fontSize: "16px", color: "#909090", cursor: "pointer" }}><FontAwesomeIcon icon={icon({ name: "gear", style: "solid" })} /></div>
                        </div>
                        <div className="swap-box-token-input">
                            <input style={{ color: priceColor }} type="number" min="0" placeholder="Enter an amount" value={Number(props.tokenOneInputValue) > 0 ? FormatDecimals(BigNumberToFloat(props.tokenOneInputValue, props.tokenOne.decimals)) : ""} onChange={onChangeTokenOneInput} />
                            <div className="swap-box-pair-price">
                                <p>{`(${props.currency} ${FormatCurrency(props.walletBalance ?
                                    (Number(props.walletBalance)
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
                                        })()) : 0, 2)})`}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="swap-box-token-switch" onClick={() => SwitchToken()}>
                    <img src={require("../../assets/icons/swap-switch.png")} alt="swap switch" />
                </div>
                <div className="swap-box-container">
                    <div className="swap-box-token">
                        <div className="swap-box-token-header" >
                            <div className="swap-box-token-header-token-button" onClick={() => setShowAssetListTokenTwo(true)}>
                                <div className="swap-box-token-header-token">
                                    <img className="swap-box-token-header-token-logo" src={props.tokenTwo.logoURI ? props.tokenTwo.logoURI : require("../../assets/images/placeholder.png")}></img>
                                    <div className="swap-box-token-header-token-name">{props.tokenTwo.symbol}</div>
                                    <div style={{ transform: "translateY(-18%)", fontSize: "24px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>
                                    {props.tokenTwo.symbol !== "BNB" && <Link className="swap-box-token-header-token-link" to={`/tokens/${props.tokenTwo.name.replaceAll(" ", "-").replaceAll(".", "-").replaceAll("(", "-").replaceAll(")", "-").toLocaleLowerCase()}`}>
                                        <div style={{ transform: "translateY(0%)", fontSize: "12px" }}><FontAwesomeIcon icon={icon({ name: "up-right-from-square", style: "solid" })} /></div>
                                    </Link>}
                                </div>
                            </div>
                            <div className="swap-box-token-header-balance">
                                {`Balance: ${props.walletOwner && FormatDecimals(BigNumberToFloat(GetBalances({
                                    walletOwner: props.walletOwner,
                                    tokenOne: props.tokenOne,
                                    tokenTwo: props.tokenTwo,
                                    nativeSymbol: nativeSymbol,
                                    walletBalance: props.walletBalance
                                })[1], props.tokenTwo.decimals))}`}
                            </div>
                        </div>
                        <div className="swap-box-token-input">
                            <input style={{ color: priceColor }} type="number" min="0" value={Number(props.tokenTwoInputValue) > 0 ? FormatDecimals(BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals)) : ""} onChange={onChangeTokenTwoInput} />
                            <div className="swap-box-pair-price">
                                <p>{`1 ${props.tokenOne.symbol} = ${FormatDecimals(GetDEXPrice({ factory: props.factory.address, tokenOne: props.tokenOne, tokenTwo: props.tokenTwo }))} ${props.tokenTwo.symbol}`}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="swap-box-button-wrapper">
                    <Button text={Number(props.tokenOneInputValue) === 0 ? "Enter an amount" : "View Swap Summary"} buttonSize="standard-long" buttonStyle="primary" onClick={() => { props.setShowSwapBox(false); props.setShowSwapSummary(true) }} />
                </div>
            </div>
        </div >
    )
}