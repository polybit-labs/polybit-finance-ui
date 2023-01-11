import { useEffect, useState } from 'react'
import "./AccountTable.css"
import { useAccount, useBalance } from "wagmi"
import { AccountTableRow } from './AccountTableRow'
import { Button } from '../Button';

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
                    <div className="account-detf-header">
                        <div className="account-detf-header-item-detf" onClick={() => sorting("category")}>DETF</div>
                        <div className="account-detf-header-item-value" onClick={() => sorting("marketValue")}>Market Value</div>
                        <div className="account-detf-header-item-return" onClick={() => sorting("return")}>Return</div>
                        <div className="account-detf-header-item-timelock" onClick={() => sorting("lockStatus")}>Status</div>
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
                                <div className="account-detf-row-loading">
                                    <img height="90px" width="90px" src={require("../../assets/images/loading.gif")} alt="Loading"></img>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </>
        )
    }
    if (detfAccounts.length === 0) {
        return (
            <>
                <div className="account-detf-container-placeholder">
                    <div>
                        {/* <AccountTableRow
                            category="Metaverse"
                            dimension="Market Cap"
                            status={1}
                            balance_in_weth={"0"}
                            final_balance_in_weth={"0"}
                            return_weth={"0"}
                            return_percentage={0}
                            final_return_percentage={0}
                            timeLockRemaining={0}
                            timeLock={0}
                            product_id={"5610021000"}
                            detf_address={""}
                            deposits={[]}
                            total_deposits={"0"}
                            vsPrices={props.vsPrices}
                            currency={props.currency}
                            close_timestamp={0}
                            creation_timestamp={1671494993}
                            final_return={{
                                "date": "0",
                                "aud": 0,
                                "bnb": 0,
                                "cny": 0,
                                "eur": 0,
                                "idr": 0,
                                "jpy": 0,
                                "krw": 0,
                                "rub": 0,
                                "twd": 0,
                                "usd": 0
                            }}
                            final_return_weth={"0"}
                            isPlaceholder={true}
                        />
                        <AccountTableRow
                            category="Governance"
                            dimension="DEX Liquidity"
                            status={0}
                            balance_in_weth={"0"}
                            final_balance_in_weth={"0"}
                            return_weth={"0"}
                            return_percentage={0}
                            final_return_percentage={56.78}
                            timeLockRemaining={0}
                            timeLock={0}
                            product_id={"5610021000"}
                            detf_address={""}
                            deposits={[]}
                            total_deposits={"0"}
                            vsPrices={props.vsPrices}
                            currency={props.currency}
                            close_timestamp={0}
                            creation_timestamp={1671494993}
                            final_return={{
                                "date": "0",
                                "aud": 0,
                                "bnb": 0,
                                "cny": 0,
                                "eur": 0,
                                "idr": 0,
                                "jpy": 0,
                                "krw": 0,
                                "rub": 0,
                                "twd": 0,
                                "usd": 0
                            }}
                            final_return_weth={"0"}
                            isPlaceholder={false}
                        />
                        <AccountTableRow
                            category="BSC Index Top 10"
                            dimension="Equally Balanced"
                            status={0}
                            balance_in_weth={"0"}
                            final_balance_in_weth={"0"}
                            return_weth={"0"}
                            return_percentage={0}
                            final_return_percentage={43.12}
                            timeLockRemaining={0}
                            timeLock={0}
                            product_id={"5610021000"}
                            detf_address={""}
                            deposits={[]}
                            total_deposits={"0"}
                            vsPrices={props.vsPrices}
                            currency={props.currency}
                            close_timestamp={0}
                            creation_timestamp={1671494993}
                            final_return={{
                                "date": "0",
                                "aud": 0,
                                "bnb": 0,
                                "cny": 0,
                                "eur": 0,
                                "idr": 0,
                                "jpy": 0,
                                "krw": 0,
                                "rub": 0,
                                "twd": 0,
                                "usd": 0
                            }}
                            final_return_weth={"0"}
                            isPlaceholder={false}
                        /> */}
                    </div>
                    <div className="account-detf-container-placeholder-overlay">

                    </div>
                    <div className="account-detf-container-placeholder-overlay-info">
                        Ready to invest in your own Decentralized Exchange Traded Funds?
                        <div><br /></div>
                        <Button text="Explore Polybit DETFs" type="button" buttonStyle="primary" />
                    </div>
                </div>
            </>
        )
    }
    return (<></>)
}

export default AccountTable