import React, { useEffect, useState } from 'react'
import "./AccountTable.css"
import { Interface } from 'ethers/lib/utils'
import map from "../chain-info/map.json"
import { BigNumber } from 'ethers'
import { getNumValueColor } from '../utils'
import Moment from 'react-moment';
import PolybitDETFFactoryInterface from "../chain-info/IPolybitDETFFactory.json"
import PolybitDETFInterface from "../chain-info/IPolybitDETF.json"
import PolybitDETFOracleInterface from "../chain-info/IPolybitDETFOracle.json"
import { Link } from 'react-router-dom'
import Deposit from './pages/Deposit'
import {
    useAccount,
    useBalance,
    useContractRead,
} from "wagmi"

interface DETFSummary {
    "detfId": number;
    "detfName": string;
    "marketValue": string;
    "return": string;
    "lockStatus": string;
}

export const AccountTable = () => {

    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })
    const detfFactoryAddress: Array<string> = map["5777"]["detf_factory"]
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const IPolybitDETFOracle = new Interface(PolybitDETFOracleInterface)

    function GetListOfOwnedDETFs() {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfFactoryAddress[0],
            contractInterface: IPolybitDETFFactory,
            functionName: "getDETFAccounts",
            args: [walletOwner]
        })
        return data
    }

    function GetDETFAccountData() {
        let detfs = GetListOfOwnedDETFs()
        let detfAccounts: Array<any> = []
        {
            detfs?.map((index =>
                detfAccounts.push({
                    "detfId": index,
                    "detfName": GetNameOfDETF(String(index)).toString(),
                    "marketValue": `${walletBalance?.symbol} ${parseFloat((Number(GetBalanceOfDETF(index)) / 10 ** 18).toString()).toFixed(4)}`,
                    "return": GetTotalReturnPercentageOfDETF(index),
                    "lockStatus": GetTimeToUnlock(Number(GetLockTimeLeftOfDETF(index)))
                })
            ))
        }
        return detfAccounts
    }

    const [detfData, setDETFData] = useState(GetDETFAccountData())
    const [order, setOrder] = useState("asc")
    const sorting = (column: any) => {
        if (order === "asc") {
            const sorted = [...detfData].sort((a, b) =>
                a[column as keyof DETFSummary] > b[column as keyof DETFSummary] ? 1 : -1)
            setDETFData(sorted)
            setOrder("dsc")
        }
        if (order === "dsc") {
            const sorted = [...detfData].sort((a, b) =>
                a[column as keyof DETFSummary] < b[column as keyof DETFSummary] ? 1 : -1)
            setDETFData(sorted)
            setOrder("asc")
        }
    }

    function GetDETFOracleAddress(_address: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: _address,
            contractInterface: IPolybitDETF,
            functionName: "getDETFOracleAddress"
        })
        const oracleAddress = data ? data : ""
        return oracleAddress
    }

    function GetNameOfDETF(detfAddress: string) {
        const oracleAddress = GetDETFOracleAddress(detfAddress).toString()
        const { data: detfName, isError, isLoading } = useContractRead({
            addressOrName: oracleAddress,
            contractInterface: IPolybitDETFOracle,
            functionName: "getDetfName",
        })
        const name = detfName ? detfName : ""
        return name

    }

    function GetBalanceOfDETF(detfAddress: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTotalBalanceInWeth"
        })
        const balance = data ? data : 0
        return balance
    }

    function GetDepositedOfDETF(detfAddress: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTotalDeposited"
        })
        const deposited = data ? data : 0
        return deposited
    }

    function GetTotalReturnPercentageOfDETF(detfAddress: string) {
        const totalDeposited = Number(GetDepositedOfDETF(detfAddress))
        const totalBalanceInWeth = Number(GetBalanceOfDETF(detfAddress))
        const totalReturnPercentage = (totalBalanceInWeth - totalDeposited) / totalDeposited
        return totalReturnPercentage
    }

    function GetLockTimeLeftOfDETF(detfAddress: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfAddress,
            contractInterface: IPolybitDETF,
            functionName: "getTimeLockRemaining"
        })
        const lockTimeRemaining = data ? data : 0
        return lockTimeRemaining
    }

    function GetTimeToUnlock(timeToUnlock: number) {
        if (timeToUnlock > 0) {
            const moment = require('moment');
            let now = moment().unix()
            let lockedUntil = moment.unix(now + timeToUnlock).local().format("D MMM YYYY hh:mm")
            return <div style={{ color: "#909090" }}>Locked until {lockedUntil}</div>
        }
        return "Unlocked"
    }

    return (
        <>
            <div className="account-detf-container">
                <div className="account-detf-header">
                    <div className="account-detf-header-item" onClick={() => sorting("detfName")}>Strategy</div>
                    <div className="account-detf-header-item" onClick={() => sorting("marketValue")}>Market Value</div>
                    <div className="account-detf-header-item" onClick={() => sorting("return")}>Return</div>
                    <div className="account-detf-header-item" onClick={() => sorting("lockStatus")}>Time Lock</div>
                    <div className="account-detf-header-item"></div>
                </div>
                <div>
                    {detfData.length > 0 ? detfData.map((index) =>
                        <div className="account-detf-row-items" key={index.detfId}>
                            <div className="account-detf-row-item"><img className="chain-logo" src={require("../assets/images/binance-icon-circle.png")} alt="Binance Smart Chain"></img>{index.detfName}</div>
                            <div className="account-detf-row-item">{index.marketValue}</div>
                            <div className="account-detf-row-item" style={{ color: getNumValueColor(index.return) }}> {parseFloat((index.return).toString()).toFixed(5) + "%"}</div>
                            <div className="account-detf-row-item">{index.lockStatus}</div>
                            <div className="account-detf-row-item">
                                <Link className="account-detf-row-item-link" to="/deposit" state={{ detfName: index.detfName, detfAddress: index.detfId, processOrigin: "deposit", activeStage: 1 }}><u>Deposit</u></Link>
                            </div>
                        </div>) :
                        <div>
                            <div className="account-detf-row-items">
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none"></div>
                            </div>
                            <div className="account-detf-row-items">
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none"></div>
                            </div>
                            <div className="account-detf-row-items">
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none"></div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default AccountTable