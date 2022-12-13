import { useEffect, useState } from 'react'
import "./AccountTable.css"
import { useAccount, useBalance } from "wagmi"
import { AccountTableRow } from './AccountTableRow'

interface DETFSummary {
    "productId": number;
    "category": string;
    "dimension": string;
    "marketValue": string;
    "return": string;
    "lockStatus": string;
}

interface AccountTableProps {
    detfAccounts: Array<string>;
    detfAccountsData: Array<any>;
    vsPrices: any;
    currency: string;
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
    console.log(detfData)


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


    return (
        <>
            <div className="account-detf-container">
                <div className="account-detf-header">
                    <div className="account-detf-header-item-detf" onClick={() => sorting("category")}>DETF</div>
                    <div className="account-detf-header-item-value" onClick={() => sorting("marketValue")}>Market Value</div>
                    <div className="account-detf-header-item-return" onClick={() => sorting("return")}>Return</div>
                    <div className="account-detf-header-item-timelock" onClick={() => sorting("lockStatus")}>Time Lock</div>
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
                                return_percentage={data.return_percentage}
                                final_return_percentage={data.final_return_percentage}
                                lockStatus={data.time_lock_remaining}
                                product_id={data.product_id}
                                detf_address={data.detf_address}
                                deposits={data.deposits}
                                total_deposits={data.total_deposits}
                                vsPrices={props.vsPrices}
                                currency={props.currency} />
                        </div>) :
                        <div>
                            <div className="account-detf-row-loading">
                                <img height="90px" width="90px" src={require("../assets/images/loading.gif")} alt="Loading"></img>
                            </div>
                            {/* <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none">-</div>
                                <div className="account-detf-row-item-none"></div> */}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default AccountTable