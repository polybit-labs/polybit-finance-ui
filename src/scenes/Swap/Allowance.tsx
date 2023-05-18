import { BigNumber } from "ethers";
import { useState } from "react";
import { useContractRead, erc20ABI } from "wagmi";

interface AllowanceProps {
    token: `0x${string}`;
    user: `0x${string}`;
    spender: `0x${string}`;
    amount: BigNumber;
}

export const Allowance = (props: AllowanceProps) => {
    const [spenderApproved, setSpenderApproved] = useState<boolean>(false)
    const { data, isError, isLoading, isSuccess } = useContractRead({
        address: props.token,
        abi: erc20ABI,
        functionName: "allowance",
        args: [props.user, props.spender],
        onSettled(data, error) {
            //console.log('allowance Settled', { data, error })
        },
        onSuccess(data) {
            //console.log('allowance Success', data)
            if (Number(props.amount) !== 0 &&
                Number(data) >= Number(props.amount)) {
                setSpenderApproved(true)
            }
        },
    })
    return spenderApproved
}