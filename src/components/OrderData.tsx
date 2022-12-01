import { useState, useEffect } from "react";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { Interface } from 'ethers/lib/utils'
import PolybitDETFInterface from "../chain_info/IPolybitDETF.json"

export const GetOrderData = (detfAddress: string, wethInputAmount: string) => {
    const [response, setResponse] = useState<Array<any>>();
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    const IPolybitDETF = new Interface(PolybitDETFInterface)

    useEffect(() => {
        fetch('/api/rebalancer', {
            method: "POST",
            cache: "no-cache",
            headers: { "content_type": "application/json" }, body: JSON.stringify({ "rpc_provider": rpc, "detf_address": detfAddress, "weth_input_amount": wethInputAmount })
        }).then(res => res.json()).then(data => {
            setResponse(data);
            console.log(data)
        });
    }, []);

    return response

    /* const { config, error, isSuccess: isSuccessPrep } = usePrepareContractWrite({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "rebalance",
        args: [response],
        onError(error) {
            console.log('rebalance usePrepareContractWrite Error', error)
        },
        onSuccess(data) {
            console.log('Success', data)
        },
    })

    console.log("prep error", error)
    console.log("is success", isSuccessPrep)
    const { data, isLoading, isSuccess, write: rebalanceDETF } = useContractWrite({
        ...config,
        onError(error) {
            console.log('rebalanceDETF Error', error)
        },
    })

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[0] : []
            console.log("Settled", response)
            //setDETFSuccess(true)
        }
    })

    return (
        <div className="App">
            <p>Data response is {JSON.stringify(response)}.</p>
            <button disabled={!rebalanceDETF} onClick={() => rebalanceDETF?.()}>Rebalance</button>
        </div> 
    );*/
}