import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import "./pages/EstablishDETF.css"
import { useEffect, useState } from 'react'
import polybitAddresses from "../chain_info/polybitAddresses.json"
import PolybitDETFFactoryInterface from "../chain_info/IPolybitDETFFactory.json"
import { Interface } from 'ethers/lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { Loading } from './Loading'
import ContentBox from './containers/ContentBox'
import MainContainer from './containers/Main'

interface EstablishDETFBox {
    productId: number
    category: string;
    dimension: string;
    setDETFAddress: Function;
    detfAddress: string;
    setActiveStage: Function;
}

export const EstablishDETFBox = (props: EstablishDETFBox) => {
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    const Web3 = require('web3')
    const web3 = new Web3(rpc)
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const navigate = useNavigate();
    const navToAccount = () => navigate("/deposit", { state: { category: props.category, dimension: props.dimension, productId: props.productId.toString(), detfAddress: props.detfAddress, processOrigin: "establish", activeStage: 2 } })
    const detfFactoryAddress: string = polybitAddresses[chainId as keyof typeof polybitAddresses]["detf_factory"]
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)

    const { config, error, isLoading: prepareConfigLoading, isSuccess: prepareConfigSuccess } = usePrepareContractWrite({
        addressOrName: detfFactoryAddress,
        contractInterface: IPolybitDETFFactory,
        functionName: "createDETF",
        args: [walletOwner,
            props.productId,
            props.category,
            props.dimension],
        onError(error) {
            console.log('createDETF Error', error)
        },
        onSuccess(data) {
            console.log('createDETF Success', data)
        },
    })

    const { data, isLoading: contractWriteLoading, isSuccess: contractWriteSuccess, isError: newDETFError, write: createNewDETF } = useContractWrite(config)

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const logData = data ? data.logs[0].data : []
            const logTopics = data ? data.logs[0].topics[0] : []
            const detfAddress = web3.eth.abi.decodeParameters([
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "msg",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "ref",
                    "type": "address"
                }
            ], logData, logTopics)[1]
            props.setDETFAddress(detfAddress)
        }
    })

    useEffect(() => {
        if (transactionSuccess && props.detfAddress !== "") {
            //navToAccount()
            props.setActiveStage("establish-deposit-details")
        }
    }, [transactionSuccess, props.detfAddress])

    if (prepareConfigSuccess && !contractWriteSuccess) {
        return (
            <MainContainer>
                <ContentBox>
                    <div className="establish-detf-wrapper">
                        <div className="establish-detf-header">It’s time to establish your DETF, ready for you to invest into.</div>
                        <div ><p>Polybit’s Decentralized Exchange Traded Fund technology is deployed on an investment-by-investment basis, ensuring you are the sole custodian of your funds. Polybit does not, and will not, have control over your source of funds, your DETFs, or the investments within. </p></div>
                        <div className="establish-detf-how-it-works"><Link className="establish-detf-how-it-works-link" to="/how-it-works">Learn more about how Polybit works</Link></div>
                        {!prepareConfigLoading && !contractWriteLoading && <Button buttonStyle="primary" buttonSize="standard" text="Establish DETF on the blockchain" onClick={async () => createNewDETF?.()} />}
                        {contractWriteLoading && <Button buttonStyle="primary" buttonSize="standard" text="Establish DETF on the blockchain" status="loading" loadingMsg={`waiting for ${connector?.name}`} />}
                        {error && (
                            <div>An error occurred preparing the transaction: {error.message}</div>
                        )}
                    </div>
                </ContentBox>
            </MainContainer>
        )
    }

    if (transactionLoading) {
        return (
            <Loading loadingMsg="Please wait while your DETF is being initialised" />
        )
    }

    return (
        <Loading />
    )
}