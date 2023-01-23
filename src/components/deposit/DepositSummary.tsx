import { useState, useEffect } from 'react'
import "../pages/Deposit.css"
import PolybitDETFInterface from "../../chain_info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'

import {
    useAccount,
    useNetwork,
    useBalance,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction
} from "wagmi"
import { GetOrderData } from '../api/GetOrderData'
import { FormatCurrency } from '../utils/Currency'
import ContentBox from '../containers/ContentBox'
import { Button, TextLink } from '../Buttons'
import MainContainer from '../containers/Main'
import { Loading } from '../Loading'

interface DepositSummary {
    detfAddress: string;
    category: string;
    dimension: string;
    timeLock: number;
    walletBalance: any;
    connector: any;
    vsPrices: any;
    currency: string;
    depositAmount: string;
    timeLockAmount: number;
    setShowDepositDetails: Function;
    setDepositSuccess: Function;
    setActiveStage: Function;
    activeStage: string;
}

export const DepositSummary = (props: DepositSummary) => {
    const ethers = require("ethers")
    const utils = ethers.utils
    const moment = require('moment')
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain } = useNetwork()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })

    const [orderData, setOrderData] = useState<Array<any>>();
    const { response: detfOrderData, isLoading: orderDataLoading, isSuccess: orderDataSuccess } = GetOrderData(props.detfAddress, props.depositAmount)

    useEffect(() => {
        setOrderData(detfOrderData ? detfOrderData : [])
    }, [detfOrderData, orderDataSuccess])

    const PrettyTimeLockValue = () => {
        // Set lock value for the first time
        if (props.timeLock === 0 && props.timeLockAmount > 0) {
            return moment.unix(props.timeLockAmount).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }

        //Increase the lock value
        if (props.timeLock > 0 && props.timeLockAmount > 0) {
            return moment.unix(props.timeLockAmount).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }

        //Return the existing lock value
        if (props.timeLock > 0 && props.timeLockAmount === 0) {
            return moment.unix(props.timeLock).format("hh:mm a [on the] Do [of] MMMM[,] YYYY")
        }
        return "No time lock set"
    }

    let prettyTimeLockValue = PrettyTimeLockValue()

    const { config: detfDepositConfig, error: detfDepositError, isSuccess: prepareContractWriteSuccess, isLoading: prepareContractWriteLoading } = usePrepareContractWrite({
        addressOrName: props.detfAddress,
        contractInterface: IPolybitDETF,
        functionName: 'deposit',
        args: [props.timeLockAmount === props.timeLock ? 0 : props.timeLockAmount, orderData],
        overrides: { from: walletOwner, value: props.depositAmount },
        onError(error) {
            console.log('detfDepositConfig Error', error)
        },
        onSuccess(data) {
            console.log('detfDepositConfig Success', data)
        },
    })

    const { data, isLoading: contractWriteLoading, isSuccess, write: detfDeposit } = useContractWrite(detfDepositConfig)

    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            const response = data ? data.logs[2].data : []
            const confirmedAmount = utils.defaultAbiCoder.decode(["uint256"], response)[0].toString()
            if (confirmedAmount === props.depositAmount) {
                props.setDepositSuccess(true)
            }
        }
    })

    const depositAmountFormatted = parseFloat((Number(props.depositAmount) / 10 ** 18).toString()).toFixed(4)
    const depositAmountCurrency = FormatCurrency(props.depositAmount ?
        (Number(props.depositAmount)
            / 10 ** 18 *
            (() => {
                switch (props.currency) {
                    case "AUD": return (props.vsPrices.aud)
                    case "BNB": return (props.vsPrices.bnb)
                    case "CNY": return (props.vsPrices.cny)
                    case "EURO": return (props.vsPrices.eur)
                    case "IDR": return (props.vsPrices.idr)
                    case "JPY": return (props.vsPrices.jpy)
                    case "KRW": return (props.vsPrices.krw)
                    case "RUB": return (props.vsPrices.rub)
                    case "TWD": return (props.vsPrices.twd)
                    case "USD": return (props.vsPrices.usd)
                }
            })()) : 0, 2)

    if (!prepareContractWriteSuccess) {
        return (
            <Loading loadingMsg="Preparing your deposit" />
        )
    }

    if (!transactionLoading && prepareContractWriteSuccess) {
        return (
            <MainContainer>
                <ContentBox >
                    <div className="deposit-summary">
                        <p>Dessert cheesecake gummi bears dessert caramels chocolate cake. Powder wafer brownie apple pie carrot cake wafer ice cream dragée powder. Soufflé lemon drops tiramisu halvah cheesecake. Cheesecake pastry cake dragée dessert. Pie macaroon marshmallow cotton candy dragée bear claw powder. Chocolate sweet topping cheesecake candy tootsie roll topping. Halvah liquorice danish cupcake tootsie roll. </p>
                        <div className="deposit-summary-info">
                            <div className="deposit-summary-info-bar"></div>
                            <div className="deposit-summary-info-titles">
                                <ul>
                                    <li>Category</li>
                                    <li>Dimension</li>
                                    <li>Blockchain</li>
                                    <li>Investment</li>
                                    <li>Deposit Fee</li>
                                    <li>Time Locked</li>
                                    <li>Your Wallet Address</li>
                                </ul>
                            </div>
                            <div className="deposit-summary-info-results">
                                <ul>
                                    <li>{props.category}</li>
                                    <li>{props.dimension}</li>
                                    <li>{chain?.name}</li>
                                    <li>{`${walletBalance?.symbol} ${depositAmountFormatted} (${depositAmountCurrency})`}</li>
                                    <li>0.5%</li>
                                    <li>{prettyTimeLockValue}</li>
                                    <li>{walletOwner}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="deposit-button-wrapper">
                            {!contractWriteLoading && !transactionLoading && orderDataSuccess && <Button buttonStyle="primary" buttonSize="standard" text="Finalize and commit funds" onClick={() => detfDeposit?.()} />}
                            {contractWriteLoading && !transactionLoading && <Button buttonStyle="primary" buttonSize="standard" text="Finalize and commit funds" status="loading" loadingMsg={`waiting for ${connector?.name}`} />}
                        </div>
                        <TextLink to="" text="Make changes to investment setup" arrowDirection="back" onClick={() => { props.setShowDepositDetails(true); props.setActiveStage(props.activeStage === "establish-deposit-summary" ? "establish-deposit-details" : "deposit-details") }} />
                    </div>
                </ContentBox >
            </MainContainer>
        )
    }

    if (transactionLoading) {
        return (
            <Loading loadingMsg="Sending transaction to the blockchain" />
        )
    }

    return (
        <Loading />
    )
}