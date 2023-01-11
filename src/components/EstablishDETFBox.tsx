import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import "./pages/EstablishDETF.css"
import { useEffect, useState } from 'react'
import polybitAddresses from "../chain_info/polybitAddresses.json"
import PolybitDETFFactoryInterface from "../chain_info/IPolybitDETFFactory.json"
import { Interface } from 'ethers/lib/utils'
import { Link, useNavigate } from 'react-router-dom'

interface EstablishDETFBox {
    productId: number
    category: string;
    dimension: string;
}

export const EstablishDETFBox = (props: EstablishDETFBox) => {
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    const Web3 = require('web3')
    const web3 = new Web3(rpc)
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const [detfAddress, setDETFAddress] = useState("")
    const navigate = useNavigate();
    const navToAccount = () => navigate("/deposit", { state: { category: props.category, dimension: props.dimension, productId: props.productId.toString(), detfAddress: detfAddress, processOrigin: "establish", activeStage: 2 } })
    const detfFactoryAddress: string = polybitAddresses[chainId as keyof typeof polybitAddresses]["detf_factory"]
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)

    const { config, error, isLoading: prepareConfigLoading } = usePrepareContractWrite({
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

    const { data, isLoading, isSuccess, isError: newDETFError, write: createNewDETF } = useContractWrite(config)

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
            setDETFAddress(detfAddress)
        }
    })

    useEffect(() => {
        if (transactionSuccess && detfAddress !== "") {
            navToAccount()
        }
    }, [transactionSuccess, detfAddress])

    return (
        <>
            {!isSuccess && <div className="establish-detf-wrapper">
                <div className="establish-detf-header">It’s time to establish your DETF, ready for you to invest into.</div>
                <div ><p>Polybit’s Decentralized Exchange Traded Fund technology is deployed on an investment-by-investment basis, ensuring you are the sole custodian of your funds. Polybit does not, and will not, have control over your source of funds, your DETFs, or the investments within. </p></div>
                <div className="establish-detf-how-it-works"><Link className="establish-detf-how-it-works-link" to="/how-it-works">Learn more about how Polybit works</Link></div>
                {!prepareConfigLoading && !isLoading && <button className="establish-detf-button" disabled={!createNewDETF} onClick={async () => createNewDETF?.()}>Establish DETF on the blockchain</button>}
                {isLoading && <button className="establish-detf-button" disabled={true}>Establish DETF on the blockchain</button>}
                {prepareConfigLoading && <img height="90px" width="90px" src={require("../assets/images/loading.gif")} alt="Loading"></img>}
                {error && (
                    <div>An error occurred preparing the transaction: {error.message}</div>
                )}
            </div>
            }
            {transactionLoading && <div className="confirming-detf-wrapper">
                <img height="90px" width="90px" src={require("../assets/images/loading.gif")} alt="Loading"></img>
            </div>}
        </>)
}