import { useEffect, useState } from 'react'
import { TruncateAddress } from '../utils/Formatting'
import { useLocation } from 'react-router-dom'
import TitleContainer from "../containers/Title"
import SubTitleContainer from '../containers/SubTitle'
import { useAccount } from "wagmi"
import Footer from './Footer'
import { Progress } from '../Progress'
import { DepositContainer } from '../deposit/DepositContainer'

function Deposit() {
    const location = useLocation()
    const [title, setTitle] = useState("Your investment amount")
    const { category, dimension, productId, detfAddress } = location.state
    const [activeStage, setActiveStage] = useState("deposit-details")
    const [depositSuccess, setDepositSuccess] = useState(false)
    const { address: walletOwner, connector, isConnected } = useAccount()

    useEffect(() => {
        //Reset view on component load
        if (activeStage === "deposit-summary") {
            window.scrollTo(0, 580);
        }
    }, [activeStage])

    return (
        <>
            {!depositSuccess && <div>
                <TitleContainer title={title} />
                <SubTitleContainer info={`You are about to invest funds from your address ${TruncateAddress(walletOwner ? walletOwner : "")} into the ${category} ${dimension} DETF using ${connector?.name}.`} />
                <Progress activeStage={activeStage} />
            </div>}
            <DepositContainer
                category={category}
                dimension={dimension}
                productId={productId}
                detfAddress={detfAddress}
                setActiveStage={setActiveStage}
                activeStage={activeStage}
                setDepositSuccess={setDepositSuccess}
                depositSuccess={depositSuccess}
            />
            <Footer />
        </>
    )
}

export default Deposit