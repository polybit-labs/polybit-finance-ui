import { Link } from "react-router-dom"
import "./AccountTableRow.css"
import { useEffect, useState } from "react"
import { DETFOwnedAssetsTable } from "../DETFOwnedAssetsTable"
import { Currencies, FormatCurrency } from "../utils/Currency"
import { GetOwner } from "../api/GetOwner"
import { ColourCategories, ColourNumbers, DETFIconFilename, FormatPercentages } from '../utils/Formatting'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { GetPerformanceDataRange, PerformanceDataRange } from "../api/GetPerformanceDataRange"
import { InvalidChartRange } from "../charts/InvalidChartRange"
import { DETFReturnChart } from "../charts/DETFReturnChart"
import { GetProductData, ProductData } from "../api/GetProductData"
import { DETFAssetsTable } from "../DETFAssetsTable"
import { Button } from "../Buttons"
import { useNetwork } from "wagmi"
import { TruncateAddress } from "../utils/Formatting"
import { BigNumber } from "ethers"

type AccountTableRowItems = {
    detf_address: string;
    status: number;
    creation_timestamp: number;
    category: string;
    dimension: string;
    balance_in_weth: BigNumber;
    deposits: Array<Array<BigNumber>>;
    total_deposited: BigNumber;
    fees_paid: Array<Array<BigNumber>>;
    transactions: Array<any>;
    owned_assets: Array<string>;
    owned_assets_prices: Array<BigNumber>;
    owned_assets_table_data: Array<any>;
    time_lock: number;
    time_lock_remaining: number;
    close_timestamp: number;
    return_weth: BigNumber;
    return_percentage: number;
    final_return_weth: BigNumber;
    final_return_percentage: number;
    final_return: any;
    final_balance_in_weth: BigNumber;
    final_assets: Array<string>;
    final_assets_prices: Array<BigNumber>;
    final_assets_balances: Array<BigNumber>;
    final_assets_balances_in_weth: BigNumber;
    final_assets_table_data: Array<any>;
    vsPrices: any;
    currency: string;
    historicalPrices: Array<any>;
    currentPrices: Currencies | undefined;
}

export const AccountTableRow = (props: AccountTableRowItems) => {
    const moment = require('moment')
    const [isActive, setIsActive] = useState(false)
    const [isDETFActive, setIsDETFActive] = useState(false)
    const [isDETFDeposited, setIsDETFDeposited] = useState(false)
    const [isDETFTimeLocked, setIsDETFTimeLocked] = useState(false)
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    const productUrl = `${chainId}/${props.category.replaceAll(" ", "-").toLowerCase()}/${props.dimension.replaceAll(" ", "-").toLowerCase()}`
    const performanceUrl = `${chainId}/${props.category.replaceAll(" ", "-").toLowerCase()}/${props.dimension.replaceAll(" ", "-").toLowerCase()}`

    useEffect(() => {
        if (props.status === 1) {
            setIsDETFActive(true)
        }
        if (Number(props.total_deposited) > 0) {
            setIsDETFDeposited(true)
        }
        if (Number(props.time_lock_remaining) > 0) {
            setIsDETFTimeLocked(true)
        }
    }, [])

    //const { response: ownedAssetsTableData, isSuccess: ownedAssetsTableDataSuccess } = GetOwnedAssetsTableData(props.detf_address, props.status, props.total_deposited.toString())
    const { response: owner } = GetOwner(props.detf_address)
    const { response: performanceDataRange, isSuccess: performanceDataRangeSuccess } = GetPerformanceDataRange(performanceUrl, props.creation_timestamp, props.close_timestamp > 0 ? props.close_timestamp : moment.now())
    const [performanceData, setPerformanceData] = useState<Array<PerformanceDataRange>>([])
    const [validDateRange, setValidDateRange] = useState(false)
    useEffect(() => {
        if (performanceDataRangeSuccess
            && performanceDataRange
            && performanceDataRange.length > 2
            && Number(props.total_deposited) > 0) {
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
    const currentReturnFormatted = FormatCurrency(moment().unix() > (props.creation_timestamp + (60 * 60)) ? currentReturn : 0, 2)
    const currentReturnPercentage = currentReturn / currentTotalDeposited
    const currentReturnPercentageFormatted = FormatPercentages(moment().unix() > (props.creation_timestamp + (60 * 60)) ? (currentReturnPercentage ? currentReturnPercentage * 100 : 0) : 0)

    const finalTotalDeposited = FormatCurrency(Number(props.total_deposited) / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp)), 2)
    let totalDepositHistoricalPrices: number = 0
    props.deposits?.map((deposit) => {
        totalDepositHistoricalPrices = totalDepositHistoricalPrices + (Number(deposit[1]) / 10 ** 18 * GetHistoricalPriceCurrency(Number(deposit[0])))
    })
    const finalMarketValue = FormatCurrency(Number(props.final_balance_in_weth) / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp)), 2)
    const finalReturnWeth = FormatCurrency(Number(props.final_return_weth) / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp)), 2)

    const transactionHistory = <table className="transaction-history" >
        <tbody>
            {props.transactions?.map((transaction) => {
                return (
                    <tr key={transaction}>
                        <td><p>{moment.unix(transaction[0]).local().format("D MMM YYYY")}</p></td>
                        <td>
                            {transaction[2] === "Deposit" && <p>+{FormatCurrency((Number(transaction[1])
                                / 10 ** 18 * GetHistoricalPriceCurrency(Number(transaction[0]))), 2)}</p>
                            }
                            {transaction[2] === "Fee" && <p>-{FormatCurrency((Number(transaction[1])
                                / 10 ** 18 * GetHistoricalPriceCurrency(Number(transaction[0]))), 2)?.replaceAll("-", "")}</p>
                            }</td>
                        <td><p>{transaction[2]}</p></td>
                    </tr>)
            })}
            {!isDETFActive && <tr>
                <td><p>{moment.unix(props.close_timestamp).local().format("D MMM YYYY")}</p></td>
                <td><p>-{FormatCurrency((Number(props.final_balance_in_weth)
                    / 10 ** 18 * GetHistoricalPriceCurrency(Number(props.close_timestamp))), 2)}</p></td>
                <td><p>Withdraw</p></td>
            </tr>}
        </tbody>
    </table >
    const timeLock = moment.unix(props.time_lock).local().format("D MMM YYYY hh:mm")
    const tableLoading = <div className="table-loading">
        <img height="60px" width="60px" src={require("../../assets/images/polybit-loader-black-on-light-grey-60px.gif")} alt="Loading"></img>
    </div>

    return (
        <>
            <div className="account-table-row">
                <div className="account-table-row-items">
                    <div className="account-table-row-item-detf" onClick={() => setIsActive(!isActive)} >
                        <img className="account-table-row-item-logo" src={require(`../../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
                        <div className="account-table-row-item-name">
                            <div className="account-table-row-item-category" style={{ color: ColourCategories(props.category) }}>
                                {props.category}
                            </div>
                            <div className="account-table-row-item-dimension" style={{ color: "#000000" }}>
                                {props.dimension}
                                <Link className="account-table-row-item-link-to-detf" to={`/themes/bnb-smart-chain/${props.category.replaceAll(" ", "-").toLocaleLowerCase()}/${props.dimension.replaceAll(" ", "-").toLocaleLowerCase()}`}>
                                    <FontAwesomeIcon icon={icon({ name: "up-right-from-square", style: "solid" })} /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="account-table-row-item-value">
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
                    {isDETFActive && <div className="account-table-row-item-return" >{currentReturnPercentageFormatted}</div>}
                    {!isDETFActive && <div className="account-table-row-item-return" >{FormatPercentages(props.final_return_percentage)}</div>}
                    {isDETFActive && !isDETFDeposited &&
                        <div className="account-table-row-item-status">Investment Required</div>
                    }
                    {isDETFActive && isDETFDeposited && !isDETFTimeLocked &&
                        <div className="account-table-row-item-status">Unlocked</div>
                    }
                    {isDETFActive && isDETFDeposited && isDETFTimeLocked &&
                        <div className="account-table-row-item-status">Locked</div>
                    }
                    {!isDETFActive &&
                        <div className="account-table-row-item-status">Closed</div>
                    }
                    <div className="account-table-row-item-deposit">
                        {isDETFActive && <Link className="account-table-row-item-link" to="/deposit" state={{
                            category: props.category,
                            dimension: props.dimension,
                            detfAddress: props.detf_address,
                            processOrigin: "deposit",
                            activeStage: 1
                        }}>Invest</Link>}
                    </div>
                    <div className="account-table-row-item-toggle">
                        {isActive && <div className="account-table-row-item-toggle-fa" onClick={() => setIsActive(!isActive)}>Collapse&nbsp;
                            <div style={{ transform: "translateY(+15%)" }}><FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} /></div></div>}
                        {!isActive && <div className="account-table-row-item-toggle-fa" onClick={() => setIsActive(!isActive)}>Expand&nbsp;
                            <div style={{ transform: "translateY(-15%)" }}><FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} /></div></div>}
                    </div>
                </div>
                {
                    isActive && <div className="account-table-row-expanded">
                        <div className="account-table-expanded-divider"></div>
                        <div className="account-table-expanded-content">
                            <div className="account-table-expanded-content-left">
                                <div className="account-table-expanded-content-left-invested">
                                    {isDETFActive && <h2>Total invested: {currentTotalDepositedFormatted}</h2>}
                                    {!isDETFActive && <h2>Total invested: {finalTotalDeposited}</h2>}
                                    {isDETFDeposited && <div className="account-table-expanded-content-left-invested-summary">
                                        <div className="account-table-expanded-content-left-invested-summary-line">
                                        </div>
                                        <div className="account-table-expanded-content-left-invested-summary-table">
                                            <p><b>Transaction history</b></p>
                                            {transactionHistory}

                                        </div>
                                    </div>}
                                    {!isDETFDeposited && <div className="account-table-expanded-content-left-invested-no-deposits">
                                        <img className="account-table-expanded-content-left-invested-no-deposits-icon" src={require("../../assets/icons/info_dark_grey.png")}></img>
                                        <p>You have not yet invested into this DETF.</p></div>}
                                </div>
                                {isDETFActive && !isDETFDeposited &&
                                    <div className="account-table-expanded-content-left-deposit">
                                        <Link className="account-table-row-item-link" to="/deposit" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            detfAddress: props.detf_address,
                                            processOrigin: "deposit",
                                            activeStage: 1
                                        }}>
                                            <Button text="Make your first investment into this DETF" buttonStyle="primary" buttonSize="standard" /></Link>
                                    </div>}
                                {isDETFActive && isDETFDeposited &&
                                    <div className="account-table-expanded-content-left-deposit">
                                        <Link className="account-table-row-item-link" to="/deposit" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            detfAddress: props.detf_address,
                                            processOrigin: "deposit",
                                            activeStage: 1
                                        }}>
                                            <Button text="Top up investment" buttonStyle="primary" buttonSize="standard" /></Link>
                                    </div>}
                                <div className="account-table-expanded-content-left-current-value">
                                    {isDETFActive && <h2>Total market value: {currentTotalValueFormatted} ({currentReturnFormatted})</h2>}
                                    {!isDETFActive && <h2>Final market value: {finalMarketValue} ({finalReturnWeth})</h2>}
                                    <div className="account-table-chart-title"><p><b>Market value over time ({props.currency})</b></p></div>
                                    {validDateRange && <DETFReturnChart height={300} width="100%" performanceData={performanceData} />}
                                    {!validDateRange && <InvalidChartRange height={300} width="100%" />}
                                </div>
                                <div className="account-table-expanded-content-left-close">
                                    {isDETFActive && isDETFDeposited && !isDETFTimeLocked &&
                                        < Link className="account-table-row-item-link" to="/close-detf" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            detfAddress: props.detf_address,
                                            totalValue: props.balance_in_weth,
                                            currentTotalValue: currentTotalValue,
                                            currentReturn: currentReturn,
                                            currentReturnPercentage: currentReturnPercentage,
                                            currency: props.currency,
                                            vsPrices: props.vsPrices,
                                            totalDeposited: currentTotalDeposited
                                        }}>
                                            <Button text="Exit and withdraw" buttonStyle="primary" buttonSize="standard" /></Link>}
                                    {isDETFActive && !isDETFDeposited &&
                                        <Button text="Exit and withdraw" buttonStyle="primary" buttonSize="standard" status="disabled" />
                                    }
                                    {isDETFActive && isDETFTimeLocked &&
                                        <Button text="Exit and withdraw" buttonStyle="primary" buttonSize="standard" status="disabled" />
                                    }
                                    {isDETFActive && isDETFTimeLocked &&
                                        <div className="account-table-expanded-content-left-close-message">
                                            <p>You have set a time lock on this DETF.</p>
                                            <p>Withdrawals are locked until {timeLock}.</p>
                                        </div>
                                    }
                                    {!isDETFActive &&
                                        <Button text="Exit and withdraw" buttonStyle="primary" buttonSize="standard" status="disabled" />
                                    }
                                </div>
                            </div>
                            <div className="account-table-expanded-content-right">
                                <div className="account-table-expanded-content-right-owned-assets">
                                    <h2>Assets in investment theme</h2>
                                    {isDETFActive && isDETFDeposited && props.owned_assets_table_data && <DETFOwnedAssetsTable tokens={props.owned_assets_table_data} vsPrices={props.vsPrices} currency={props.currency} />}
                                    {isDETFActive && isDETFDeposited && !props.owned_assets_table_data && tableLoading}
                                    {isDETFActive && !isDETFDeposited && productData && <DETFAssetsTable tokens={productData ? productData.tokens : []} />}
                                    {isDETFActive && !isDETFDeposited && !productData && tableLoading}
                                    {!isDETFActive && props.final_assets_table_data && <DETFOwnedAssetsTable tokens={props.final_assets_table_data} vsPrices={props.vsPrices} currency={props.currency} />}
                                    {!isDETFActive && !props.final_assets_table_data && tableLoading}
                                </div>
                                <div className="account-table-expanded-content-right-proof-of-assets">
                                    <h2>Proof of assets</h2>
                                    <p>Polybit’s DETFs are self-custodial, which means your assets are held in a smart contract that is controlled by your wallet and are not pooled or centralised. You can prove this at any time with the information below.</p>
                                    <br />
                                    <p><b>DETF Address:</b></p>
                                    {chainId === "97" && <a href={`https://testnet.bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.detf_address)}</p></a>}
                                    {chainId !== "97" && <a href={`https://bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.detf_address)}</p></a>}
                                    <p><b>DETF Owner Address:</b></p>
                                    {chainId === "97" && <a href={`https://testnet.bscscan.com/address/${owner}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(owner ? owner : "")}</p></a>}
                                    {chainId !== "97" && <a href={`https://testnet.bscscan.com/address/${owner}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(owner ? owner : "")}</p></a>}
                                    <br />
                                    {chainId === "97" && <p><b><a href={`https://testnet.bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer">{`Validate this DETF's assets at BscScan ->`}</a></b></p>}
                                    {chainId !== "97" && <p><b><a href={`https://bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer">{`Validate this DETF's assets at BscScan ->`}</a></b></p>}
                                    <img className="account-table-expanded-content-right-proof-of-assets-diamond" src={require("../../assets/images/silver_diamond.png")}></img>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div >
            <div className="account-table-row-mobile">
                <div className="account-table-row-items-mobile">
                    <div className="account-table-row-item-detf-header-mobile">
                        <div className="account-table-row-item-detf-mobile" onClick={() => setIsActive(!isActive)} >
                            <img className="account-table-row-item-logo-mobile" src={require(`../../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
                            <div className="account-table-row-item-name-mobile">
                                <div className="account-table-row-item-name-category-mobile" style={{ color: ColourCategories(props.category) }}>
                                    {props.category}
                                    <div className="account-table-row-item-name-dimension-mobile" style={{ color: "#000000" }}>
                                        {props.dimension}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {isActive && <div className="account-table-row-item-toggle-mobile" onClick={() => setIsActive(!isActive)}>
                                <div style={{ transform: "translateY(+15%)", fontSize: "28px", color: "#000000" }}>
                                    <FontAwesomeIcon icon={icon({ name: "sort-up", style: "solid" })} />
                                </div>
                            </div>}
                            {!isActive && <div className="account-table-row-item-toggle-mobile" onClick={() => setIsActive(!isActive)}>
                                <div style={{ transform: "translateY(-15%)", fontSize: "28px", color: "#000000" }}>
                                    <FontAwesomeIcon icon={icon({ name: "sort-down", style: "solid" })} />
                                </div>
                            </div>}
                        </div>
                    </div>
                    <table className="account-table-row-item-table-mobile">
                        <tbody>
                            <tr>
                                <td className="account-table-row-item-table-header-mobile">Value:</td>
                                <td className="account-table-row-item-table-cell-mobile">{FormatCurrency((Number(props.balance_in_weth)
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
                                    })()), 2)}</td>
                            </tr>
                            <tr>
                                <td className="account-table-row-item-table-header-mobile">Return:</td>
                                {isDETFActive && <td className="account-table-row-item-table-cell-mobile" style={{ color: ColourNumbers(currentReturnPercentage) }}>{currentReturnPercentageFormatted}</td>}
                                {!isDETFActive && <td className="account-table-row-item-table-cell-mobile" style={{ color: ColourNumbers(props.final_return_percentage) }}>{FormatPercentages(props.final_return_percentage)}</td>}
                            </tr>
                            <tr>
                                <td className="account-table-row-item-table-header-mobile">Status:</td>
                                {isDETFActive && !isDETFDeposited &&
                                    <td className="account-table-row-item-table-cell-mobile">Investment Required</td>
                                }
                                {isDETFActive && isDETFDeposited && !isDETFTimeLocked &&
                                    <td className="account-table-row-item-table-cell-mobile">Unlocked</td>
                                }
                                {isDETFActive && isDETFDeposited && isDETFTimeLocked &&
                                    <td className="account-table-row-item-table-cell-mobile">Locked</td>
                                }
                                {!isDETFActive &&
                                    <td className="account-table-row-item-table-cell-mobile">Closed</td>
                                }
                            </tr>
                        </tbody>
                    </table>

                </div>
                {
                    isActive && <div className="account-table-row-expanded-mobile">
                        <div className="account-table-row-expanded-wrapper-mobile">
                            <div className="account-table-expanded-divider-mobile"></div>
                            <div className="account-table-expanded-content-mobile">
                                <div className="account-table-expanded-content-invested-mobile">
                                    {isDETFActive && <div><h2>Total invested:</h2>
                                        <h2>{currentTotalDepositedFormatted}</h2>
                                    </div>}
                                    {!isDETFActive && <div><h2>Total invested:</h2>
                                        <h2>{finalTotalDeposited}</h2>
                                    </div>}
                                    {isDETFDeposited && <div className="account-table-expanded-content-invested-summary-mobile">
                                        <div className="account-table-expanded-content-invested-summary-line-mobile">
                                        </div>
                                        <div className="account-table-expanded-content-invested-summary-table-mobile">
                                            <p><b>Transaction history</b></p>
                                            {transactionHistory}
                                        </div>
                                    </div>}
                                    {!isDETFDeposited && <div className="account-table-expanded-content-invested-no-deposits-mobile">
                                        <img className="account-table-expanded-content-invested-no-deposits-icon-mobile" src={require("../../assets/icons/info_dark_grey.png")}></img>
                                        <p>You have not yet deposited into this DETF.</p></div>}
                                </div>
                                {isDETFActive && !isDETFDeposited &&
                                    <div className="account-table-expanded-content-deposit-mobile">
                                        <Link className="account-table-row-item-link" to="/deposit" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            detfAddress: props.detf_address,
                                            processOrigin: "deposit",
                                            activeStage: 1
                                        }}>
                                            <Button text="Make your first deposit into this DETF" buttonStyle="primary" buttonSize="standard" /></Link>
                                    </div>}
                                {isDETFActive && isDETFDeposited &&
                                    <div className="account-table-expanded-content-deposit-mobile">
                                        <Link className="account-table-row-item-link-mobile" to="/deposit" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            detfAddress: props.detf_address,
                                            processOrigin: "deposit",
                                            activeStage: 1
                                        }}>
                                            <Button text="Top up investment" buttonStyle="primary" buttonSize="standard" /></Link>
                                    </div>}
                                <div className="account-table-expanded-content-current-value-mobile">
                                    {isDETFActive && <div><h2>Total market value:</h2>
                                        <h2>{currentTotalValueFormatted} ({currentReturnFormatted})</h2>
                                    </div>}
                                    {!isDETFActive && <div><h2>Final market value:</h2>
                                        <h2>{finalMarketValue} ({finalReturnWeth})</h2>
                                    </div>}
                                    <br />
                                    <div className="account-table-chart-title"><p><b>Market value over time ({props.currency})</b></p></div>
                                    {validDateRange && <DETFReturnChart height={300} width="100%" performanceData={performanceData} />}
                                    {!validDateRange && <InvalidChartRange height={300} width="100%" />}
                                </div>
                                <div className="account-table-expanded-content-close-mobile">
                                    {isDETFActive && isDETFDeposited && !isDETFTimeLocked &&
                                        < Link className="account-table-row-item-link-mobile" to="/close-detf" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            detfAddress: props.detf_address,
                                            totalValue: props.balance_in_weth,
                                            currentTotalValue: currentTotalValue,
                                            currentReturn: currentReturn,
                                            currentReturnPercentage: currentReturnPercentage,
                                            currency: props.currency,
                                            vsPrices: props.vsPrices,
                                            totalDeposited: currentTotalDeposited
                                        }}>
                                            <Button text="Exit and withdraw" buttonStyle="primary" buttonSize="standard" /></Link>}
                                    {isDETFActive && !isDETFDeposited &&
                                        <Button text="Exit and withdraw" buttonStyle="primary" buttonSize="standard" status="disabled" />
                                    }
                                    {isDETFActive && isDETFTimeLocked &&
                                        <Button text="Exit and withdraw" buttonStyle="primary" buttonSize="standard" status="disabled" />
                                    }
                                    {isDETFActive && isDETFTimeLocked &&
                                        <div className="account-table-expanded-content-close-message-mobile">
                                            <p>You have set a time lock on this DETF.</p>
                                            <p>Withdrawals are locked until {timeLock}.</p>
                                        </div>
                                    }
                                    {!isDETFActive &&
                                        <Button text="Exit and withdraw" buttonStyle="primary" buttonSize="standard" status="disabled" />
                                    }
                                </div>
                                <div className="account-table-expanded-content-owned-assets-mobile">
                                    <h2>Assets in investment theme</h2>
                                    {isDETFActive && isDETFDeposited && props.owned_assets_table_data && <DETFOwnedAssetsTable tokens={props.owned_assets_table_data} vsPrices={props.vsPrices} currency={props.currency} />}
                                    {isDETFActive && isDETFDeposited && !props.owned_assets_table_data && tableLoading}
                                    {isDETFActive && !isDETFDeposited && productData && <DETFAssetsTable tokens={productData ? productData.tokens : []} />}
                                    {isDETFActive && !isDETFDeposited && !productData && tableLoading}
                                    {!isDETFActive && props.final_assets_table_data && <DETFOwnedAssetsTable tokens={props.final_assets_table_data} vsPrices={props.vsPrices} currency={props.currency} />}
                                    {!isDETFActive && !props.final_assets_table_data && tableLoading}
                                </div>
                            </div>
                        </div>
                        <div className="account-table-expanded-content-proof-of-assets-mobile">
                            <img className="account-table-expanded-content-proof-of-assets-diamond-mobile" src={require("../../assets/images/silver_diamond.png")}></img>
                            <h2>Proof of assets</h2>
                            <p>Polybit’s DETFs are self-custodial, which means your assets are held in a smart contract that is controlled by your wallet and are not pooled or centralised. You can prove this at any time with the information below.</p>
                            <br />
                            <p><b>DETF Address:</b></p>
                            <p>{TruncateAddress(props.detf_address)}</p>
                            <p><b>DETF Owner Address:</b></p>
                            <p>{TruncateAddress(owner ? owner : "")}</p>
                            <br />
                            {chainId === "97" && <p><b><a href={`https://testnet.bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer">{`Validate this DETF's assets at BscScan ->`}</a></b></p>}
                            {chainId !== "97" && <p><b><a href={`https://bscscan.com/address/${props.detf_address}`} target="_blank" rel="noopener noreferrer">{`Validate this DETF's assets at BscScan ->`}</a></b></p>}
                        </div>
                    </div>
                }
            </div >
        </>
    )
}