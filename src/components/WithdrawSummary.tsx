import { Button } from "./Button"
import MainContainer from "./containers/Main"
import { Currencies, FormatCurrency } from "./utils/Currency"
import { ColourCategories, ColourNumbers } from "./utils/Formatting"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { GetSellToCloseOrderData } from "./api/GetSellToCloseOrderData"
import PolybitDETFInterface from "./../chain_info/IPolybitDETF.json"
import { Interface } from 'ethers/lib/utils'
import { Loading } from "./Loading"

interface WithdrawSummary {
    detfAddress: string;
    category: string;
    dimension: string;
    totalValue: string;
    totalDeposited: string;
    returnPercentage: number;
    currency: string;
    vsPrices: Currencies;
    setWithdrawSuccess: Function
}

export const WithdrawSummary = (props: WithdrawSummary) => {
    const IPolybitDETF = new Interface(PolybitDETFInterface)
    const { response: orderData, isLoading: orderDataLoading, isSuccess: orderDataSuccess } = GetSellToCloseOrderData(props.detfAddress)
    const { config: detfSellToCloseConfig, error: detfSellToCloseError, isSuccess: prepareContractWriteSuccess } = usePrepareContractWrite({
        addressOrName: props.detfAddress,
        contractInterface: IPolybitDETF,
        functionName: 'sellToClose',
        args: [orderData],
        onError(error) {
            console.log('detfSellToClose Error', error)
        },
        onSuccess(data) {
            console.log('detfSellToClose Success', data)
        },
    })
    const { data, isLoading, isSuccess, write: detfSellToClose } = useContractWrite(detfSellToCloseConfig)
    const { data: waitForTransaction, isError: transactionError, isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            console.log(data)
            props.setWithdrawSuccess(true)
        }
    })

    if (!prepareContractWriteSuccess) {
        return (
            <Loading loadingMsg="Preparing your withdrawal" />
        )
    }

    if (prepareContractWriteSuccess) {
        return (
            <MainContainer>
                <div className="close-table-container">
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

    return (<></>)
}