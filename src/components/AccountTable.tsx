import { useState } from 'react'
import "./AccountTable.css"
import { getNumValueColor } from '../utils'
import { Link } from 'react-router-dom'
import { GetProductCategory, GetProductDimension, GetOwnedAssets, GetOwnedAssetsPrices, GetProductId, GetTimeLockRemaining, GetTotalBalanceInWeth, GetTotalDeposited, GetTimeToUnlock, GetTotalReturnPercentageOfDETF } from './utils/DETFUtils'
import {
    useAccount,
    useBalance
} from "wagmi"
import { Rebalancer } from './Rebalancer'

interface DETFSummary {
    "productId": number;
    "category": string;
    "dimension": string;
    "marketValue": string;
    "return": string;
    "lockStatus": string;
}

export const AccountTable = (props: any) => {
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })

    const GetDETFAccountData = () => {
        const ownedDETFs: Array<string> = props.data
        let detfAccounts: Array<any> = []

        ownedDETFs?.map(((detfAddress, index) =>
            detfAccounts.push({
                "detfAddress": detfAddress,
                "productId": GetProductId(detfAddress),
                "category": GetProductCategory(detfAddress),
                "dimension": GetProductDimension(detfAddress),
                "marketValue": `${walletBalance?.symbol} ${parseFloat((Number(GetTotalBalanceInWeth(detfAddress, GetOwnedAssetsPrices(GetOwnedAssets(detfAddress)))) / 10 ** 18).toString()).toFixed(4)}`,
                "return": GetTotalReturnPercentageOfDETF(detfAddress),
                "lockStatus": GetTimeToUnlock(Number(GetTimeLockRemaining(detfAddress)))
            })
        ))
        return detfAccounts
    }

    const [detfData, setDETFData] = useState<Array<any>>(GetDETFAccountData())

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

    console.log(detfData)

    return (
        <>
            <div className="account-detf-container">
                <div className="account-detf-header">
                    <div className="account-detf-header-item" onClick={() => sorting("category")}>DETF</div>
                    <div className="account-detf-header-item" onClick={() => sorting("marketValue")}>Market Value</div>
                    <div className="account-detf-header-item" onClick={() => sorting("return")}>Return</div>
                    <div className="account-detf-header-item" onClick={() => sorting("lockStatus")}>Time Lock</div>
                    <div className="account-detf-header-item"></div>
                </div>
                <div>
                    {detfData.length > 0 ? detfData.map((data) =>
                        <div className="account-detf-row-items" key={data.detfAddress}>
                            <div className="account-detf-row-item">
                                <div className="account-index-row-item-name">
                                    {data.category}
                                    <div className="account-index-chain-title">
                                        {/* <img className="account-index-chain-logo" src={require("../assets/images/bsc-logo.png")} alt="Binance Smart Chain"></img> */}
                                        {data.dimension}
                                    </div>
                                </div>
                            </div>
                            <div className="account-detf-row-item">{data.marketValue}</div>
                            <div className="account-detf-row-item" style={{ color: getNumValueColor(data.return) }}> {parseFloat((data.return).toString()).toFixed(2) + "%"}</div>
                            <div className="account-detf-row-item">{data.lockStatus}</div>
                            <div className="account-detf-row-item">
                                <Link className="account-detf-row-item-link" to="/deposit" state={{ category: data.category, dimension: data.dimension, productId: data.productId, detfAddress: data.detfAddress, processOrigin: "deposit", activeStage: 1 }}><u>Deposit</u></Link>
                                {/* <Rebalancer detfAddress={data.detfAddress} /> */}
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