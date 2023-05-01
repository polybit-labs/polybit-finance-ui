import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import PolybitInfo from "../chain_info/PolybitInfo.json"
import PolybitDETFFactoryInterface from "../chain_info/IPolybitDETFFactory.json"
import { Interface } from 'ethers/lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './Buttons'
import { Loading } from './Loading'
import "./EstablishDETFBox.css"
import { BigNumber } from 'ethers'

interface EstablishDETFBox {
    category: string;
    dimension: string;
    setDETFAddress: Function;
    detfAddress: string;
    setActiveStage: Function;
}

export const EstablishDETFBox = (props: EstablishDETFBox) => {
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default.http[0]
    const Web3 = require('web3')
    const web3 = new Web3(rpc)
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const navigate = useNavigate();
    const navToAccount = () => navigate("/deposit", { state: { category: props.category, dimension: props.dimension, detfAddress: props.detfAddress, processOrigin: "establish", activeStage: 2 } })
    const detfFactoryAddress: string = PolybitInfo[chainId as keyof typeof PolybitInfo]["addresses"]["detf_factory"]
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)

    const { config, error, isLoading: prepareConfigLoading, isSuccess: prepareConfigSuccess } = usePrepareContractWrite({
        address: detfFactoryAddress as `0x${string}`,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_walletOwner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_productCategory",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_productDimension",
                    "type": "string"
                }
            ],
            "name": "createDETF",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: "createDETF",
        args: [walletOwner as `0x${string}`,
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
        },
        onError(error) {
            console.log('useWaitForTransaction', error)
        },
    })

    useEffect(() => {
        //Reset view on component load
        if (transactionLoading) {
            window.scrollTo(0, 650);
        }
    }, [transactionLoading])

    useEffect(() => {
        if (transactionSuccess && props.detfAddress !== "") {
            //navToAccount()
            props.setActiveStage("establish-deposit-details")
        }
    }, [transactionSuccess, props.detfAddress])

    if (prepareConfigSuccess && !contractWriteSuccess) {
        return (
            <div className="establish-detf">
                <div className="establish-detf-container">
                    <h2>You are one step closer to investing in diversified assets.</h2>
                    <br />
                    <p>Establishing a DETF will cost a small amount of BNB that will be paid to the network for gas. Polybit does not profit from this cost. Once the DETF has been established, you are ready to invest.</p>
                    <div className="establish-detf-button-wrapper">
                        {!prepareConfigLoading && !contractWriteLoading && <Button buttonStyle="primary" buttonSize="standard" text="Establish DETF on the blockchain" onClick={async () => createNewDETF?.()} />}
                        {contractWriteLoading && <Button buttonStyle="primary" buttonSize="standard" text="Establish DETF on the blockchain" status="loading" loadingMsg={`waiting for ${connector?.name}`} />}
                        {error && (
                            <div>An error occurred preparing the transaction: {error.message}</div>
                        )}
                    </div>
                </div>
            </div>
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