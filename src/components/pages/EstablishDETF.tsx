import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import { Progress } from '../Progress'
import { TruncateAddress } from '../utils/Formatting'
import { useAccount, useNetwork } from 'wagmi'
import Footer from "./Footer"
import { EstablishDETFBox } from "../EstablishDETFBox"
import { Connect } from "../Connect"
import { DepositContainer } from "../deposit/DepositContainer"
import { SwitchNetwork } from "../SwitchNetwork"
import ReactGA from "react-ga4"
import { initialiseGA4 } from '../utils/Analytics'
import { LockedBeta } from '../LockedBeta'
import { Helmet } from 'react-helmet-async'

function EstablishDETF() {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const { chain } = useNetwork()
    const { category, dimension } = location.state
    const { address: walletOwner, connector, isConnected } = useAccount()
    const [activeStage, setActiveStage] = useState("establish")
    const title = "Establishing your DETF"
    const titleInfo = `You have chosen to invest in the ${category} ${dimension} investment theme from your address ${TruncateAddress(walletOwner ? walletOwner : "")} using ${connector?.name}.`
    const [detfAddress, setDETFAddress] = useState("")
    const [depositSuccess, setDepositSuccess] = useState(false)

    useEffect(() => {
        //Reset view on component load
        if (activeStage === "establish" ||
            activeStage === "establish-deposit-details" ||
            activeStage === "establish-deposit-summary") {
            window.scrollTo(0, 580);
        }
    }, [activeStage])

    if (window.location.href.includes("polybit.finance")) {
        return (
            <>
                <Helmet>
                    <title>Deposit | Polybit Finance</title>
                    <meta name="description" content="" />
                    <meta name="robots" content="noindex" />
                </Helmet>
                <LockedBeta />
                <Footer />
            </>
        )
    }

    if (isConnected && !chain?.unsupported) {
        return (
            <>
                <Helmet>
                    <title>Deposit | Polybit Finance</title>
                    <meta name="description" content="" />
                    <meta name="robots" content="noindex" />
                </Helmet>
                {!depositSuccess && <div>
                    <TitleContainer title={title} />
                    <SubTitleContainer info={titleInfo} />
                    <Progress activeStage={activeStage} />
                </div>}
                {activeStage === "establish" && <EstablishDETFBox category={category} dimension={dimension} setDETFAddress={setDETFAddress} detfAddress={detfAddress} setActiveStage={setActiveStage} />}
                {(activeStage === "establish-deposit-details" ||
                    activeStage === "establish-deposit-summary") &&
                    <DepositContainer
                        category={category}
                        dimension={dimension}
                        detfAddress={detfAddress}
                        setActiveStage={setActiveStage}
                        activeStage={activeStage}
                        setDepositSuccess={setDepositSuccess}
                        depositSuccess={depositSuccess}
                    />}
                <Footer />
            </>
        )
    }

    if (isConnected && chain?.unsupported) {
        return (<SwitchNetwork />)
    }

    const subTitleNotConnected = <div><h2>You are not currently connected to a wallet. Please connect your wallet to proceed.</h2></div>

    return (
        <>
            <Helmet>
                <title>Deposit | Polybit Finance</title>
                <meta name="description" content="" />
                <meta name="robots" content="noindex" />
            </Helmet>
            <TitleContainer title={title} />
            <SubTitleContainer info={subTitleNotConnected} />
            <Connect />
            <Footer />
        </>
    )
}

export default EstablishDETF