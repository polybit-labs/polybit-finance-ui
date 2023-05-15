import { useEffect, useState } from 'react'
import { TruncateAddress } from '../utils/Formatting'
import { useLocation } from 'react-router-dom'
import TitleContainer from "../containers/Title"
import SubTitleContainer from '../containers/SubTitle'
import { useAccount, useNetwork } from "wagmi"
import { Footer } from '../Footer/Footer'
import { Progress } from '../Progress'
import { EstablishDepositContainer } from '../deposit/EstablishDepositContainer'
import { SwitchNetwork } from '../SwitchNetwork/SwitchNetwork'
import { Connect } from '../Connect/Connect'
import { LockedBeta } from '../LockedBeta'
import { Helmet } from 'react-helmet-async'

function EstablishDeposit() {
    const location = useLocation()
    const { chain } = useNetwork()
    const [title, setTitle] = useState("Your investment amount")
    const { productId, category, dimension } = location.state
    const [activeStage, setActiveStage] = useState("deposit-details")
    const [depositSuccess, setDepositSuccess] = useState(false)
    const { address: walletOwner, connector, isConnected } = useAccount()

    useEffect(() => {
        //Reset view on component load
        if (activeStage === "deposit-summary") {
            window.scrollTo(0, 580);
        }
    }, [activeStage])

    /*     if (window.location.href.includes("polybit.finance")) {
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
        } */

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
                    <SubTitleContainer info={`You are about to invest funds from your address ${TruncateAddress(walletOwner ? walletOwner : "")} into the ${category} ${dimension} investment theme using ${connector?.name}.`} />
                    <Progress activeStage={activeStage} />
                </div>}
                <EstablishDepositContainer
                    productId={productId}
                    category={category}
                    dimension={dimension}
                    setActiveStage={setActiveStage}
                    activeStage={activeStage}
                    setDepositSuccess={setDepositSuccess}
                    depositSuccess={depositSuccess}
                />
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
            {/* <TitleContainer title={title} />
            <SubTitleContainer info={subTitleNotConnected} /> */}
            <Connect />
            <Footer />
        </>
    )
}

export default EstablishDeposit