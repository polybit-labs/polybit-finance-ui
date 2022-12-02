import { useState, useEffect } from "react";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { Interface } from 'ethers/lib/utils'
import PolybitDETFInterface from "../chain_info/IPolybitDETF.json"

export const Flask = () => {
    const [response, setResponse] = useState<Array<any>>();
    const network = useNetwork()
    const rpc = network.chain?.rpcUrls.default
    const IPolybitDETF = new Interface(PolybitDETFInterface)


    //const detfAddress = "0xC628a4A4ba2F8c21ad3C2ad0773b8CF5D87d3cD8"
    //const detfAddress = "0xBe7985A4c9004CCF8b05a288bF10e5F87296f10a"
    const detfAddress = "0xDB6bda6C54ca84fd010b58B427956cD533396218"
    const weth_amount = Math.round(10 ** 18 * 5).toString()

    useEffect(() => {
        fetch('/api/rebalancer', {
            method: "POST",
            cache: "no-cache",
            headers: { "content_type": "application/json" }, body: JSON.stringify({ "rpc_provider": rpc, "detf_address": detfAddress, "weth_input_amount": weth_amount })
        }).then(res => res.json()).then(data => {
            setResponse(data);
            console.log(data)
        });
    }, []);

    const { config, error, isSuccess: isSuccessPrep } = usePrepareContractWrite({
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
    const walletOwner = "0x2D8a06c4cb2021747567Cb1fCa3007D8060a8Fda"
    const { config: depositConfig } = usePrepareContractWrite({
        addressOrName: detfAddress,
        contractInterface: IPolybitDETF,
        functionName: "deposit",
        args: [Number(0), response],
        overrides: { from: walletOwner, value: weth_amount },
        onError(error) {
            console.log('depositConfig usePrepareContractWrite Error', error)
        },
        onSuccess(data) {
            console.log('depositConfig success', data)
        },
    })

    console.log("prep error", error)
    console.log("is success", isSuccessPrep)
    const { data, isLoading, isSuccess, write: rebalanceDETF } = useContractWrite({
        ...depositConfig,
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
    );
}