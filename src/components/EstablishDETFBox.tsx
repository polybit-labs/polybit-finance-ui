import "./EstablishDETFBox.css"
import { Link, Navigate } from 'react-router-dom'
import { usePrepareContractWrite, useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import { Interface } from 'ethers/lib/utils'
import { useEffect, useInsertionEffect, useRef, useState } from "react"

interface EstablishDETFBoxProps {
    detfName: string | "";
    detfOracleAddress: string;
    detfFactoryAddress: string[];
    IPolybitDETFFactory: Interface;
    walletOwner: string | undefined;
    detfAddress: Function;
}

const EstablishDETFBox = (props: EstablishDETFBoxProps) => {
    const [detfSuccess, setDETFSuccess] = useState(false)
    const { config, error } = usePrepareContractWrite({
        addressOrName: props.detfFactoryAddress[0],
        contractInterface: props.IPolybitDETFFactory,
        functionName: "createDETF",
        args: [props.walletOwner,
        props.detfOracleAddress,
            0]
    })
    const { data, isLoading, isSuccess, write: createNewDETF } = useContractWrite(config)

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[0].address : []
            console.log("Settled", response)
            props.detfAddress(response)
            setDETFSuccess(true)
        }
    })

    return (
        <div className="establish-detf-container">
            <div className={isSuccess ? "establish-detf-box-inactive" : "establish-detf-box"}>
                <div className="establish-detf-box-header">It’s time to establish your DETF, ready for you to invest into.</div>
                <div ><p>Polybit’s Decentralized Exchange Traded Fund technology is deployed on an investment-by-investment basis, ensuring you are the sole custodian of your funds. Polybit does not, and will not, have control over your source of funds, your DETFs, or the investments within. </p></div>
                <div className="establish-detf-box-how-it-works"><Link className="establish-detf-box-how-it-works-link" to="/how-it-works">Learn more about how Polybit works</Link></div>
                <button className="establish-detf-button" disabled={!createNewDETF} onClick={async () => createNewDETF?.()}>Establish DETF on the blockchain</button>
                {error && (
                    <div>An error occurred preparing the transaction: {error.message}</div>
                )}
            </div>
            <div className={transactionLoading ? "confirming-detf-box" : "confirming-detf-box-inactive"}>
                {transactionLoading && (<div>Waiting for confirmation from the blockchain...</div>)}
            </div>
            <div className={detfSuccess ? "success-detf-box" : "success-detf-box-inactive"}>
                <div>Congratulations, your {props.detfName} DETF has been established on the blockchain.</div>
                <Link to="/deposit" state={{ detfName: props.detfName, detfAddress: props.detfAddress, processOrigin: "establish", activeStage: 2 }}>
                    <button className="success-deposit-button">Deposit funds</button></Link>
            </div>
        </div>
    )
}

export default EstablishDETFBox