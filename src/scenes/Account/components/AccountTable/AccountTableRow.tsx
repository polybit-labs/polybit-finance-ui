import { Link } from "react-router-dom"
import "./AccountTableRow.css"
import { useEffect, useState } from "react"
import { DETFOwnedAssetsTable } from "../../../../components/DETFOwnedAssetsTable"
import { Currencies, FormatCurrency } from "../../../../components/utils/Currency"
import { ColourCategories, ColourNumbers, DETFIconFilename, FormatPercentages } from "../../../../components/utils/Formatting"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { GetPerformanceDataRange, PerformanceDataRange } from "../../../../components/api/GetPerformanceDataRange"
import { InvalidChartRange } from "../../../../components/charts/InvalidChartRange"
import { DETFReturnChart } from "../../../../components/charts/DETFReturnChart"
import { GetProductData, ProductData } from "../../../../components/api/GetProductData"
import { DETFAssetsTable } from "../../../../components/DETFAssetsTable"
import { Button } from "../../../../components/Buttons/Buttons"
import { useNetwork } from "wagmi"
import { TruncateAddress } from "../../../../components/utils/Formatting"
import { BigNumber } from "ethers"

type AccountTableRowItems = {
    walletOwner: `0x${string}`;
    theme_contract_address: string;
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
    final_balance_in_weth: BigNumber;
    final_assets: Array<string>;
    final_assets_prices: Array<BigNumber>;
    final_assets_balances: Array<BigNumber>;
    final_assets_balances_in_weth: BigNumber;
    final_assets_table_data: Array<any>;
    total_purchase_value_currency_adjusted: number;
    total_current_value_currency_adjusted: number;
    total_current_return_currency_adjusted: number;
    total_final_value_currency_adjusted: number;
    total_final_return_currency_adjusted: number;
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

    const totalPurchaseValueCurrencyAdjusted: string = FormatCurrency(props.total_purchase_value_currency_adjusted, 2)
    const totalCurrentValueCurrencyAdjustedFormatted: string = FormatCurrency(props.total_current_value_currency_adjusted, 2)
    const totalCurrentReturnAmountCurrencyAdjustedFormatted: string = FormatCurrency(props.total_current_value_currency_adjusted - props.total_purchase_value_currency_adjusted, 2)
    const totalFinalValueCurrencyAdjusted: string = FormatCurrency(props.total_final_value_currency_adjusted, 2)
    const totalFinalReturnAmountCurrencyAdjustedFormatted: string = FormatCurrency(props.total_final_value_currency_adjusted - props.total_purchase_value_currency_adjusted, 2)

    const transactionHistory = <table className="transaction-history" >
        <tbody>
            {props.transactions?.map((transaction) => {
                return (
                    <tr key={transaction}>
                        <td><p>{moment.unix(transaction[0]).local().format("D MMM YYYY")}</p></td>
                        <td>
                            {transaction[2] === "Deposit" && <p>+{FormatCurrency(transaction[1], 2)}</p>
                            }
                            {transaction[2] === "Fee" && <p>-{FormatCurrency(transaction[1], 2)?.replaceAll("-", "")}</p>
                            }</td>
                        <td><p>{transaction[2]}</p></td>
                    </tr>)
            })}
            {!isDETFActive && <tr>
                <td><p>{moment.unix(props.close_timestamp).local().format("D MMM YYYY")}</p></td>
                <td><p>-{totalFinalValueCurrencyAdjusted}</p></td>
                <td><p>Withdraw</p></td>
            </tr>}
        </tbody>
    </table >
    const timeLock = moment.unix(props.time_lock).local().format("D MMM YYYY hh:mm")
    const tableLoading = <div className="table-loading">
        <img height="60px" width="60px" src={require("../../../../assets/images/polybit-loader-black-on-light-grey-60px.gif")} alt="Loading"></img>
    </div>

    return (
        <>
            <div className="account-table-row">
                <div className="account-table-row-items">
                    <div className="account-table-row-item-detf" onClick={() => setIsActive(!isActive)} >
                        <img className="account-table-row-item-logo" src={require(`../../../../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
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
                        {totalCurrentValueCurrencyAdjustedFormatted}
                    </div>
                    {isDETFActive && <div className="account-table-row-item-return" >{FormatPercentages(props.total_current_return_currency_adjusted * 100)}</div>}
                    {!isDETFActive && <div className="account-table-row-item-return" >{FormatPercentages(props.total_final_return_currency_adjusted * 100)}</div>}
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
                            theme_contract_address: props.theme_contract_address,
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
                                    {isDETFActive && <h2>Total invested: {totalPurchaseValueCurrencyAdjusted}</h2>}
                                    {!isDETFActive && <h2>Total invested: {totalPurchaseValueCurrencyAdjusted}</h2>}
                                    {isDETFDeposited && <div className="account-table-expanded-content-left-invested-summary">
                                        <div className="account-table-expanded-content-left-invested-summary-line">
                                        </div>
                                        <div className="account-table-expanded-content-left-invested-summary-table">
                                            <p><b>Transaction history</b></p>
                                            {transactionHistory}
                                        </div>
                                    </div>}
                                    {!isDETFDeposited && <div className="account-table-expanded-content-left-invested-no-deposits">
                                        <img className="account-table-expanded-content-left-invested-no-deposits-icon" src={require("../../../../assets/icons/info_dark_grey.png")}></img>
                                        <p>You have not yet invested into this DETF.</p></div>}
                                </div>
                                {isDETFActive && !isDETFDeposited &&
                                    <div className="account-table-expanded-content-left-deposit">
                                        <Link className="account-table-row-item-link" to="/deposit" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            theme_contract_address: props.theme_contract_address,
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
                                            theme_contract_address: props.theme_contract_address,
                                            processOrigin: "deposit",
                                            activeStage: 1
                                        }}>
                                            <Button text="Top up investment" buttonStyle="primary" buttonSize="standard" /></Link>
                                    </div>}
                                <div className="account-table-expanded-content-left-current-value">
                                    {isDETFActive && <h2>Total market value: {totalCurrentValueCurrencyAdjustedFormatted} ({totalCurrentReturnAmountCurrencyAdjustedFormatted})</h2>}
                                    {!isDETFActive && <h2>Final market value: {totalFinalValueCurrencyAdjusted} ({totalFinalReturnAmountCurrencyAdjustedFormatted})</h2>}
                                    <div className="account-table-chart-title"><p><b>Market value over time ({props.currency})</b></p></div>
                                    {validDateRange && <DETFReturnChart height={300} width="100%" performanceData={performanceData} />}
                                    {!validDateRange && <InvalidChartRange height={300} width="100%" />}
                                </div>
                                <div className="account-table-expanded-content-left-close">
                                    {isDETFActive && isDETFDeposited && !isDETFTimeLocked &&
                                        < Link className="account-table-row-item-link" to="/close-detf" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            detfAddress: props.theme_contract_address,
                                            totalValue: props.balance_in_weth,
                                            currentTotalValue: props.total_current_value_currency_adjusted,
                                            currentReturn: props.total_current_value_currency_adjusted - props.total_purchase_value_currency_adjusted,
                                            currentReturnPercentage: props.total_current_return_currency_adjusted * 100,
                                            currency: props.currency,
                                            vsPrices: props.vsPrices,
                                            totalDeposited: props.total_purchase_value_currency_adjusted
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
                                    <p>Polybit’s Investment Themes are self-custodial, which means your assets are held in a smart contract that is controlled by your wallet and are not pooled or centralised. You can prove this at any time with the information below.</p>
                                    <br />
                                    <p><b>Theme Contract Address:</b></p>
                                    {chainId === "97" && <a href={`https://testnet.bscscan.com/address/${props.theme_contract_address}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.theme_contract_address)}</p></a>}
                                    {chainId === "56" && <a href={`https://bscscan.com/address/${props.theme_contract_address}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.theme_contract_address)}</p></a>}
                                    <p><b>Owner Address:</b></p>
                                    {chainId === "97" && <a href={`https://testnet.bscscan.com/address/${props.walletOwner}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.walletOwner)}</p></a>}
                                    {chainId === "56" && <a href={`https://bscscan.com/address/${props.walletOwner}`} target="_blank" rel="noopener noreferrer"><p>{TruncateAddress(props.walletOwner)}</p></a>}
                                    <br />
                                    {chainId === "97" && <p><b><a href={`https://testnet.bscscan.com/address/${props.theme_contract_address}`} target="_blank" rel="noopener noreferrer">{`Validate your assets at BscScan ->`}</a></b></p>}
                                    {chainId === "56" && <p><b><a href={`https://bscscan.com/address/${props.theme_contract_address}`} target="_blank" rel="noopener noreferrer">{`Validate your assets at BscScan ->`}</a></b></p>}
                                    <img className="account-table-expanded-content-right-proof-of-assets-diamond" src={require("../../../../assets/images/silver_diamond.png")}></img>
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
                            <img className="account-table-row-item-logo-mobile" src={require(`../../../../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
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
                                <td className="account-table-row-item-table-cell-mobile">{totalCurrentValueCurrencyAdjustedFormatted}</td>
                            </tr>
                            <tr>
                                <td className="account-table-row-item-table-header-mobile">Return:</td>
                                {isDETFActive && <td className="account-table-row-item-table-cell-mobile" style={{ color: ColourNumbers(props.total_current_return_currency_adjusted) }}>{FormatPercentages(props.total_current_return_currency_adjusted * 100)}</td>}
                                {!isDETFActive && <td className="account-table-row-item-table-cell-mobile" style={{ color: ColourNumbers(props.total_final_return_currency_adjusted) }}>{FormatPercentages(props.total_final_return_currency_adjusted * 100)}</td>}
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
                                        <h2>{totalPurchaseValueCurrencyAdjusted}</h2>
                                    </div>}
                                    {!isDETFActive && <div><h2>Total invested:</h2>
                                        <h2>{totalPurchaseValueCurrencyAdjusted}</h2>
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
                                        <img className="account-table-expanded-content-invested-no-deposits-icon-mobile" src={require("../../../../assets/icons/info_dark_grey.png")}></img>
                                        <p>You have not yet deposited into this DETF.</p></div>}
                                </div>
                                {isDETFActive && !isDETFDeposited &&
                                    <div className="account-table-expanded-content-deposit-mobile">
                                        <Link className="account-table-row-item-link" to="/deposit" state={{
                                            category: props.category,
                                            dimension: props.dimension,
                                            theme_contract_address: props.theme_contract_address,
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
                                            theme_contract_address: props.theme_contract_address,
                                            processOrigin: "deposit",
                                            activeStage: 1
                                        }}>
                                            <Button text="Top up investment" buttonStyle="primary" buttonSize="standard" /></Link>
                                    </div>}
                                <div className="account-table-expanded-content-current-value-mobile">
                                    {isDETFActive && <div><h2>Total market value:</h2>
                                        <h2>{totalCurrentValueCurrencyAdjustedFormatted} ({totalCurrentReturnAmountCurrencyAdjustedFormatted})</h2>
                                    </div>}
                                    {!isDETFActive && <div><h2>Final market value:</h2>
                                        <h2>{totalFinalValueCurrencyAdjusted} ({totalFinalReturnAmountCurrencyAdjustedFormatted})</h2>
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
                                            detfAddress: props.theme_contract_address,
                                            totalValue: props.balance_in_weth,
                                            currentTotalValue: props.total_current_value_currency_adjusted,
                                            currentReturn: props.total_current_value_currency_adjusted - props.total_purchase_value_currency_adjusted,
                                            currentReturnPercentage: props.total_current_return_currency_adjusted * 100,
                                            currency: props.currency,
                                            vsPrices: props.vsPrices,
                                            totalDeposited: props.total_purchase_value_currency_adjusted
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
                            <img className="account-table-expanded-content-proof-of-assets-diamond-mobile" src={require("../../../../assets/images/silver_diamond.png")}></img>
                            <h2>Proof of assets</h2>
                            <p>Polybit’s Investment Themes are self-custodial, which means your assets are held in a smart contract that is controlled by your wallet and are not pooled or centralised. You can prove this at any time with the information below.</p>
                            <br />
                            <p><b>Theme Contract Address:</b></p>
                            <p>{TruncateAddress(props.theme_contract_address)}</p>
                            <p><b>Owner Address:</b></p>
                            <p>{TruncateAddress(props.walletOwner)}</p>
                            <br />
                            {chainId === "97" && <p><b><a href={`https://testnet.bscscan.com/address/${props.theme_contract_address}`} target="_blank" rel="noopener noreferrer">{`Validate your assets at BscScan ->`}</a></b></p>}
                            {chainId === "56" && <p><b><a href={`https://bscscan.com/address/${props.theme_contract_address}`} target="_blank" rel="noopener noreferrer">{`Validate your assets at BscScan ->`}</a></b></p>}
                        </div>
                    </div>
                }
            </div >
        </>
    )
}