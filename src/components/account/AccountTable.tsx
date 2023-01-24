import { useEffect, useState } from 'react'
import "./AccountTable.css"
import { useAccount, useBalance } from "wagmi"
import { AccountTableRow } from './AccountTableRow'
import { Button } from '../Buttons'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

interface DETFSummary {
    "productId": number;
    "category": string;
    "dimension": string;
    "marketValue": string;
    "return": string;
    "lockStatus": string;
}

type Currencies = {
    "date": string;
    "aud": number;
    "bnb": number;
    "cny": number;
    "eur": number;
    "idr": number;
    "jpy": number;
    "krw": number;
    "rub": number;
    "twd": number;
    "usd": number;
}

interface AccountTableProps {
    detfAccounts: Array<string>;
    detfAccountsSuccess: boolean;
    detfAccountsData: Array<any>;
    vsPrices: any;
    currency: string;
    historicalPrices: Array<any>;
    currentPrices: Currencies | undefined;
}

export const AccountTable = (props: AccountTableProps) => {
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { data: walletBalance } = useBalance({
        addressOrName: walletOwner,
    })
    const detfAccounts: Array<string> = props.detfAccounts
    const detfAccountsData: Array<any> = props.detfAccountsData
    const [activeSort, setActiveSort] = useState("")
    const [detfData, setDETFData] = useState<Array<any>>(detfAccountsData)
    useEffect(() => {
        if (detfData.length !== detfAccountsData.length) {
            setDETFData(((detfData) => detfAccountsData))
        }
    }, [detfAccounts, detfAccountsData])

    const [order, setOrder] = useState("asc")
    const sorting = (column: any) => {
        if (order === "asc") {
            const sorted = [...detfData].sort((a, b) =>
                a[column as keyof DETFSummary] > b[column as keyof DETFSummary] ? 1 : -1)
            setDETFData(sorted)
            console.log(sorted)
            setOrder("dsc")
        }
        if (order === "dsc") {
            const sorted = [...detfData].sort((a, b) =>
                a[column as keyof DETFSummary] < b[column as keyof DETFSummary] ? 1 : -1)
            setDETFData(sorted)
            setOrder("asc")
        }
    }

    if (detfAccounts.length > 0) {
        return (
            <>
                <div className="account-detf-container">
                    <div className="account-detf-title">
                        <h1>Your portfolio</h1>
                    </div>
                    <div className="account-detf-header">
                        <div className="account-detf-header-item-detf" onClick={() => { sorting("category"); setActiveSort("category") }}>DETF&nbsp;
                            {activeSort === "category" && order === "asc" && <FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} />}
                            {activeSort === "category" && order === "dsc" && <FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} />}</div>
                        <div className="account-detf-header-item-value" onClick={() => { sorting("marketValue"); setActiveSort("marketValue") }}>Market Value&nbsp;
                            {activeSort === "marketValue" && order === "asc" && <FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} />}
                            {activeSort === "marketValue" && order === "dsc" && <FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} />}</div>
                        <div className="account-detf-header-item-return" onClick={() => { sorting("return"); setActiveSort("return") }}>Return&nbsp;
                            {activeSort === "return" && order === "asc" && <FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} />}
                            {activeSort === "return" && order === "dsc" && <FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} />}</div>
                        <div className="account-detf-header-item-timelock" onClick={() => { sorting("lockStatus"); setActiveSort("lockStatus") }}>Status&nbsp;
                            {activeSort === "lockStatus" && order === "asc" && <FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} />}
                            {activeSort === "lockStatus" && order === "dsc" && <FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} />}</div>
                        <div className="account-detf-header-item-deposit"></div>
                        <div className="account-detf-header-item-toggle"></div>
                    </div>
                    <div>
                        {detfData.length > 0 ? detfData.map((data) =>
                            <div key={data.detf_address}>
                                <AccountTableRow
                                    category={data.category}
                                    dimension={data.dimension}
                                    status={data.status}
                                    balance_in_weth={data.balance_in_weth}
                                    final_balance_in_weth={data.final_balance_in_weth}
                                    return_weth={data.return_weth}
                                    return_percentage={data.return_percentage}
                                    final_return_percentage={data.final_return_percentage}
                                    timeLockRemaining={data.time_lock_remaining}
                                    timeLock={data.time_lock}
                                    product_id={data.product_id}
                                    detf_address={data.detf_address}
                                    deposits={data.deposits}
                                    fees={data.fees}
                                    transactions={data.transactions}
                                    total_deposits={data.total_deposits}
                                    vsPrices={props.vsPrices}
                                    currency={props.currency}
                                    close_timestamp={data.close_timestamp}
                                    creation_timestamp={data.creation_timestamp}
                                    final_return={data.final_return}
                                    final_return_weth={data.final_return_weth}
                                    isPlaceholder={false}
                                    historicalPrices={props.historicalPrices}
                                    currentPrices={props.currentPrices}
                                />
                            </div>) :
                            <div>
                                <div className="account-detf-row">
                                    <div className="account-detf-row-items">
                                    </div>
                                </div>
                                <div className="account-detf-row">
                                    <div className="account-detf-row-items">
                                    </div>
                                </div>
                                <div className="account-detf-row">
                                    <div className="account-detf-row-items">
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </>
        )
    }
    if (props.detfAccountsSuccess && detfAccounts.length === 0) {
        return (
            <><div className="account-detf-container">
                <div className="account-detf-title">
                    <h1>Your portfolio</h1>
                </div>
                <div className="account-detf-container-placeholder">
                    {/* <img src={require("../../assets/images/account_table_row_placeholder.png")}></img> */}
                    <div className="account-detf-container-placeholder-overlay">
                    </div>
                    <div className="account-detf-container-placeholder-overlay-info">
                        Ready to invest in your own Decentralized Exchange Traded Funds?
                        <div><br /></div>
                        <Link to="/detfs"><Button text="Explore Polybit DETFs" buttonStyle="primary" buttonSize="standard" /></Link>
                    </div>
                </div>
            </div>
            </>
        )
    }
    return (
        <div className="account-detf-container">
            <div className="account-detf-title">
                <h1>Your portfolio</h1>
            </div>
            <div>
                <div className="account-detf-header">
                    <div className="account-detf-header-item-detf" >DETF</div>
                    <div className="account-detf-header-item-value" >Market Value</div>
                    <div className="account-detf-header-item-return" >Return</div>
                    <div className="account-detf-header-item-timelock" >Status</div>
                    <div className="account-detf-header-item-deposit"></div>
                    <div className="account-detf-header-item-toggle"></div>
                </div>
            </div>
            <div>
                <div className="account-detf-row">
                    <div className="account-detf-row-items">
                    </div>
                </div>
                <div className="account-detf-row">
                    <div className="account-detf-row-items">
                    </div>
                </div>
                <div className="account-detf-row">
                    <div className="account-detf-row-items">
                    </div>
                </div>
            </div>
        </div>)
}

export default AccountTable