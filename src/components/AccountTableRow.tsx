import { Link } from "react-router-dom"
import { ColourNumbers } from "./utils/Formatting"
import { GetTimeToUnlock } from "./utils/TimeLock"
import "./AccountTableRow.css"
import { useState } from "react";
import { GetOwnedAssetsDetailed } from "./api/GetOwnedAssetsDetailed";
import { DETFOwnedAssetsTable } from "./DETFOwnedAssetsTable";
import { FormatCurrency } from "./utils/Currency";
import BTC from "../product/detfs/BTC-USD.json"
import { ReturnChartMarketValue } from "./ReturnChartMarketValue";
import { GetOwner } from "./api/GetOwner";


interface AccountTableRowItems {
    category: string;
    dimension: string;
    status: number;
    balance_in_weth: string;
    final_balance_in_weth: string;
    return_percentage: number;
    final_return_percentage: number;
    lockStatus: string;
    product_id: string;
    detf_address: string;
    deposits: Array<string>;
    total_deposits: string;
    vsPrices: any;
    currency: string;
}

export const AccountTableRow = (props: AccountTableRowItems) => {
    const [isActive, setIsActive] = useState(false)
    const { response: ownedAssets, isLoading, isSuccess } = GetOwnedAssetsDetailed(props.detf_address)
    const ownedAssetsDetailed = ownedAssets ? ownedAssets : []
    const moment = require('moment')
    const { response: owner } = GetOwner(props.detf_address)
    const totalDeposited = FormatCurrency((Number(props.total_deposits)
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
        })()), 2)
    const totalValue = FormatCurrency((Number(props.balance_in_weth)
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
        })()), 2)
    const depositHistory = <ul>
        {props.deposits?.map((deposit) =>
            <li key={deposit}><p>
                {moment.unix(deposit[0]).local().format("D MMM YYYY hh:mm")}
                &nbsp;&nbsp;&nbsp;&nbsp;+
                {FormatCurrency((Number(deposit[1])
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
                    })()), 2)}</p></li>
        )}
    </ul>

    return (
        <div className="account-detf-row">
            <div className="account-detf-row-items">
                <div className="account-detf-row-item-detf">
                    <div className="account-index-row-item-name">
                        {props.category}
                        <div className="account-index-chain-title">
                            {/* <img className="account-index-chain-logo" src={require("../assets/images/bsc-logo.png")} alt="Binance Smart Chain"></img> */}
                            {props.dimension}
                        </div>
                    </div>
                </div>
                <div className="account-detf-row-item-value">
                    {FormatCurrency((Number(props.balance_in_weth)
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
                        })()), 2)}
                </div>
                <div className="account-detf-row-item-return" style={{ color: ColourNumbers(props.status === 1 ? props.return_percentage : props.final_return_percentage) }}> {parseFloat((props.status === 1 ? props.return_percentage : props.final_return_percentage).toString()).toFixed(2) + "%"}</div>
                <div className="account-detf-row-item-timelock">{GetTimeToUnlock(Number(props.lockStatus))}</div>
                <div className="account-detf-row-item-deposit">
                    <Link className="account-detf-row-item-link" to="/deposit" state={{
                        category: props.category,
                        dimension: props.dimension,
                        productId: props.product_id,
                        detfAddress: props.detf_address,
                        processOrigin: "deposit",
                        activeStage: 1
                    }}>Deposit</Link>

                </div>
                <div className="account-detf-row-item-toggle" onClick={() => setIsActive(!isActive)}>
                    {isActive ? 'Collapse' : 'Expand'}
                </div>
            </div>
            {isActive && <div className="account-detf-row-expanded">
                <div className="account-detf-expanded-divider"></div>
                <div className="account-detf-expanded-content">
                    <div className="account-detf-expanded-content-left">
                        <div className="account-detf-expanded-content-left-invested">
                            <h2>Total invested: {totalDeposited}</h2>
                            <div className="account-detf-expanded-content-left-invested-summary">
                                <div className="account-detf-expanded-content-left-invested-summary-line">
                                </div>
                                <div className="account-detf-expanded-content-left-invested-summary-table">
                                    <p><b>Deposit history</b></p>
                                    {depositHistory}
                                </div>
                            </div>
                        </div>
                        {props.status === 1 &&
                            <div className="account-detf-expanded-content-left-deposit">
                                <Link className="account-detf-row-item-link" to="/deposit" state={{
                                    category: props.category,
                                    dimension: props.dimension,
                                    productId: props.product_id,
                                    detfAddress: props.detf_address,
                                    processOrigin: "deposit",
                                    activeStage: 1
                                }}>
                                    <button className="button-primary">Deposit</button></Link>
                            </div>}
                        <div className="account-detf-expanded-content-left-current-value">
                            <h2>Total market value: {totalValue}</h2>
                            <p><b>Market value over time ({props.currency})</b></p>
                            <ReturnChartMarketValue height={300} width="100%" performanceData={BTC} />
                        </div>
                        {props.status === 1 &&
                            <div className="account-detf-expanded-content-left-close">
                                < Link className="account-detf-row-item-link" to="/close-detf" state={{
                                    category: props.category,
                                    dimension: props.dimension,
                                    productId: props.product_id,
                                    detfAddress: props.detf_address,
                                    totalValue: props.balance_in_weth,
                                    totalDeposited: props.total_deposits,
                                    returnPercentage: props.return_percentage,
                                    lockTime: props.lockStatus,
                                    currency: props.currency,
                                    vsPrices: props.vsPrices
                                }}>
                                    <button className="button-primary">Exit and withdraw</button></Link>
                            </div>}
                    </div>
                    <div className="account-detf-expanded-content-right">
                        <div className="account-detf-expanded-content-right-owned-assets">
                            <h2>Assets in DETF</h2>
                            <p>Wafer gingerbread bonbon gummies biscuit candy danish cupcake. Cookie liquorice chocolate cake bonbon candy canes tiramisu sugar plum gummies bear claw.</p>
                            <DETFOwnedAssetsTable tokens={ownedAssetsDetailed} vsPrices={props.vsPrices} currency={props.currency} />
                        </div>

                        <div className="account-detf-expanded-content-right-proof-of-assets">
                            <h2>Proof of assets</h2>
                            <p>Wafer gingerbread bonbon gummies biscuit candy danish cupcake. Cookie liquorice chocolate cake bonbon candy canes tiramisu sugar plum gummies bear claw.</p>
                            <br />
                            <p><b>DETF Address:</b></p>
                            <p>{props.detf_address}</p>
                            <p><b>DETF Owner Address:</b></p>
                            <p>{owner}</p>
                            <br />
                            <p>Validate this DETF's assets at <a href={`https://bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer">{`BscScan ->`}</a></p>
                        </div>
                    </div>
                </div>
            </div>}
        </div >
    )
}