import { BigNumber } from "ethers"
import { Button } from "../Buttons"
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, erc20ABI } from "wagmi"

interface ApproveProps {
    token: `0x${string}`;
    user: `0x${string}`;
    spender: `0x${string}`;
    amount: BigNumber;
}

export const Approve = (props: ApproveProps) => {
    const { config, error, isSuccess, isLoading } = usePrepareContractWrite({
        address: props.token,
        abi: erc20ABI,
        functionName: "approve",
        args: [props.spender, props.amount],
        onError(error) {
            console.log('approve Config Error', error)
        },
        onSuccess(data) {
            console.log('approve Config Success', data)
        },
    })

    const { data, write } = useContractWrite(config)

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            //const response = data ? data.logs[2].data : []
            console.log("approved transaction data", data)
        },
        onError(error) {
            console.log('approve Error', error)
        },
    })
    return (
        <Button text="Approve Swap" buttonSize="standard" buttonStyle="primary" onClick={() => write?.()} />
    )
}