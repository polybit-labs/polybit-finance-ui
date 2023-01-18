import { Button } from "./Button";
import MainContainer from "./containers/Main";
import { Currencies, FormatCurrency } from "./utils/Currency";
import { ColourCategories, ColourNumbers } from "./utils/Formatting";
import { GetTimeToUnlock } from "./utils/TimeLock";
import { useState } from "react"
import { useContractWrite, useWaitForTransaction } from "wagmi";

interface WithdrawSummary {
    detfAddress: string;
    category: string;
    dimension: string;
    totalValue: string;
    totalDeposited: string;
    returnPercentage: number;
    currency: string;
    vsPrices: Currencies;
    detfSellToCloseConfig: any;
}

export const WithdrawSummary = (props: WithdrawSummary) => {
    const [sellToCloseSuccess, setSellToCloseSuccess] = useState(false)
    const { data, isLoading, isSuccess, write: detfSellToClose } = useContractWrite(props.detfSellToCloseConfig)
    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            console.log(data)
            setSellToCloseSuccess(true)
        }
    })

    return (
        <MainContainer>
            <div className={!sellToCloseSuccess ? "close-table-container" : "close-table-container-inactive"}>
                <div className="close-detf-container">
                    <div className="close-detf-header">
                        <div className="close-detf-header-item-detf" >DETF</div>
                        <div className="close-detf-header-item-value" >Market Value</div>
                        <div className="close-detf-header-item-return" >Return</div>
                        <div className="close-detf-header-item-return-percentage" >Return (%)</div>
                    </div>
                    <div className="close-detf-row">
                        <div className="close-detf-row-items">
                            <div className="close-detf-row-item-detf">
                                <div className="account-index-row-item-name">
                                    <div className="account-index-row-item-category" style={{ color: ColourCategories(props.category) }}>
                                        {props.category}
                                        <div className="account-index-row-item-dimension" style={{ color: "#000000" }}>
                                            {props.dimension}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="close-detf-row-item-value">
                                {FormatCurrency((Number(props.totalValue)
                                    / 10 ** 18 *
                                    Number((() => {
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
                                    })())), 2)}</div>
                            <div className="close-detf-row-item-return">{FormatCurrency((Number(props.totalValue) - Number(props.totalDeposited))
                                / 10 ** 18 *
                                Number((() => {
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
                                })()), 2)}</div>
                            <div className="close-detf-row-item-return-percentage" style={{ color: ColourNumbers(props.returnPercentage) }}> {parseFloat((props.returnPercentage).toString()).toFixed(2) + "%"}</div>
                        </div>
                    </div>
                </div>
                <Button buttonStyle="primary" buttonSize="standard" text="Confirm DETF exit" onClick={() => detfSellToClose?.()} />
            </div>
        </MainContainer>
    )
}