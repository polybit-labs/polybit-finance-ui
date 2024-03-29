import { useEffect, useState } from 'react'
import "./AccountTable.css"
import { AccountTableRow } from './AccountTableRow'
import { Button } from '../../../../components/Buttons/Buttons'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { AccountTablePlaceholder } from './AccountTablePlaceholder'
import { GetAccountDataAll, AccountData, AccountDataAll } from '../../../../components/api/GetAccountDataAll'

type DETFSummary = {
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

type AccountTableProps = {
    walletOwner: `0x${string}`;
    vsPrices: any;
    currency: string;
    historicalPrices: Array<any>;
    currentPrices: Currencies | undefined;
    setTotalInvestmentThemeValue: Function;
    setTotalInvestmentThemeReturn: Function;
}

export const AccountTable = (props: AccountTableProps) => {
    const [accountsData, setaccountsData] = useState<Array<AccountData>>()
    const { response: accountsListData, isLoading: accountsDataLoading, isSuccess: accountsDataSuccess } = GetAccountDataAll(props.walletOwner ? props.walletOwner : "")
    useEffect(() => {
        accountsListData && accountsDataSuccess && setaccountsData(accountsListData.account_data)
        props.setTotalInvestmentThemeValue(accountsListData?.total_current_value)
        props.setTotalInvestmentThemeReturn(accountsListData?.total_current_return)
    }, [accountsDataSuccess])

    const [activeSort, setActiveSort] = useState("")
    const [detfData, setDETFData] = useState<Array<any>>(accountsData ? accountsData : [])
    useEffect(() => {
        if (accountsData &&
            detfData.length !== accountsData.length) {
            setDETFData(((detfData) => accountsData))
        }
    }, [accountsData])

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

    if (accountsData && accountsData.length > 0) {
        return (
            <>
                <div className="account-detf-container">
                    <div className="account-detf-title">
                        <h1>Investment Themes</h1>
                    </div>
                    <div className="account-detf-header">
                        <div className="account-detf-header-item-detf" onClick={() => { sorting("category"); setActiveSort("category") }}>DETF&nbsp;
                            {activeSort !== "category" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "category" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "category" && order === "dsc" && <div style={{ transform: "translateY(-12%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="account-detf-header-item-value" onClick={() => { sorting("marketValue"); setActiveSort("marketValue") }}>Value&nbsp;
                            {activeSort !== "marketValue" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "marketValue" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "marketValue" && order === "dsc" && <div style={{ transform: "translateY(-12%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="account-detf-header-item-return" onClick={() => { sorting("return"); setActiveSort("return") }}>Return&nbsp;
                            {activeSort !== "return" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "return" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "return" && order === "dsc" && <div style={{ transform: "translateY(-12%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="account-detf-header-item-status" onClick={() => { sorting("lockStatus"); setActiveSort("lockStatus") }}>Status&nbsp;
                            {activeSort !== "lockStatus" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "lockStatus" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "lockStatus" && order === "dsc" && <div style={{ transform: "translateY(-12%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="account-detf-header-item-deposit"></div>
                        <div className="account-detf-header-item-toggle"></div>
                    </div>
                    <div className="account-detf-header-mobile">
                        <div className="account-detf-header-item-detf-mobile" onClick={() => { sorting("category"); setActiveSort("category") }}>DETF&nbsp;
                            {activeSort !== "category" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "category" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "category" && order === "dsc" && <div style={{ transform: "translateY(-12%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="account-detf-header-item-value-mobile" onClick={() => { sorting("marketValue"); setActiveSort("marketValue") }}>Value&nbsp;
                            {activeSort !== "marketValue" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "marketValue" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "marketValue" && order === "dsc" && <div style={{ transform: "translateY(-12%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="account-detf-header-item-return-mobile" onClick={() => { sorting("return"); setActiveSort("return") }}>Return&nbsp;
                            {activeSort !== "return" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "return" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "return" && order === "dsc" && <div style={{ transform: "translateY(-12%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                        <div className="account-detf-header-item-status-mobile" onClick={() => { sorting("lockStatus"); setActiveSort("lockStatus") }}>Status&nbsp;
                            {activeSort !== "lockStatus" && <div style={{ transform: "translateY(+18%)", fontSize: "20px", color: "#e3e3e3" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "lockStatus" && order === "asc" && <div style={{ transform: "translateY(+18%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>}
                            {activeSort === "lockStatus" && order === "dsc" && <div style={{ transform: "translateY(-12%)", fontSize: "20px" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
                        </div>
                    </div>
                    <div>
                        {detfData.length > 0 ? detfData.map((data) =>
                            <div key={data.detf_address}>
                                <AccountTableRow
                                    walletOwner={props.walletOwner}
                                    theme_contract_address={data.theme_contract_address}
                                    status={data.status}
                                    creation_timestamp={data.creation_timestamp}
                                    category={data.category}
                                    dimension={data.dimension}
                                    balance_in_weth={data.balance_in_weth}
                                    deposits={data.deposits}
                                    total_deposited={data.total_deposited}
                                    fees_paid={data.fees_paid}
                                    transactions={data.transactions}
                                    owned_assets={data.owned_assets}
                                    owned_assets_prices={data.owned_assets_prices}
                                    owned_assets_table_data={data.owned_assets_table_data}
                                    time_lock={data.time_lock}
                                    time_lock_remaining={data.time_lock_remaining}
                                    close_timestamp={data.close_timestamp}
                                    final_balance_in_weth={data.final_balance_in_weth}
                                    final_assets={data.final_assets}
                                    final_assets_prices={data.final_assets_prices}
                                    final_assets_balances={data.final_assets_balances}
                                    final_assets_balances_in_weth={data.final_assets_balances_in_weth}
                                    final_assets_table_data={data.final_assets_table_data}
                                    total_purchase_value_currency_adjusted={data.total_purchase_value_currency_adjusted}
                                    total_current_value_currency_adjusted={data.total_current_value_currency_adjusted}
                                    total_current_return_currency_adjusted={data.total_current_return_currency_adjusted}
                                    total_final_value_currency_adjusted={data.total_final_value_currency_adjusted}
                                    total_final_return_currency_adjusted={data.total_final_return_currency_adjusted}
                                    vsPrices={props.vsPrices}
                                    currency={props.currency}
                                    historicalPrices={props.historicalPrices}
                                    currentPrices={props.currentPrices}
                                />
                            </div>) :
                            <div>
                                <div className="account-table-row">
                                    <div className="account-table-row-items">
                                    </div>
                                </div>
                                <div className="account-table-row">
                                    <div className="account-table-row-items">
                                    </div>
                                </div>
                                <div className="account-table-row">
                                    <div className="account-table-row-items">
                                    </div>
                                </div>
                                <div className="account-table-row-mobile">
                                    <div className="account-table-row-items-mobile">
                                    </div>
                                </div>
                                <div className="account-table-row-mobile">
                                    <div className="account-table-row-items-mobile">
                                    </div>
                                </div>
                                <div className="account-table-row-mobile">
                                    <div className="account-table-row-items-mobile">
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </>
        )
    }
    if (accountsDataSuccess && accountsData && accountsData.length === 0) {
        return (
            <AccountTablePlaceholder />
        )
    }
    return (
        <div className="account-detf-container">
            <div className="account-detf-title">
                <h1>Investment Themes</h1>
            </div>
            <div>
                <div className="account-detf-header">
                    <div className="account-detf-header-item-detf" >DETF</div>
                    <div className="account-detf-header-item-value" >Value</div>
                    <div className="account-detf-header-item-return" >Return</div>
                    <div className="account-detf-header-item-status" >Status</div>
                    <div className="account-detf-header-item-deposit"></div>
                    <div className="account-detf-header-item-toggle"></div>
                </div>
                <div className="account-detf-header-mobile">
                    <div className="account-detf-header-item-detf-mobile" >DETF</div>
                    <div className="account-detf-header-item-value-mobile" >Value</div>
                    <div className="account-detf-header-item-return-mobile" >Return</div>
                    <div className="account-detf-header-item-status-mobile" >Status</div>
                </div>
            </div>
            <div>
                <div className="account-table-row">
                    <div className="account-table-row-items">
                    </div>
                </div>
                <div className="account-table-row">
                    <div className="account-table-row-items">
                    </div>
                </div>
                <div className="account-table-row">
                    <div className="account-table-row-items">
                    </div>
                </div>
                <div className="account-table-row-mobile">
                    <div className="account-table-row-items-mobile">
                    </div>
                </div>
                <div className="account-table-row-mobile">
                    <div className="account-table-row-items-mobile">
                    </div>
                </div>
                <div className="account-table-row-mobile">
                    <div className="account-table-row-items-mobile">
                    </div>
                </div>
            </div>
        </div>)
}

export default AccountTable