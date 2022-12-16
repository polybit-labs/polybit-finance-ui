import { Link } from "react-router-dom"
import { GetTimeToUnlock } from "./utils/TimeLock"
import "./AccountTableRow.css"
import { useEffect, useState } from "react";
import { GetOwnedAssetsDetailed } from "./api/GetOwnedAssetsDetailed";
import { DETFOwnedAssetsTable } from "./DETFOwnedAssetsTable";
import { FormatCurrency } from "./utils/Currency";
import BTC from "../product/detfs/BTC-USD.json"
import { ReturnChartMarketValue } from "./ReturnChartMarketValue";
import { GetOwner } from "./api/GetOwner";
import { ColourCategories, ColourNumbers, FormatPercentages } from './utils/Formatting'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { GetHistoricalPrices } from "./api/GetHistoricalPrices";
import { GetPriceVsCurrency } from "./api/GetPriceVsCurrency";
import wethAddress from "../chain_info/weth.json"

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
interface AccountTableRowItems {
    category: string;
    dimension: string;
    status: number;
    balance_in_weth: string;
    final_balance_in_weth: string;
    return_weth: string;
    return_percentage: number;
    final_return_percentage: number;
    lockStatus: string;
    product_id: string;
    detf_address: string;
    deposits: Array<string>;
    total_deposits: string;
    vsPrices: any;
    currency: string;
    close_timestamp: number;
    creation_timestamp: number;
    final_return: Currencies;
    final_return_weth: string;
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
    const { response: historicalPriceData, isSuccess: historicalPricesSuccess } = GetHistoricalPrices(props.close_timestamp.toString())
    const { response: currentPriceData, isSuccess: currentPricesSuccess } = GetPriceVsCurrency(wethAddress["56"]["wethAddress"])

    const [historicalPrices, setHistoricalPrices] = useState<Array<Currencies>>([])
    const [currentPrices, setCurrentPrices] = useState<Currencies>()

    useEffect(() => {
        setHistoricalPrices(historicalPriceData ? historicalPriceData : [])
        setCurrentPrices(currentPriceData ? currentPriceData : [])
    }, [historicalPriceData, historicalPricesSuccess, currentPriceData, currentPricesSuccess])

    const GetHistoricalPriceCurrency = (timestamp: number) => {
        let price = 0
        const latestPrices: Currencies = historicalPrices[historicalPrices.length - 1]
        //Check if the timestamp is > the historical price data. If so, use real time prices.
        if (latestPrices) {
            const lastHistoricalPriceDate = moment(latestPrices.date)
            if (moment.unix(timestamp) > lastHistoricalPriceDate) {
                price = Number((() => {
                    switch (props.currency) {
                        case "AUD": return (currentPrices ? currentPrices.aud : 0)
                        case "BNB": return (currentPrices ? currentPrices.bnb : 0)
                        case "CNY": return (currentPrices ? currentPrices.cny : 0)
                        case "EURO": return (currentPrices ? currentPrices.eur : 0)
                        case "IDR": return (currentPrices ? currentPrices.idr : 0)
                        case "JPY": return (currentPrices ? currentPrices.jpy : 0)
                        case "KRW": return (currentPrices ? currentPrices.krw : 0)
                        case "RUB": return (currentPrices ? currentPrices.rub : 0)
                        case "TWD": return (currentPrices ? currentPrices.twd : 0)
                        case "USD": return (currentPrices ? currentPrices.usd : 0)
                    }
                })())
            }
            if (moment.unix(timestamp) < lastHistoricalPriceDate) {
                const historicalPricesFiltered = historicalPrices.filter(date => {
                    return date.date === moment.unix(timestamp).local().format("YYYY-MM-DD")
                })
                if (historicalPricesFiltered.length > 0) {
                    price = Number((() => {
                        switch (props.currency) {
                            case "AUD": return (historicalPricesFiltered[0].aud)
                            case "BNB": return (historicalPricesFiltered[0].bnb)
                            case "CNY": return (historicalPricesFiltered[0].cny)
                            case "EURO": return (historicalPricesFiltered[0].eur)
                            case "IDR": return (historicalPricesFiltered[0].idr)
                            case "JPY": return (historicalPricesFiltered[0].jpy)
                            case "KRW": return (historicalPricesFiltered[0].krw)
                            case "RUB": return (historicalPricesFiltered[0].rub)
                            case "TWD": return (historicalPricesFiltered[0].twd)
                            case "USD": return (historicalPricesFiltered[0].usd)
                        }
                    })())
                }
            }
        }
        return price
    }
    let totalDepositHistoricalPrices: number = 0
    props.deposits?.map((deposit) => {
        totalDepositHistoricalPrices = totalDepositHistoricalPrices + (Number(deposit[1]) / 10 ** 18 * GetHistoricalPriceCurrency(Number(deposit[0])))
    })

    const finalMarketValue = FormatCurrency((Number(props.final_balance_in_weth) / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp))), 2)
    const currentReturnWeth = FormatCurrency((Number(props.return_weth)
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
    const finalReturnWeth = FormatCurrency((Number(props.final_return_weth)
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

    const transactionHistory = <ul>
        {props.deposits?.map((deposit) =>
            <li key={deposit}>
                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <div style={{ width: "150px" }}>
                        <p>{moment.unix(deposit[0]).local().format("D MMM YYYY hh:mm")}</p>
                    </div>
                    <div style={{ width: "150px" }}><p>+{FormatCurrency((Number(deposit[1])
                        / 10 ** 18 * GetHistoricalPriceCurrency(Number(deposit[0]))), 2)}</p>
                    </div>
                </div></li>
        )}
        {props.status === 0 && <li>
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <div style={{ width: "150px" }}>
                    <p>{moment.unix(props.close_timestamp).local().format("D MMM YYYY hh:mm")}</p>
                </div>
                <div style={{ width: "150px" }}><p>-{FormatCurrency((Number(props.final_balance_in_weth)
                    / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp))), 2)}</p>
                </div>
            </div></li>}
    </ul>

    return (
        <div className="account-detf-row">
            <div className="account-detf-row-items">
                <div className="account-detf-row-item-detf">
                    <div className="account-index-row-item-name" style={{ color: ColourCategories(props.category) }}>
                        {props.category}
                        <div className="account-index-chain-title" style={{ color: "#000000" }}>
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
                {props.status === 1 && <div className="account-detf-row-item-return" >{FormatPercentages(props.return_percentage)}</div>}
                {props.status === 0 && <div className="account-detf-row-item-return" >{FormatPercentages(props.final_return_percentage)}</div>}
                {props.status === 1 && Number(props.total_deposits) === 0 &&
                    <div className="account-detf-row-item-status">Deposit Required</div>
                }
                {props.status === 1 && Number(props.total_deposits) > 0 &&
                    <div className="account-detf-row-item-status">{GetTimeToUnlock(Number(props.lockStatus))}</div>
                }
                {props.status === 0 &&
                    <div className="account-detf-row-item-status">Closed</div>
                }

                <div className="account-detf-row-item-deposit">
                    <Link className="account-detf-row-item-link" to="/deposit" state={{
                        category: props.category,
                        dimension: props.dimension,
                        productId: props.product_id.toString(),
                        detfAddress: props.detf_address,
                        processOrigin: "deposit",
                        activeStage: 1
                    }}>Deposit</Link>

                </div>
                <div className="account-detf-row-item-toggle" onClick={() => setIsActive(!isActive)}>
                    {isActive ? <div>Collapse <FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div>
                        : <div>Expand <FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div>}
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
                                    <p><b>Transaction history</b></p>
                                    {transactionHistory}
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
                            {props.status === 1 && <h2>Total market value: {totalValue} ({currentReturnWeth})</h2>}
                            {props.status === 0 && <h2>Final market value: {finalMarketValue} ({finalReturnWeth})</h2>}
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