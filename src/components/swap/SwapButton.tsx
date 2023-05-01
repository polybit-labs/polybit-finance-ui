import { BigNumber } from "ethers"
import { Button } from "../Buttons"
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction, erc20ABI } from "wagmi"
import { useEffect, useState } from "react"
import { DEX } from "./Types/DEX"
import moment from 'moment'

interface SwapButtonProps {
    swapRouterAddress: string;
    tokenOneInputValue: BigNumber;
    tokenTwoInputValue: BigNumber;
    factory: DEX;
    path: readonly `0x${string}`[];
    amountOutMin: BigNumber;
    amountInMax: BigNumber;
    deadline: Number;
    walletOwner: `0x${string}` | undefined;
    walletBalance: BigNumber;
}

const ISwapRouter = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_wethAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor",
        "name": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveOut",
                "type": "uint256"
            }
        ],
        "name": "getAmountIn",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveOut",
                "type": "uint256"
            }
        ],
        "name": "getAmountOut",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            }
        ],
        "name": "getAmountsIn",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            }
        ],
        "name": "getAmountsOut",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveB",
                "type": "uint256"
            }
        ],
        "name": "quote",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapETHForExactTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactETHForTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForETH",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountInMax",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapTokensForExactETH",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountInMax",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapTokensForExactTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

interface Allowance {
    token: `0x${string}`;
    user: `0x${string}`;
    spender: `0x${string}`;
    amount: BigNumber;
}

export const Allowance = (props: Allowance) => {
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

export const Approve = (props: Allowance) => {
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
        <div className="swap-summary-button-wrapper" >
            <Button text="Approve Swap" buttonSize="standard" buttonStyle="primary" onClick={() => write?.()} />
        </div>)
}

export const SwapETHForExactTokens = (props: SwapButtonProps) => {
    const { config, error, isSuccess, isLoading } = usePrepareContractWrite({
        address: props.swapRouterAddress as `0x${string}`,
        abi: ISwapRouter,
        functionName: "swapETHForExactTokens",
        args: [props.factory.address, props.path, props.tokenTwoInputValue, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        overrides: {
            from: props.walletOwner, value: props.amountInMax
        },
        onError(error) {
            console.log('swapETHForExactTokens Config Error', error)
        },
        onSuccess(data) {
            console.log('swapETHForExactTokens Config Success', data)
        },
    })

    const { data, write } = useContractWrite(config)

    /* const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            if (confirmedAmount === props.depositAmount) {
                props.setDepositSuccess(true)
            }
        },
        onError(error) {
            console.log('useWaitForTransaction Error', error)
        },
    }) */
    return (
        <div className="swap-summary-button-wrapper" >
            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" />
        </div>)
}

export const SwapExactETHForTokens = (props: SwapButtonProps) => {
    const { config, error, isSuccess, isLoading } = usePrepareContractWrite({
        address: props.swapRouterAddress as `0x${string}`,
        abi: ISwapRouter,
        functionName: "swapExactETHForTokens",
        args: [props.factory.address, props.path, props.amountOutMin, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        overrides: {
            from: props.walletOwner, value: props.tokenOneInputValue
        },
        onError(error) {
            console.log('swapExactETHForTokens Config Error', error)
        },
        onSuccess(data) {
            console.log('swapExactETHForTokens Config Success', data)
        },
    })

    const { data, write } = useContractWrite(config)

    /* const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            if (confirmedAmount === props.depositAmount) {
                props.setDepositSuccess(true)
            }
        },
        onError(error) {
            console.log('useWaitForTransaction Error', error)
        },
    }) */
    return (
        <div className="swap-summary-button-wrapper" >
            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" />
        </div>)
}

export const SwapExactTokensForETH = (props: SwapButtonProps) => {
    console.log(Number(props.tokenOneInputValue))
    console.log(Number(props.amountOutMin))

    const { config, error, isSuccess, isLoading } = usePrepareContractWrite({
        address: props.swapRouterAddress as `0x${string}`,
        abi: ISwapRouter,
        functionName: "swapExactTokensForETH",
        args: [props.factory.address, props.path, props.tokenOneInputValue, props.amountOutMin, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        onError(error) {
            console.log('swapExactTokensForETH Config Error', error)
        },
        onSuccess(data) {
            console.log('swapExactTokensForETH Config Success', data)
        },
    })

    const { data, write } = useContractWrite(config)

    /* const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            if (confirmedAmount === props.depositAmount) {
                props.setDepositSuccess(true)
            }
        },
        onError(error) {
            console.log('useWaitForTransaction Error', error)
        },
    }) */

    return (
        <div className="swap-summary-button-wrapper" >
            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" />
        </div>)
}

export const SwapExactTokensForTokens = (props: SwapButtonProps) => {
    console.log("SwapExactTokensForTokens")
    console.log(Number(props.tokenOneInputValue))
    console.log(Number(props.amountOutMin))

    const { config, error, isSuccess, isLoading } = usePrepareContractWrite({
        address: props.swapRouterAddress as `0x${string}`,
        abi: ISwapRouter,
        functionName: "swapExactTokensForTokens",
        args: [props.factory.address, props.path, props.tokenOneInputValue, props.amountOutMin, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        onError(error) {
            console.log('swapExactTokensForTokens Config Error', error)
        },
        onSuccess(data) {
            console.log('swapExactTokensForTokens Config Success', data)
        },
    })

    const { data, write } = useContractWrite(config)

    /* const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            if (confirmedAmount === props.depositAmount) {
                props.setDepositSuccess(true)
            }
        },
        onError(error) {
            console.log('useWaitForTransaction Error', error)
        },
    }) */

    return (
        <div className="swap-summary-button-wrapper" >
            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" />
        </div>)
}


export const SwapTokensForExactETH = (props: SwapButtonProps) => {
    console.log("SwapTokensForExactETH")
    console.log(Number(props.tokenOneInputValue))
    console.log(Number(props.amountOutMin))

    const { config, error, isSuccess, isLoading } = usePrepareContractWrite({
        address: props.swapRouterAddress as `0x${string}`,
        abi: ISwapRouter,
        functionName: "swapTokensForExactETH",
        args: [props.factory.address, props.path, props.tokenTwoInputValue, props.amountInMax, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        onError(error) {
            console.log('swapTokensForExactETH Config Error', error)
        },
        onSuccess(data) {
            console.log('swapTokensForExactETH Config Success', data)
        },
    })

    const { data, write } = useContractWrite(config)

    /* const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            if (confirmedAmount === props.depositAmount) {
                props.setDepositSuccess(true)
            }
        },
        onError(error) {
            console.log('useWaitForTransaction Error', error)
        },
    }) */

    return (
        <div className="swap-summary-button-wrapper" >
            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" />
        </div>)
}

export const SwapTokensForExactTokens = (props: SwapButtonProps) => {
    console.log("swapTokensForExactTokens")
    console.log(Number(props.tokenOneInputValue))
    console.log(Number(props.amountOutMin))

    const { config, error, isSuccess, isLoading } = usePrepareContractWrite({
        address: props.swapRouterAddress as `0x${string}`,
        abi: ISwapRouter,
        functionName: "swapTokensForExactTokens",
        args: [props.factory.address, props.path, props.tokenTwoInputValue, props.amountInMax, props.walletOwner, moment().unix() + (Number(props.deadline) * 60)],
        onError(error) {
            console.log('swapTokensForExactTokens Config Error', error)
        },
        onSuccess(data) {
            console.log('swapTokensForExactTokens Config Success', data)
        },
    })

    const { data, write } = useContractWrite(config)

    /* const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            if (confirmedAmount === props.depositAmount) {
                props.setDepositSuccess(true)
            }
        },
        onError(error) {
            console.log('useWaitForTransaction Error', error)
        },
    }) */

    return (
        <div className="swap-summary-button-wrapper" >
            <Button text="Confirm Swap" buttonSize="standard" buttonStyle="primary" />
        </div>)
}