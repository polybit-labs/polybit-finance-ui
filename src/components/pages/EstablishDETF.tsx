import "./EstablishDETF.css"
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import { Progress } from '../Progress'
import { TruncateAddress } from '../utils/Formatting'
import polybitAddresses from "../../chain_info/polybitAddresses.json"
import PolybitDETFFactoryInterface from "../../chain_info/IPolybitDETFFactory.json"
import { Interface } from 'ethers/lib/utils'
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import Footer from "./Footer"
import MainContainer from "../containers/Main"
import ContentBox from "../containers/ContentBox"
import Connect from "../Connect"


function EstablishDETF() {
    const location = useLocation()
    const { category, dimension, productId, processOrigin, activeStage } = location.state
    const { address: walletOwner, connector, isConnected } = useAccount()
    const [detfAddress, setDETFAddress] = useState("")
    const detfFactoryAddress: string = polybitAddresses["5777"]["detf_factory"]
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
    console.log(walletOwner, category, dimension, productId, processOrigin, activeStage)
    const title = "Establishing your DETF"
    const titleInfo = `You have chosen to invest in the ${category} ${dimension} DETF from your address ${TruncateAddress(walletOwner ? walletOwner : "")} using ${connector?.name}.`
    const titleInfoConnect = `You have chosen to invest in the ${category} ${dimension} DETF. Please connect your wallet to proceed.`
    const [detfSuccess, setDETFSuccess] = useState(false)

    const { config, error } = usePrepareContractWrite({
        addressOrName: detfFactoryAddress,
        contractInterface: IPolybitDETFFactory,
        functionName: "createDETF",
        args: [walletOwner,
            productId,
            category,
            dimension]
    })
    const { data, isLoading, isSuccess, isError: newDETFError, write: createNewDETF } = useContractWrite(config)
    if (newDETFError) {
        console.log(newDETFError)
    }

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[0].address : []
            console.log("Settled", response)
            setDETFAddress((response.toString()))
            setDETFSuccess(true)
        }
    })

    if (isConnected) {
        return (
            <>
                <TitleContainer title={title} />
                <SubTitleContainer info={titleInfo} />
                <Progress processOrigin={processOrigin} activeStage={activeStage} />
                <MainContainer>
                    <ContentBox>
                        <div className={isSuccess ? "establish-detf-wrapper-inactive" : "establish-detf-wrapper"}>
                            <div className="establish-detf-header">It’s time to establish your DETF, ready for you to invest into.</div>
                            <div ><p>Polybit’s Decentralized Exchange Traded Fund technology is deployed on an investment-by-investment basis, ensuring you are the sole custodian of your funds. Polybit does not, and will not, have control over your source of funds, your DETFs, or the investments within. </p></div>
                            <div className="establish-detf-how-it-works"><Link className="establish-detf-how-it-works-link" to="/how-it-works">Learn more about how Polybit works</Link></div>
                            <button className="establish-detf-button" disabled={!createNewDETF} onClick={async () => createNewDETF?.()}>Establish DETF on the blockchain</button>
                            {error && (
                                <div>An error occurred preparing the transaction: {error.message}</div>
                            )}
                        </div>
                        <div className={transactionLoading ? "confirming-detf-wrapper" : "confirming-detf-wrapper-inactive"}>
                            {transactionLoading && (<div>Waiting for confirmation from the blockchain...</div>)}
                        </div>
                        <div className={detfSuccess ? "success-detf-wrapper" : "success-detf-wrapper-inactive"}>
                            <div>Congratulations, your {category} {dimension} DETF has been established on the blockchain.</div>
                            <Link className="success-deposit-button-link" to="/deposit" state={{ category: category, dimension: dimension, productId: productId.toString(), detfAddress: detfAddress, processOrigin: "establish", activeStage: 2 }}>
                                <button className="success-deposit-button">Deposit funds</button></Link>
                        </div>
                    </ContentBox>
                </MainContainer>
                <Footer />
            </>
        )
    }

    return (
        <>
            <TitleContainer title={title} />
            <SubTitleContainer info={titleInfoConnect} />
            <Connect />
            <Footer />
        </>
    )
}

export default EstablishDETF