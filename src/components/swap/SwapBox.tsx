import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Button } from "../Buttons"
import "./SwapBox.css"
import { useState, useEffect, ChangeEvent } from 'react'
import { AssetList } from './AssetList'
import { ERC20Token, GetTokenBalance } from '../utils/ERC20Utils'
import { Link } from 'react-router-dom'
import { SwapSettings } from './SwapSettings'
import polybitAddresses from "../../chain_info/polybitAddresses.json"
import { useContractRead, useNetwork } from 'wagmi'
import { BigNumber } from 'ethers'
import { DEXPrice } from './DEXPrice'
import { BigNumberToFloat, FloatToBigNumber, FormatDecimals } from '../utils/Formatting'
import DEXInfo from "../../chain_info/DEXInfo.json"
import ChainInfo from "../../chain_info/ChainInfo.json"
import { SwapButton } from './SwapButton'
import { GetBalances } from './GetBalances'

interface DEX {
    address: string;
    name: string;
    logoURI: string;
    swapFee: number;
}

interface SwapBoxProps {
    walletOwner: `0x${string}` | undefined;
    walletBalance: BigNumber;
}

export const SwapBox = (props: SwapBoxProps) => {
    const [approvedList, setApprovedList] = useState<Array<ERC20Token>>()
    const [showAssetListTokenOne, setShowAssetListTokenOne] = useState(false)
    const [showAssetListTokenTwo, setShowAssetListTokenTwo] = useState(false)
    const [showSwapSettings, setShowSwapSettings] = useState(false)
    const [amountType, setAmountType] = useState<number>(0)
    const [swapType, setSwapType] = useState<"swapETHForExactTokens" | "swapExactETHForTokens" | "swapExactTokensForETH" | "swapExactTokensForTokens" | "swapTokensForExactETH" | "swapTokensForExactTokens" | undefined>()
    const [priceImpact, setPriceImpact] = useState<number>(0)
    const [slippage, setSlippage] = useState<number>(0.005)
    const [tradingFee, setTradingFee] = useState<BigNumber>(BigNumber.from("0"))
    const [priceColor, setPriceColor] = useState("")

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/polybit-labs/token-list/main/polybit-labs.tokenlist.json")
            .then((response) => response.json())
            .then((responseJson) => {
                setApprovedList(responseJson.tokens)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const { chain, chains } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    const liquidPathAddress: string = polybitAddresses[chainId as keyof typeof polybitAddresses]["liquid_path"]
    const swapRouterAddress: string = polybitAddresses[chainId as keyof typeof polybitAddresses]["swap_router"]
    const nativeSymbol: string = ChainInfo[chainId as keyof typeof ChainInfo]["native_symbol"]
    const wethAddress: string = ChainInfo[chainId as keyof typeof ChainInfo]["weth_address"]

    const BNB: ERC20Token = {
        symbol: "BNB",
        name: "Binance",
        logoURI: "https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        chainId: 56,
        decimals: 18
    }
    const CAKE: ERC20Token = {
        symbol: "CAKE",
        name: "PancakeSwap",
        logoURI: "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png",
        address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        chainId: 56,
        decimals: 18
    }

    const [tokenOne, setTokenOne] = useState<ERC20Token>(BNB)
    const [tokenTwo, setTokenTwo] = useState<ERC20Token>(CAKE)

    const [factory, setFactory] = useState<DEX>({ address: "", name: "", logoURI: "", swapFee: 0 })
    const [path, setPath] = useState<readonly `0x${string}`[]>()
    const [amountsOut, setAmountsOut] = useState<BigNumber>(BigNumber.from(0))
    const [previousAmountsOut, setPreviousAmountsOut] = useState<BigNumber>(BigNumber.from(0))

    const [tokenOneInputValue, setTokenOneInputValue] = useState<BigNumber>(BigNumber.from(0))
    const [tokenTwoInputValue, setTokenTwoInputValue] = useState<BigNumber>(BigNumber.from(0))

    const onChangeTokenOneInput = (e: ChangeEvent<HTMLInputElement>) => {
        setTokenOneInputValue(FloatToBigNumber(Number(e.target.value), tokenOne.decimals))
        setAmountType(0)
    }

    const onChangeTokenTwoInput = (e: ChangeEvent<HTMLInputElement>) => {
        setTokenTwoInputValue(FloatToBigNumber(Number(e.target.value), tokenTwo.decimals))
        setAmountType(1)
    }

    useEffect(() => {
        amountType === 0 && setTokenTwoInputValue(amountsOut)
        amountType === 1 && setTokenOneInputValue(amountsOut)

        amountType === 0 && setPriceImpact(1 - (dexPriceOut / ((Number(amountsOut) / Number(tokenOneInputValue)) * 10 ** 18)))
        amountType === 1 && setPriceImpact(1 - (dexPriceIn / ((Number(amountsOut) / Number(tokenTwoInputValue)) * 10 ** 18)))

    }, [amountsOut])

    const { data, isError, isLoading } = useContractRead({
        address: liquidPathAddress as `0x${string}`,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint8",
                    "name": "amountType",
                    "type": "uint8"
                }
            ],
            "name": "getLiquidPath",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },] as const,
        functionName: "getLiquidPath",
        args: [tokenOne.address as `0x${string}`, tokenTwo.address as `0x${string}`, amountType == 0 ? BigNumber.from(tokenOneInputValue) : BigNumber.from(tokenTwoInputValue), amountType],
        watch: true,
        onSettled(data, error) {
            console.log('Settled', { data, error })
        },
        onSuccess(data) {
            console.log('Success', data)
            DEXInfo[chainId as keyof typeof DEXInfo].map(dex =>
                dex.address === data[0] && setFactory({ address: dex.address, name: dex.name, logoURI: dex.logoURI, swapFee: Number(dex.swapFee) }))
            setPath(data[1])
            setPreviousAmountsOut(amountsOut)
            setAmountsOut(BigNumber.from(data[2]))
            setTradingFee(BigNumber.from(((data[1].length - 1) * (Number(tokenOneInputValue) * factory.swapFee)).toString()))
            console.log("tradingFee", Number(tradingFee))
            if (amountsOut > previousAmountsOut) {
                setPriceColor("#00BF6F");
                setTimeout(() => {
                    setPriceColor("");
                }, 1000)
            } else if (amountsOut < previousAmountsOut) {
                setPriceColor("#F74040");
                setTimeout(() => {
                    setPriceColor("");
                }, 1000)
            }

            amountType === 0 && tokenOne.symbol === nativeSymbol && setSwapType("swapExactETHForTokens")
            amountType === 0 && tokenTwo.symbol === nativeSymbol && setSwapType("swapExactTokensForETH")

            amountType === 0 && tokenOne.symbol !== nativeSymbol && tokenTwo.symbol !== nativeSymbol && setSwapType("swapExactTokensForTokens")
            amountType === 1 && tokenOne.symbol !== nativeSymbol && tokenTwo.symbol !== nativeSymbol && setSwapType("swapTokensForExactTokens")

            amountType === 1 && tokenOne.symbol === nativeSymbol && setSwapType("swapETHForExactTokens")
            amountType === 1 && tokenTwo.symbol === nativeSymbol && setSwapType("swapTokensForExactETH")
        }
    })

    const dexPriceOut = DEXPrice({ factory: factory.address, numerator: tokenOne.address, denominator: tokenTwo.address, numeratorDecimals: tokenOne.decimals, denominatorDecimals: tokenTwo.decimals }) * 10 ** 18
    const dexPriceIn = DEXPrice({ factory: factory.address, numerator: tokenTwo.address, denominator: tokenOne.address, numeratorDecimals: tokenTwo.decimals, denominatorDecimals: tokenOne.decimals }) * 10 ** 18
    //console.log("dex price out", dexPriceOut)
    //console.log("dex price in", dexPriceIn) // get the reverse price?
    //console.log("amounts out", Number(amountsOut))
    //console.log("amounts out adjusted", ((Number(amountsOut) / Number(tokenOneInputValue)) * 10 ** 18).toString())
    //console.log("price impact token one", 1 - (dexPriceOut / ((Number(amountsOut) / Number(tokenOneInputValue)) * 10 ** tokenTwo.decimals)))
    //console.log("price impact token two", 1 - (dexPriceIn / ((Number(amountsOut) / Number(tokenTwoInputValue)) * 10 ** tokenOne.decimals)))
    //console.log(amountType)

    const SwitchToken = () => {
        const tempTokenOne: ERC20Token = tokenOne
        const tempTokenTwo: ERC20Token = tokenTwo
        setTokenOne(tempTokenTwo)
        setTokenOneInputValue(BigNumber.from(0))
        setTokenTwo(tempTokenOne)
        setTokenTwoInputValue(BigNumber.from(0))
    }

    const GetAssetLogo = (address: string) => {
        let name: string = ""
        let logoURI: string = ""
        approvedList?.map((asset: ERC20Token) => {
            if (asset.address === address) {
                name = asset.name
                logoURI = asset.logoURI
            }
        })
        return [name, logoURI]
    }

    return (
        <div className="swap-box">
            <div className="swap-box-container">
                <div className="swap-box-wrapper">
                    {showAssetListTokenOne && approvedList && <AssetList setShowAssetList={setShowAssetListTokenOne} setTokenOne={setTokenOne} setTokenTwo={setTokenTwo} tokenOne={tokenOne} tokenTwo={tokenTwo} whichToken="tokenOne" approvedList={approvedList} />}
                    {showAssetListTokenTwo && approvedList && <AssetList setShowAssetList={setShowAssetListTokenTwo} setTokenOne={setTokenOne} setTokenTwo={setTokenTwo} tokenOne={tokenOne} tokenTwo={tokenTwo} whichToken="tokenTwo" approvedList={approvedList} />}
                    {showSwapSettings && <SwapSettings setSlippage={setSlippage} slippage={slippage} setShowSwapSettings={setShowSwapSettings} />}
                    <div className="swap-box-header">
                        <p>Swap</p>
                        <div onClick={() => setShowSwapSettings(true)} style={{ transform: "translateY(0%)", fontSize: "16px", color: "#909090", cursor: "pointer" }}><FontAwesomeIcon icon={icon({ name: "gear", style: "solid" })} /></div>
                    </div>
                    <div className="swap-box-token">
                        <div className="swap-box-token-header" >
                            <div className="swap-box-token-header-token">
                                <div className="swap-box-token-header-token-button" onClick={() => setShowAssetListTokenOne(true)}>
                                    <img className="swap-box-token-header-token-logo" src={tokenOne.logoURI ? tokenOne.logoURI : require("../../assets/images/placeholder.png")}></img>
                                    <div className="swap-box-token-header-token-name">{tokenOne.symbol}</div>
                                    <div style={{ transform: "translateY(-18%)", fontSize: "24px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>
                                </div>
                                {tokenOne.symbol !== "BNB" && <Link className="swap-box-token-header-token-link" to={`/tokens/${tokenOne.name.replaceAll(" ", "-").replaceAll(".", "-").replaceAll("(", "-").replaceAll(")", "-").toLocaleLowerCase()}`}>
                                    <div style={{ transform: "translateY(0%)", fontSize: "12px" }}><FontAwesomeIcon icon={icon({ name: "up-right-from-square", style: "solid" })} /></div>
                                </Link>}
                            </div>
                            <div className="swap-box-token-header-balance">
                                {`Balance: ${props.walletOwner && FormatDecimals(BigNumberToFloat(GetBalances({
                                    walletOwner: props.walletOwner,
                                    tokenOne: tokenOne,
                                    tokenTwo: tokenTwo,
                                    nativeSymbol: nativeSymbol,
                                    walletBalance: props.walletBalance
                                })[0], tokenOne.decimals))}`}
                            </div>
                        </div>
                        <div className="swap-box-token-input">
                            <input style={{ color: priceColor }} type="number" min="0" placeholder="0.0" value={Number(tokenOneInputValue) > 0 ? FormatDecimals(BigNumberToFloat(tokenOneInputValue, tokenOne.decimals)) : ""} onChange={onChangeTokenOneInput} />
                        </div>
                    </div>
                    <div className="swap-box-token-switch" onClick={() => SwitchToken()}>
                        <div style={{ transform: "translateY(0%)", fontSize: "30px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>
                        <div style={{ transform: "translateY(0%)", fontSize: "30px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>
                    </div>
                    <div className="swap-box-token">
                        <div className="swap-box-token-header" >
                            <div className="swap-box-token-header-token-button" onClick={() => setShowAssetListTokenTwo(true)}>
                                <div className="swap-box-token-header-token">
                                    <img className="swap-box-token-header-token-logo" src={tokenTwo.logoURI ? tokenTwo.logoURI : require("../../assets/images/placeholder.png")}></img>
                                    <div className="swap-box-token-header-token-name">{tokenTwo.symbol}</div>
                                    <div style={{ transform: "translateY(-18%)", fontSize: "24px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>
                                    {tokenTwo.symbol !== "BNB" && <Link className="swap-box-token-header-token-link" to={`/tokens/${tokenTwo.name.replaceAll(" ", "-").replaceAll(".", "-").replaceAll("(", "-").replaceAll(")", "-").toLocaleLowerCase()}`}>
                                        <div style={{ transform: "translateY(0%)", fontSize: "12px" }}><FontAwesomeIcon icon={icon({ name: "up-right-from-square", style: "solid" })} /></div>
                                    </Link>}
                                </div>
                            </div>
                            <div className="swap-box-token-header-balance">
                                {`Balance: ${props.walletOwner && FormatDecimals(BigNumberToFloat(GetBalances({
                                    walletOwner: props.walletOwner,
                                    tokenOne: tokenOne,
                                    tokenTwo: tokenTwo,
                                    nativeSymbol: nativeSymbol,
                                    walletBalance: props.walletBalance
                                })[1], tokenTwo.decimals))}`}
                            </div>
                        </div>
                        <div className="swap-box-token-input">
                            <input style={{ color: priceColor }} type="number" min="0" placeholder="0.0" value={Number(tokenTwoInputValue) > 0 ? FormatDecimals(BigNumberToFloat(tokenTwoInputValue, tokenTwo.decimals)) : ""} onChange={onChangeTokenTwoInput} />
                        </div>
                    </div>
                    <div className="swap-box-pair-price">
                        {amountType === 0 && <p>{`1 ${tokenOne.symbol} = ${dexPriceOut && FormatDecimals(BigNumberToFloat(BigNumber.from(dexPriceOut.toString()), 18))} ${tokenTwo.symbol}`}</p>}
                        {amountType === 1 && <p>{`1 ${tokenTwo.symbol} = ${dexPriceIn && FormatDecimals(BigNumberToFloat(BigNumber.from(dexPriceIn.toString()), 18))} ${tokenOne.symbol}`}</p>}
                    </div>
                    {Number(amountsOut) > 0 && <div className="swap-box-summary">
                        <table className="swap-box-summary-table">
                            <tbody>
                                {amountType === 0 && <tr>
                                    <td className="swap-box-summary-cell-title">Expected output</td>
                                    <td className="swap-box-summary-cell-contents">{`${FormatDecimals(BigNumberToFloat(tokenTwoInputValue, tokenTwo.decimals))} ${tokenTwo.symbol}`}</td>
                                </tr>}
                                {amountType === 1 && <tr>
                                    <td className="swap-box-summary-cell-title">Expected output</td>
                                    <td className="swap-box-summary-cell-contents">{`${FormatDecimals(BigNumberToFloat(tokenTwoInputValue, tokenTwo.decimals))} ${tokenTwo.symbol}`}</td>
                                </tr>}

                                {amountType === 0 && <tr>
                                    <td className="swap-box-summary-cell-title">Minimum received</td>
                                    <td className="swap-box-summary-cell-contents">{`${FormatDecimals(BigNumberToFloat(tokenTwoInputValue, tokenTwo.decimals) * (1 - slippage))} ${tokenTwo.symbol}`}</td>
                                </tr>}
                                {amountType === 1 && <tr>
                                    <td className="swap-box-summary-cell-title">Maximum sent</td>
                                    <td className="swap-box-summary-cell-contents">{`${FormatDecimals(BigNumberToFloat(tokenOneInputValue, tokenOne.decimals) * (1 + slippage))} ${tokenOne.symbol}`}</td>
                                </tr>}
                                <tr>
                                    <td className="swap-box-summary-cell-title">Price impact</td>
                                    <td className="swap-box-summary-cell-contents">{`${parseFloat((priceImpact * 100).toString()).toFixed(2)}%`}</td>
                                </tr>
                                <tr>
                                    <td className="swap-box-summary-cell-title">Trading fee</td>
                                    <td className="swap-box-summary-cell-contents">{`${path && (path.length - 1) * FormatDecimals(BigNumberToFloat(tokenOneInputValue, tokenOne.decimals) * factory.swapFee)}  ${tokenOne.symbol}`}</td>
                                </tr>
                                <tr>
                                    <td className="swap-box-summary-cell-title">Liquid Path</td>
                                    <td className="swap-box-summary-cell-contents">
                                        <div className="swap-box-summary-cell-contents-liquid-path">
                                            <img className="swap-box-summary-cell-contents-liquid-path-factory" src={factory.logoURI} alt={factory.name} />
                                            <div className="swap-box-summary-cell-contents-liquid-path-line"></div>
                                            <div className="swap-box-summary-cell-contents-liquid-path-assets">
                                                {path?.map((asset: string, index: number) =>
                                                    <>
                                                        <img key={index} className="swap-box-summary-cell-contents-liquid-path-asset" src={GetAssetLogo(asset)[1] ? GetAssetLogo(asset)[1] : require("../../assets/images/placeholder.png")} alt={GetAssetLogo(asset)[0]} />
                                                        {index < path.length - 1 && <div>{">"}</div>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>}
                    <SwapButton swapType={undefined} swapRouterAddress={swapRouterAddress} tokenOneInputValue={tokenOneInputValue} tokenTwoInputValue={tokenTwoInputValue} walletOwner={props.walletOwner} walletBalance={props.walletBalance} />
                </div>
            </div>
        </div >
    )
}