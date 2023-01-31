import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import polybitAddresses from "../chain_info/polybitAddresses.json"
import PolybitDETFFactoryInterface from "../chain_info/IPolybitDETFFactory.json"
import { Interface } from 'ethers/lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './Buttons'
import { Loading } from './Loading'
import "./EstablishDETFBox.css"

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
                    <h2>Cake marzipan biscuit cake jelly-o cake brownie soufflé muffin.</h2>
                    <br />
                    <p>Marshmallow macaroon chocolate cupcake pie. Muffin jujubes sesame snaps lollipop lemon drops pudding danish shortbread danish. Pudding liquorice lollipop cheesecake icing. Bonbon jelly beans soufflé cookie jelly bear claw. Lemon drops sweet tart liquorice dragée icing wafer donut.</p>
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