import { Button } from "./Buttons"
import MainContainer from "./containers/Main"
import { Currencies, FormatCurrency } from "./utils/Currency"
import { ColourCategories, ColourNumbers, DETFIconFilename, FormatPercentages } from "./utils/Formatting"
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
    currentTotalValue: number;
    currentReturn: number;
    currentReturnPercentage: number;
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
    const currentTotalValueFormatted = FormatCurrency(props.currentTotalValue, 2)
    const currentReturnFormatted = FormatCurrency(props.currentReturn, 2)
    const currentReturnPercentageFormatted = FormatPercentages(props.currentReturnPercentage * 100)

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
                                    <img className="account-index-row-item-logo" src={require(`./../assets/icons/${DETFIconFilename(props.category, props.dimension)}`)}></img>
                                    <div className="account-index-row-item-name">
                                        <div className="account-index-row-item-category" style={{ color: ColourCategories(props.category) }}>
                                            {props.category}
                                            <div className="account-index-row-item-dimension" style={{ color: "#000000" }}>
                                                {props.dimension}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="close-detf-row-item-value">{currentTotalValueFormatted}</div>
                                <div className="close-detf-row-item-return" style={{ color: ColourNumbers(props.currentReturn) }}>{currentReturnFormatted}</div>
                                <div className="close-detf-row-item-return-percentage">{currentReturnPercentageFormatted}</div>
                            </div>
                        </div>
                    </div>
                    <div className="close-detf-button">
                        <Button buttonStyle="primary" buttonSize="standard" text="Confirm DETF exit" onClick={() => detfSellToClose?.()} />
                    </div>
                </div>
            </MainContainer>
        )
    }

    return (<></>)
}