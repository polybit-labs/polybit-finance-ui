import { Link } from "react-router-dom"
import "./AccountTableRow.css"
import { useEffect, useState } from "react";
import { GetOwnedAssetsDetailed } from "../api/GetOwnedAssetsDetailed";
import { DETFOwnedAssetsTable } from "../DETFOwnedAssetsTable";
import { FormatCurrency } from "../utils/Currency";
import { GetOwner } from "../api/GetOwner";
import { ColourCategories, DETFIconFilename, FormatPercentages } from '../utils/Formatting'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { GetHistoricalPrices } from "../api/GetHistoricalPrices";
import { GetPriceVsCurrency } from "../api/GetPriceVsCurrency";
import { GetPerformanceDataRange, PerformanceDataRange } from "../api/GetPerformanceDataRange";
import { InvalidChartRange } from "../charts/InvalidChartRange";
import { DETFReturnChart } from "../charts/DETFReturnChart";
import { GetProductData, ProductData } from "../api/GetProductData";
import { DETFAssetsTable } from "../DETFAssetsTable";
import { Button } from "../Button";
import { useNetwork } from "wagmi";

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
    timeLockRemaining: number;
    timeLock: number;
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
    isPlaceholder: boolean;
    historicalPrices: Array<any>;
    currentPrices: Currencies | undefined;
}

export const AccountTableRow = (props: AccountTableRowItems) => {
    const moment = require('moment')
    const [isActive, setIsActive] = useState(props.isPlaceholder)
    const [isDETFActive, setIsDETFActive] = useState(false)
    const [isDETFDeposited, setIsDETFDeposited] = useState(false)
    const [isDETFTimeLocked, setIsDETFTimeLocked] = useState(false)
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : ""
    const productUrl = `${chainId === "97" ? "97" : "bnb-smart-chain"}/${props.category.replaceAll(" ", "-").toLowerCase()}/${props.dimension.replaceAll(" ", "-").toLowerCase()}`
    const performanceUrl = `bnb-smart-chain/${props.category.replaceAll(" ", "-").toLowerCase()}/${props.dimension.replaceAll(" ", "-").toLowerCase()}`

    useEffect(() => {
        if (props.status === 1) {
            setIsDETFActive(true)
        }
        if (Number(props.total_deposits) > 0) {
            setIsDETFDeposited(true)
        }
        if (Number(props.timeLockRemaining) > 0) {
            setIsDETFTimeLocked(true)
        }
    }, [])

    const { response: ownedAssets, isLoading, isSuccess } = GetOwnedAssetsDetailed(props.detf_address)
    const ownedAssetsDetailed = ownedAssets ? ownedAssets : []
    const { response: owner } = GetOwner(props.detf_address)
    const { response: performanceDataRange, isSuccess: performanceDataRangeSuccess } = GetPerformanceDataRange(performanceUrl, props.creation_timestamp, props.close_timestamp > 0 ? props.close_timestamp : moment.now())
    const [performanceData, setPerformanceData] = useState<Array<PerformanceDataRange>>([])
    const [validDateRange, setValidDateRange] = useState(false)
    useEffect(() => {
        if (performanceDataRangeSuccess
            && performanceDataRange
            && performanceDataRange.length > 2
            && Number(props.total_deposits) > 0) {
            setPerformanceData(performanceDataRange)
            setValidDateRange(true)
        }
    }, [performanceDataRange, performanceDataRangeSuccess])

    const { response: productDataResponse, isLoading: productDataLoading, isSuccess: productDataSuccess } = GetProductData(productUrl)
    const [productData, setProductData] = useState<ProductData>()
    useEffect(() => {
        setProductData(productDataResponse)
    }, [productDataResponse, productDataSuccess])



    const GetHistoricalPriceCurrency = (timestamp: number) => {
        let price = 0
        const latestPrices: Currencies = props.historicalPrices[props.historicalPrices.length - 1]
        //Check if the timestamp is > the historical price data. If so, use real time prices.
        if (latestPrices) {
            const lastHistoricalPriceDate = moment(latestPrices.date)
            if (moment.unix(timestamp) > lastHistoricalPriceDate) {
                price = Number((() => {
                    switch (props.currency) {
                        case "AUD": return (props.currentPrices ? props.currentPrices.aud : 0)
                        case "BNB": return (props.currentPrices ? props.currentPrices.bnb : 0)
                        case "CNY": return (props.currentPrices ? props.currentPrices.cny : 0)
                        case "EURO": return (props.currentPrices ? props.currentPrices.eur : 0)
                        case "IDR": return (props.currentPrices ? props.currentPrices.idr : 0)
                        case "JPY": return (props.currentPrices ? props.currentPrices.jpy : 0)
                        case "KRW": return (props.currentPrices ? props.currentPrices.krw : 0)
                        case "RUB": return (props.currentPrices ? props.currentPrices.rub : 0)
                        case "TWD": return (props.currentPrices ? props.currentPrices.twd : 0)
                        case "USD": return (props.currentPrices ? props.currentPrices.usd : 0)
                    }
                })())
            }
            if (moment.unix(timestamp) < lastHistoricalPriceDate) {
                const historicalPricesFiltered = props.historicalPrices.filter(date => {
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

    const GetCurrentTotalDepositedCurrency = () => {
        let deposits = 0
        for (let i = 0; i < props.deposits.length; i++) {
            const price = Number(props.deposits[i][1]) / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.deposits[i][0]))
            deposits = deposits + price
        }
        return deposits
    }
    const currentTotalDeposited = GetCurrentTotalDepositedCurrency()
    const currentTotalDepositedFormatted = FormatCurrency(currentTotalDeposited, 2)
    const currentTotalValue = (Number(props.balance_in_weth)
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
        })())
    const currentTotalValueFormatted = FormatCurrency(currentTotalValue, 2)
    const currentReturn = currentTotalValue - currentTotalDeposited
    const currentReturnFormatted = FormatCurrency(currentReturn, 2)
    const currentReturnPercentage = currentReturn / currentTotalDeposited
    const currentReturnPercentageFormatted = currentReturnPercentage ? FormatPercentages(currentReturnPercentage * 100) : FormatPercentages(0)

    const finalTotalDeposited = FormatCurrency(Number(props.total_deposits) / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp)), 2)
    let totalDepositHistoricalPrices: number = 0
    props.deposits?.map((deposit) => {
        totalDepositHistoricalPrices = totalDepositHistoricalPrices + (Number(deposit[1]) / 10 ** 18 * GetHistoricalPriceCurrency(Number(deposit[0])))
    })
    const finalMarketValue = FormatCurrency(Number(props.final_balance_in_weth) / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp)), 2)
    const finalReturnWeth = FormatCurrency(Number(props.final_return_weth) / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp)), 2)

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
        {!isDETFActive && <li>
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <div style={{ width: "150px" }}>
                    <p>{moment.unix(props.close_timestamp).local().format("D MMM YYYY hh:mm")}</p>
                </div>
                <div style={{ width: "150px" }}><p>-{FormatCurrency((Number(props.final_balance_in_weth)
                    / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp))), 2)}</p>
                </div>
            </div></li>}
    </ul>
    const timeLock = moment.unix(props.timeLock).local().format("D MMM YYYY hh:mm")

    return (
        <div className="account-detf-row">
            <div className="account-detf-row-items">
                <div className="account-detf-row-item-detf">
                    <img className="account-index-row-item-logo" src={require(`../../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
                    <div className="account-index-row-item-name">
                        <div className="account-index-row-item-category" style={{ color: ColourCategories(props.category) }}>
                            {props.category}
                            <div className="account-index-row-item-dimension" style={{ color: "#000000" }}>
                                {props.dimension}
                            </div>
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
                {isDETFActive && <div className="account-detf-row-item-return" >{currentReturnPercentageFormatted}</div>}
                {!isDETFActive && <div className="account-detf-row-item-return" >{FormatPercentages(props.final_return_percentage)}</div>}
                {isDETFActive && !isDETFDeposited &&
                    <div className="account-detf-row-item-status">Deposit Required</div>
                }
                {isDETFActive && isDETFDeposited && !isDETFTimeLocked &&
                    <div className="account-detf-row-item-status">Unlocked</div>
                }
                {isDETFActive && isDETFDeposited && isDETFTimeLocked &&
                    <div className="account-detf-row-item-status">Locked until {timeLock}</div>
                }
                {!isDETFActive &&
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
                            {isDETFActive && <h2>Total invested: {currentTotalDepositedFormatted}</h2>}
                            {!isDETFActive && <h2>Total invested: {finalTotalDeposited}</h2>}
                            {isDETFDeposited && <div className="account-detf-expanded-content-left-invested-summary">
                                <div className="account-detf-expanded-content-left-invested-summary-line">
                                </div>
                                <div className="account-detf-expanded-content-left-invested-summary-table">
                                    <p><b>Transaction history</b></p>
                                    {transactionHistory}

                                </div>
                            </div>}
                            {!isDETFDeposited && <div className="account-detf-expanded-content-left-invested-no-deposits">
                                <img className="account-detf-expanded-content-left-invested-no-deposits-icon" src={require("../../assets/icons/info_dark_grey.png")}></img>
                                <p>You have not yet deposited into this DETF.</p></div>}
                        </div>
                        {isDETFActive && !isDETFDeposited &&
                            <div className="account-detf-expanded-content-left-deposit">
                                <Link className="account-detf-row-item-link" to="/deposit" state={{
                                    category: props.category,
                                    dimension: props.dimension,
                                    productId: props.product_id,
                                    detfAddress: props.detf_address,
                                    processOrigin: "deposit",
                                    activeStage: 1
                                }}>
                                    <Button text="Make your first deposit into this DETF" buttonStyle="primary" type="button" /></Link>
                            </div>}
                        {isDETFActive && isDETFDeposited &&
                            <div className="account-detf-expanded-content-left-deposit">
                                <Link className="account-detf-row-item-link" to="/deposit" state={{
                                    category: props.category,
                                    dimension: props.dimension,
                                    productId: props.product_id,
                                    detfAddress: props.detf_address,
                                    processOrigin: "deposit",
                                    activeStage: 1
                                }}>
                                    <Button text="Deposit" buttonStyle="primary" type="button" /></Link>
                            </div>}
                        <div className="account-detf-expanded-content-left-current-value">
                            {isDETFActive && <h2>Total market value: {currentTotalValueFormatted} ({currentReturnFormatted})</h2>}
                            {!isDETFActive && <h2>Final market value: {finalMarketValue} ({finalReturnWeth})</h2>}
                            <p><b>Market value over time ({props.currency})</b></p>
                            {validDateRange && <DETFReturnChart height={300} width="100%" performanceData={performanceData} />}
                            {!validDateRange && <InvalidChartRange height={300} width="100%" />}
                        </div>
                        <div className="account-detf-expanded-content-left-close">
                            {isDETFActive && isDETFDeposited && !isDETFTimeLocked &&
                                < Link className="account-detf-row-item-link" to="/close-detf" state={{
                                    category: props.category,
                                    dimension: props.dimension,
                                    productId: props.product_id,
                                    detfAddress: props.detf_address,
                                    totalValue: props.balance_in_weth,
                                    totalDeposited: props.total_deposits,
                                    returnPercentage: props.return_percentage,
                                    lockTime: props.timeLockRemaining,
                                    currency: props.currency,
                                    vsPrices: props.vsPrices
                                }}>
                                    <Button text="Exit and withdraw" buttonStyle="primary" type="button" /></Link>}
                            {isDETFActive && !isDETFDeposited &&
                                <button className="button-disabled" >Exit and withdraw</button>
                            }
                            {isDETFActive && isDETFTimeLocked &&
                                <button className="button-disabled" >Exit and withdraw</button>
                            }
                            {isDETFActive && isDETFTimeLocked &&
                                <div className="account-detf-expanded-content-left-close-message">
                                    <p>You have set a time lock on this DETF.</p>
                                    <p>Withdrawals are locked until {timeLock}.</p>
                                </div>
                            }
                            {!isDETFActive &&
                                <Button text="Exit and withdraw" buttonStyle="disabled" type="button" />
                            }
                        </div>
                    </div>
                    <div className="account-detf-expanded-content-right">
                        <div className="account-detf-expanded-content-right-owned-assets">
                            <h2>Assets in DETF</h2>
                            <p>Wafer gingerbread bonbon gummies biscuit candy danish cupcake. Cookie liquorice chocolate cake bonbon candy canes tiramisu sugar plum gummies bear claw.</p>
                            {isDETFActive && isDETFDeposited && <DETFOwnedAssetsTable tokens={ownedAssetsDetailed} vsPrices={props.vsPrices} currency={props.currency} />}
                            {isDETFActive && !isDETFDeposited && <DETFAssetsTable tokens={productData ? productData.tokens : []} />}
                            {!isDETFActive && <div>INSERT LAST ASSETS OWNED</div>}
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
                            {chainId === "97" && <p>Validate this DETF's assets at <a href={`https://testnet.bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer">{`BscScan ->`}</a></p>}
                            {chainId !== "97" && <p>Validate this DETF's assets at <a href={`https://bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer">{`BscScan ->`}</a></p>}
                        </div>
                    </div>
                </div>
            </div>}
        </div >
    )
}