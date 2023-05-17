import { BigNumber } from "ethers"
import { Button } from "../../components/Buttons/Buttons";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, erc20ABI } from "wagmi"

interface ApproveProps {
    token: `0x${string}`;
    user: `0x${string}`;
    spender: `0x${string}`;
    amount: BigNumber;
    setSpenderApproved: Function;
    spenderApproved: boolean;
    refetch: Function;
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

    const { data: waitForTransaction, isError: transactionError, isLoading: approveLoading, isSuccess: approveSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            //const response = data ? data.logs[2].data : []
            console.log("approved transaction data", data)
        },
        onError(error) {
            console.log('approve Error', error)
        },
        onSuccess(data) {
            console.log('approve Success', data)
            props.setSpenderApproved(true)
            props.refetch()
        }
    })
    return (
        <>
            {approveLoading && <Button text="Approve Swap" buttonSize="standard" buttonStyle="primary" status="loading" />}
            {!approveLoading && <Button text="Approve Swap" buttonSize="standard" buttonStyle="primary" onClick={() => write?.()} />}
        </>
    )
}