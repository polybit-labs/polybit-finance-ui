import { useContext, useEffect, useState } from 'react'
import { Footer } from '../../components/Footer/Footer'
import { Helmet } from 'react-helmet-async'
import TitleContainer from '../../components/containers/Title'
import { SwapBox } from './SwapBox'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import { CurrencyContext } from '../../components/utils/Currency'
import { useLocation } from 'react-router-dom'
import { initialiseGA4 } from '../../components/utils/Analytics'
import ReactGA from "react-ga4"
import { BigNumber } from 'ethers'
import { BNB, CAKE, ERC20Token } from '../../components/utils/ERC20Utils'
import { SwapSummary } from './SwapSummary'
import { Connect } from '../../components/Connect/Connect'
import SubTitleContainer from '../../components/containers/SubTitle'
import ChainInfo from "../../context/ChainInfo.json"
import { useSearchParams } from 'react-router-dom'

interface DEX {
    address: string;
    name: string;
    logoURI: string;
    swapFee: number;
}

function Swap() {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const [tokenOne, setTokenOne] = useState<ERC20Token>(BNB)
    const [tokenTwo, setTokenTwo] = useState<ERC20Token>(CAKE)
    const [searchParams, setSearchParams] = useSearchParams()
    const address = searchParams.get("address")
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        address: walletOwner,
    })
    const { chain, chains } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    const currency = useContext(CurrencyContext).currency

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

    useEffect(() => {
        if (isConnected) {
            setShowConnectWallet(false)
        }
    }, [isConnected])

    const title: string = "Swap"
    const [approvedList, setApprovedList] = useState<Array<ERC20Token>>([])
    const [tokenOneInputValue, setTokenOneInputValue] = useState<BigNumber>()
    const [tokenTwoInputValue, setTokenTwoInputValue] = useState<BigNumber>()
    const [factory, setFactory] = useState<DEX>({ address: "", name: "", logoURI: "", swapFee: 0 })
    const [path, setPath] = useState<readonly `0x${string}`[]>([])
    const [amountsOut, setAmountsOut] = useState<BigNumber>(BigNumber.from(0))
    const [amountOutMin, setAmountOutMin] = useState<BigNumber>(BigNumber.from(0))
    const [amountInMax, setAmountInMax] = useState<BigNumber>(BigNumber.from(0))
    const [amountType, setAmountType] = useState<number>(0)
    const nativeSymbol: string = ChainInfo[chainId as keyof typeof ChainInfo]["native_symbol"]
    const [dexPrice, setDexPrice] = useState<number>(0)
    const [slippage, setSlippage] = useState<number>(0.005)
    const [deadline, setDeadline] = useState<number>(20)
    const [tradingFee, setTradingFee] = useState<number>(0)
    const [tradingFeeAmount, setTradingFeeAmount] = useState<BigNumber>(BigNumber.from("0"))
    const [swapType, setSwapType] = useState<"swapETHForExactTokens" | "swapExactETHForTokens" | "swapExactTokensForETH" | "swapExactTokensForTokens" | "swapTokensForExactETH" | "swapTokensForExactTokens" | undefined>()
    const [showTitle, setShowTitle] = useState<boolean>(true)
    const [showSwapBox, setShowSwapBox] = useState<boolean>(true)
    const [showSwapSummary, setShowSwapSummary] = useState<boolean>(false)
    const [showConnectWallet, setShowConnectWallet] = useState(false)

    const searchAddress = (address: string) => {
        if (address === "") {
            setTokenOne(BNB)
            setTokenTwo(CAKE)
        } else {
            const filtered = approvedList.filter((asset) => {
                return asset.address.toLowerCase() === address.toLowerCase()
            })
            const searchToken: ERC20Token = filtered[0]
            approvedList && setTokenOne(searchToken)
            approvedList && setTokenTwo(BNB)
        }
    }

    useEffect(() => {
        if (address && approvedList.length !== 0) {
            searchAddress(address)
        }
    }, [address, approvedList])

    return (
        <>
            <Helmet>
                <title>Swap | Polybit Finance</title>
                <meta name="description" content="" />
            </Helmet>
            {showTitle && <TitleContainer title={title} />}
            {showConnectWallet &&
                <>
                    <SubTitleContainer info={"Please connect your wallet."} />
                    <Connect />
                </>}
            {!showConnectWallet &&
                showSwapBox && <SwapBox
                    isConnected={isConnected}
                    chainId={chainId}
                    approvedList={approvedList}
                    nativeSymbol={nativeSymbol}
                    tokenOne={tokenOne}
                    setTokenOne={setTokenOne}
                    tokenTwo={tokenTwo}
                    setTokenTwo={setTokenTwo}
                    tokenOneInputValue={tokenOneInputValue}
                    setTokenOneInputValue={setTokenOneInputValue}
                    tokenTwoInputValue={tokenTwoInputValue}
                    setTokenTwoInputValue={setTokenTwoInputValue}
                    factory={factory}
                    setFactory={setFactory}
                    path={path}
                    setPath={setPath}
                    amountsOut={amountsOut}
                    setAmountsOut={setAmountsOut}
                    amountOutMin={amountOutMin}
                    setAmountOutMin={setAmountOutMin}
                    amountInMax={amountInMax}
                    setAmountInMax={setAmountInMax}
                    amountType={amountType}
                    setAmountType={setAmountType}
                    slippage={slippage}
                    setSlippage={setSlippage}
                    deadline={deadline}
                    setDeadline={setDeadline}
                    setTradingFee={setTradingFee}
                    setTradingFeeAmount={setTradingFeeAmount}
                    dexPrice={dexPrice}
                    setDexPrice={setDexPrice}
                    walletOwner={walletOwner}
                    walletBalance={walletBalance ? walletBalance.value : BigNumber.from("0")}
                    connector={connector}
                    currency={currency}
                    setShowSwapBox={setShowSwapBox}
                    setShowSwapSummary={setShowSwapSummary}
                    setSwapType={setSwapType}
                    setShowConnectWallet={setShowConnectWallet}
                />}
            {showSwapSummary && <SwapSummary
                isConnected={isConnected}
                chainId={chainId}
                approvedList={approvedList}
                nativeSymbol={nativeSymbol}
                tokenOne={tokenOne}
                tokenTwo={tokenTwo}
                tokenOneInputValue={tokenOneInputValue}
                tokenTwoInputValue={tokenTwoInputValue}
                factory={factory}
                path={path}
                amountsOut={amountsOut}
                amountOutMin={amountOutMin}
                amountInMax={amountInMax}
                amountType={amountType}
                slippage={slippage}
                deadline={deadline}
                tradingFee={tradingFee}
                tradingFeeAmount={tradingFeeAmount}
                dexPrice={dexPrice}
                setShowSwapBox={setShowSwapBox}
                setShowSwapSummary={setShowSwapSummary}
                walletOwner={walletOwner}
                walletBalance={walletBalance ? walletBalance.value : BigNumber.from("0")}
                swapType={swapType}
                setShowTitle={setShowTitle}
            />}

            <Footer />
        </>
    )
}

export default Swap