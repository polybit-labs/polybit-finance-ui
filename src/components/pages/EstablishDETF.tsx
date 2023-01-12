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

function EstablishDETF() {
    const location = useLocation()
    const { category, dimension, productId, processOrigin, activeStage } = location.state
    const { address: walletOwner, connector, isConnected } = useAccount()
    const title = "Establishing your DETF"
    const titleInfo = `You have chosen to invest in the ${category} ${dimension} DETF from your address ${TruncateAddress(walletOwner ? walletOwner : "")} using ${connector?.name}.`

    if (isConnected) {
        return (
            <>
                <TitleContainer title={title} />
                <SubTitleContainer info={titleInfo} />
                <Progress processOrigin={processOrigin} activeStage={activeStage} />
                <MainContainer>
                    <ContentBox>
                        <EstablishDETFBox productId={productId} category={category} dimension={dimension} />
                    </ContentBox>
                </MainContainer>
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