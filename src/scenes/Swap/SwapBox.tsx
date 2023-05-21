import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import "./SwapBox.css"
import { useState, useEffect, ChangeEvent } from 'react'
import { AssetList } from './AssetList'
import { ERC20Token } from '../../components/utils/ERC20Utils'
import { Link } from 'react-router-dom'
import { SwapSettings } from './SwapSettings'
import PolybitInfo from "../../context/PolybitInfo.json"
import { useContractRead, useDisconnect } from 'wagmi'
import { BigNumber } from 'ethers'
import { GetDEXPrice } from './GetDEXPrice'
import { BigNumberToFloat, FloatToBigNumber, FormatDecimals, TruncateAddress } from '../../components/utils/Formatting'
import DEXInfo from "../../context/DEXInfo.json"
import { GetBalances } from './GetBalances'
import { FormatCurrency } from '../../components/utils/Currency'
import { Button } from '../../components/Buttons/Buttons'
import { TextLink } from '../../components/Buttons/TextLink'
import { DEX } from './Types/DEX'
import { IPolybitLiquidPath } from '../../context/abi/IPolybitLiquidPath'
import { BigNumberToCurrency } from '../../components/utils/Currency/BigNumberToCurrency'
import { GetAmountInCurrency } from './GetAmountInCurrency'

interface SwapBoxProps {
    isConnected: boolean;
    chainId: string;
    approvedList: Array<ERC20Token>;
    nativeSymbol: string;
    tokenOne: ERC20Token;
    setTokenOne: Function;
    tokenTwo: ERC20Token;
    setTokenTwo: Function;
    tokenOneInputValue: BigNumber | undefined;
    setTokenOneInputValue: Function;
    tokenTwoInputValue: BigNumber | undefined;
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
    currency: string;
    connector: any;
    setShowSwapBox: Function;
    setShowSwapSummary: Function;
    setSwapType: Function;
    setShowConnectWallet: Function;
}

export const SwapBox = (props: SwapBoxProps) => {
    const { disconnect } = useDisconnect()
    const [showAssetListTokenOne, setShowAssetListTokenOne] = useState(false)
    const [showAssetListTokenTwo, setShowAssetListTokenTwo] = useState(false)
    const [showSwapSettings, setShowSwapSettings] = useState(false)
    const liquidPathAddress: string = PolybitInfo[props.chainId as keyof typeof PolybitInfo]["addresses"]["liquid_path"]
    //const wethAddress: string = ChainInfo[props.chainId as keyof typeof ChainInfo]["weth_address"]
    const polybitSwapFee: number = PolybitInfo[props.chainId as keyof typeof PolybitInfo]["fees"]["swap_fee"]
    const [tokenOneBalance, setTokenOneBalance] = useState<BigNumber>(BigNumber.from(0))
    const [tokenTwoBalance, setTokenTwoBalance] = useState<BigNumber>(BigNumber.from(0))
    const dexPriceResponse = GetDEXPrice({ factory: props.factory.address, tokenOne: props.tokenOne, tokenTwo: props.tokenTwo })
    const [lastAmountInCurrency, setLastAmountInCurrency] = useState<number>(0)

    const balanceOne = GetBalances({
        walletOwner: props.walletOwner as `0x${string}`,
        tokenOne: props.tokenOne,
        tokenTwo: props.tokenTwo,
        nativeSymbol: props.nativeSymbol,
        walletBalance: props.walletBalance
    })[0]
    const balanceTwo = GetBalances({
        walletOwner: props.walletOwner as `0x${string}`,
        tokenOne: props.tokenOne,
        tokenTwo: props.tokenTwo,
        nativeSymbol: props.nativeSymbol,
        walletBalance: props.walletBalance
    })[1]

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
        dexPriceResponse && props.setDexPrice(dexPriceResponse)
        balanceOne && setTokenOneBalance(balanceOne)
        balanceTwo && setTokenTwoBalance(balanceTwo)
    }, [props.tokenOne, props.tokenTwo, props.tokenOneInputValue, props.tokenOneInputValue, props.amountsOut])

    const { data, isError, isLoading } = useContractRead({
        address: liquidPathAddress as `0x${string}`,
        abi: IPolybitLiquidPath,
        functionName: "getLiquidPath",
        args: [props.tokenOne.address as `0x${string}`, props.tokenTwo.address as `0x${string}`, props.amountType == 0 ? BigNumber.from(props.tokenOneInputValue ? props.tokenOneInputValue : BigNumber.from(0)) : BigNumber.from(props.tokenTwoInputValue ? props.tokenTwoInputValue : BigNumber.from(0)), props.amountType],
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
            props.setTradingFee((data[1].length - 1) * (props.factory.swapFee + polybitSwapFee))
            props.tokenOneInputValue && props.setTradingFeeAmount(props.tokenOneInputValue.mul(10000 * ((data[1].length - 1) * props.factory.swapFee)).div(10000))

            props.amountType === 0 && props.tokenOne.symbol === props.nativeSymbol && props.setSwapType("swapExactETHForTokens")
            props.amountType === 0 && props.tokenTwo.symbol === props.nativeSymbol && props.setSwapType("swapExactTokensForETH")

            props.amountType === 0 && props.tokenOne.symbol !== props.nativeSymbol && props.tokenTwo.symbol !== props.nativeSymbol && props.setSwapType("swapExactTokensForTokens")
            props.amountType === 1 && props.tokenOne.symbol !== props.nativeSymbol && props.tokenTwo.symbol !== props.nativeSymbol && props.setSwapType("swapTokensForExactTokens")

            props.amountType === 1 && props.tokenOne.symbol === props.nativeSymbol && props.setSwapType("swapETHForExactTokens")
            props.amountType === 1 && props.tokenTwo.symbol === props.nativeSymbol && props.setSwapType("swapTokensForExactETH")
        }
    })

    const [reloader, setReloader] = useState(0);
    const reset = () => {
        setReloader(Math.random());
    }

    const SwitchToken = () => {
        const tempTokenOne: ERC20Token = props.tokenOne
        const tempTokenTwo: ERC20Token = props.tokenTwo
        props.setTokenOne(tempTokenTwo)
        props.setTokenOneInputValue(props.tokenTwoInputValue)
        props.setTokenTwo(tempTokenOne)
        props.setTokenTwoInputValue(BigNumber.from(0))
        reset()
    }

    return (
        <div className="swap-box">
            <div className="swap-box-wrapper">
                <div className="swap-box-wrapper-header" >
                    {props.isConnected && <p style={{ color: "#909090" }}>Wallet:
                        {props.connector?.name === "MetaMask" && <img width="20px" height="20px" src={require("../../assets/images/metamask_icon.png")} />}
                        {props.connector?.name === "Coinbase Wallet" && <img width="20px" height="20px" src={require("../../assets/images/coinbasewallet_icon.png")} />}
                        {props.connector?.name === "WalletConnect" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
                        {props.connector?.name === "WalletConnectLegacy" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
                        {` ${TruncateAddress(props.walletOwner ? props.walletOwner : "")}`}</p>}
                    {!props.isConnected && <p style={{ color: "#909090" }}>Wallet: Not Connected</p>}
                    {props.isConnected && <TextLink to="" text="Disconnect Wallet" arrowDirection="forward-logout" onClick={() => disconnect()} />}
                    {/* {!props.isConnected && <TextLink to="" text="Connect Wallet" onClick={() => props.setShowConnectWallet(true)} />} */}
                </div>
                <div className="swap-box-container">
                    {showAssetListTokenOne && props.approvedList && <AssetList setShowAssetList={setShowAssetListTokenOne} setTokenOne={props.setTokenOne} setTokenTwo={props.setTokenTwo} tokenOne={props.tokenOne} tokenTwo={props.tokenTwo} whichToken="tokenOne" approvedList={props.approvedList} setTokenOneInputValue={props.setTokenOneInputValue} setTokenTwoInputValue={props.setTokenTwoInputValue} />}
                    {showAssetListTokenTwo && props.approvedList && <AssetList setShowAssetList={setShowAssetListTokenTwo} setTokenOne={props.setTokenOne} setTokenTwo={props.setTokenTwo} tokenOne={props.tokenOne} tokenTwo={props.tokenTwo} whichToken="tokenTwo" approvedList={props.approvedList} setTokenOneInputValue={props.setTokenOneInputValue} setTokenTwoInputValue={props.setTokenTwoInputValue} />}
                    <div className="swap-box-token">
                        <div className="swap-box-token-header" >
                            <div className="swap-box-token-header-token">
                                <div className="swap-box-token-header-token-button">
                                    <img className="swap-box-token-header-token-logo" onClick={() => setShowAssetListTokenOne(true)} src={props.tokenOne.logoURI ? props.tokenOne.logoURI : require("../../assets/images/placeholder.png")}></img>
                                    <div className="swap-box-token-header-token-name-wrapper" onClick={() => setShowAssetListTokenOne(true)}>
                                        <div className="swap-box-token-header-token-name">{props.tokenOne.symbol}</div>
                                        <div style={{ transform: "translateY(-18%)", fontSize: "24px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>
                                    </div>
                                </div>
                                {props.tokenOne.symbol !== "BNB" && <Link className="swap-box-token-header-token-link" target="_blank" to={`/assets/${props.tokenOne.name.replaceAll(" ", "-").replaceAll(".", "-").replaceAll("(", "-").replaceAll(")", "-").toLocaleLowerCase()}`}>
                                    <div style={{ transform: "translateY(0%)", fontSize: "12px" }}><FontAwesomeIcon icon={icon({ name: "up-right-from-square", style: "solid" })} /></div>
                                </Link>}
                                {props.isConnected && <div className="swap-box-token-header-balance">
                                    {`Balance: ${props.walletOwner && FormatDecimals(BigNumberToFloat(tokenOneBalance, props.tokenOne.decimals))}`}
                                </div>}
                                {!props.isConnected && <div className="swap-box-token-header-balance"></div>}
                            </div>
                            <img className="swap-box-settings-icon" src={require("../../assets/icons/settings.png")} alt="settings" onClick={() => setShowSwapSettings(!showSwapSettings)} />
                        </div>
                        {showSwapSettings && <SwapSettings setSlippage={props.setSlippage} slippage={props.slippage} setDeadline={props.setDeadline} deadline={props.deadline} setShowSwapSettings={setShowSwapSettings} />}
                        <div className="swap-box-token-input">
                            <input type="number" min="0" step="any"
                                placeholder="Enter an amount"
                                value={props.tokenOneInputValue ?
                                    FormatDecimals(BigNumberToFloat(props.tokenOneInputValue, props.tokenOne.decimals)) : ""}
                                onChange={onChangeTokenOneInput} />
                            <div className="swap-box-pair-price">
                                <GetAmountInCurrency
                                    key={reloader + Math.random()}
                                    tokenAddress={props.tokenOne.address}
                                    tokenAmount={props.tokenOneInputValue ? Number(props.tokenOneInputValue) : 0}
                                    tokenDecimals={props.tokenOne.decimals}
                                    currency={props.currency}
                                    lastAmountInCurrency={lastAmountInCurrency}
                                    setLastAmountInCurrency={setLastAmountInCurrency} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="swap-box-token-switch" >
                    <img src={require("../../assets/icons/swap-switch.png")} alt="swap switch" onClick={() => SwitchToken()} />
                </div>
                <div className="swap-box-container">
                    <div className="swap-box-token">
                        <div className="swap-box-token-header" >
                            <div className="swap-box-token-header-token-button">
                                <div className="swap-box-token-header-token">
                                    <img className="swap-box-token-header-token-logo" onClick={() => setShowAssetListTokenTwo(true)} src={props.tokenTwo.logoURI ? props.tokenTwo.logoURI : require("../../assets/images/placeholder.png")}></img>
                                    <div className="swap-box-token-header-token-name-wrapper" onClick={() => setShowAssetListTokenTwo(true)}>
                                        <div className="swap-box-token-header-token-name">{props.tokenTwo.symbol}</div>
                                        <div className="swap-box-token-header-token-arrow" style={{ transform: "translateY(-18%)", fontSize: "24px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>
                                    </div>
                                    {props.tokenTwo.symbol !== "BNB" && <Link className="swap-box-token-header-token-link" target="_blank" to={`/assets/${props.tokenTwo.name.replaceAll(" ", "-").replaceAll(".", "-").replaceAll("(", "-").replaceAll(")", "-").toLocaleLowerCase()}`}>
                                        <div style={{ transform: "translateY(0%)", fontSize: "12px" }}><FontAwesomeIcon icon={icon({ name: "up-right-from-square", style: "solid" })} /></div>
                                    </Link>}
                                    {props.isConnected && <div className="swap-box-token-header-balance">
                                        {`Balance: ${props.walletOwner && FormatDecimals(BigNumberToFloat(tokenTwoBalance, props.tokenTwo.decimals))}`}
                                    </div>}
                                    {!props.isConnected && <div className="swap-box-token-header-balance"></div>}
                                </div>
                            </div>
                        </div>
                        <div className="swap-box-token-input">
                            <input type="number" min="0" step="0.1"
                                value={props.tokenTwoInputValue ?
                                    FormatDecimals(BigNumberToFloat(props.tokenTwoInputValue, props.tokenTwo.decimals)) : ""}
                                onChange={onChangeTokenTwoInput} />
                            <div className="swap-box-pair-price">
                                <p>{`1 ${props.tokenOne.symbol} = ${FormatDecimals(GetDEXPrice({ factory: props.factory.address, tokenOne: props.tokenOne, tokenTwo: props.tokenTwo }))} ${props.tokenTwo.symbol}`}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="swap-box-button-wrapper">
                    {!props.isConnected &&
                        <Button text={"Connect Wallet"} buttonSize="standard-long" buttonStyle="primary" onClick={() => props.setShowConnectWallet(true)} />
                    }
                    {props.isConnected &&
                        Number(props.tokenOneInputValue) === 0 &&
                        <Button text={"Enter an amount"} buttonSize="standard-long" buttonStyle="primary" status='disabled' />
                    }
                    {props.isConnected &&
                        Number(props.tokenOneInputValue) > Number(balanceOne) &&
                        <Button text={"Insufficient balance"} buttonSize="standard-long" buttonStyle="primary" status='disabled' />
                    }
                    {props.isConnected &&
                        Number(props.tokenOneInputValue) > 0 &&
                        Number(props.tokenOneInputValue) <= Number(balanceOne) &&
                        <Button text={"View Swap Summary"} buttonSize="standard-long" buttonStyle="primary" onClick={() => { props.setShowSwapBox(false); props.setShowSwapSummary(true) }} />
                    }

                </div>
            </div>
        </div >
    )
}