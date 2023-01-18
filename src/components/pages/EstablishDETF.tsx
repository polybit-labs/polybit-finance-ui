import "./EstablishDETF.css"
import { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import { Progress } from '../Progress'
import { TruncateAddress } from '../utils/Formatting'
import polybitAddresses from "../../chain_info/polybitAddresses.json"
import PolybitDETFFactoryInterface from "../../chain_info/IPolybitDETFFactory.json"
import { Interface } from 'ethers/lib/utils'
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import Footer from "./Footer"
import MainContainer from "../containers/Main"
import ContentBox from "../containers/ContentBox"
import { EstablishDETFBox } from "../EstablishDETFBox"
import { Connect } from "../Connect"
import { DepositContainer } from "../deposit/DepositContainer"

function EstablishDETF() {
    const location = useLocation()
    const { category, dimension, productId } = location.state
    const { address: walletOwner, connector, isConnected } = useAccount()
    const [activeStage, setActiveStage] = useState("establish")
    const title = "Establishing your DETF"
    const titleInfo = `You have chosen to invest in the ${category} ${dimension} DETF from your address ${TruncateAddress(walletOwner ? walletOwner : "")} using ${connector?.name}.`
    const [detfAddress, setDETFAddress] = useState("")
    const [depositSuccess, setDepositSuccess] = useState(false)

    useEffect(() => {
        //Reset view on component load
        if (activeStage === "establish-deposit-details" ||
            activeStage === "establish-deposit-summary" ||
            activeStage === "deposit-summary") {
            window.scrollTo(0, 650);
        }
    }, [activeStage]);

    if (isConnected) {
        return (
            <>
                {!depositSuccess && <div>
                    <TitleContainer title={title} />
                    <SubTitleContainer info={titleInfo} />
                    <Progress activeStage={activeStage} />
                </div>}
                {activeStage === "establish" && <EstablishDETFBox productId={productId} category={category} dimension={dimension} setDETFAddress={setDETFAddress} detfAddress={detfAddress} setActiveStage={setActiveStage} />}
                {(activeStage === "establish-deposit-details" ||
                    activeStage === "establish-deposit-summary") &&
                    <DepositContainer
                        category={category}
                        dimension={dimension}
                        productId={productId}
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

    const subTitleNotConnected = <div><h2>You are not currently connected to a crypto wallet. Please connect your wallet to proceed.</h2></div>

    return (
        <>
            <TitleContainer title={title} />
            <SubTitleContainer info={subTitleNotConnected} />
            <MainContainer>
                <Connect />
            </MainContainer>
            <Footer />
        </>
    )
}

export default EstablishDETF