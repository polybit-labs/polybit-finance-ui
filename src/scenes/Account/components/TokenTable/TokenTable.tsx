import { useEffect, useState } from "react"
import { GetTokenTransfers } from "../../../../components/api/GetTokenTransfers"
import "./TokenTable.css"
import { TokenTableRow } from "./TokenTableRow"
import { AccountTablePlaceholder } from "../AccountTable/AccountTablePlaceholder"
import { TokenTablePlaceholder } from "./TokenTablePlaceholder"

interface TokenTableProps {
    wallet_owner: string
    currency: string
    "vsPrices": {
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
    };
    setTotalDigitalAssetValue: Function;
    setTotalDigitalAssetReturn: Function;
}

export const TokenTable = (props: TokenTableProps) => {
    const { response: tokenTransfersData, isLoading, isSuccess: tokenTransfersDataSuccess } = GetTokenTransfers(props.wallet_owner)

    useEffect(() => {
        props.setTotalDigitalAssetValue(undefined)
        props.setTotalDigitalAssetReturn(undefined)
    }, [])

    useEffect(() => {
        if (tokenTransfersDataSuccess && tokenTransfersData) {
            props.setTotalDigitalAssetValue(tokenTransfersData.total_current_value)
            props.setTotalDigitalAssetReturn(tokenTransfersData.total_current_return)
        }
    }, [tokenTransfersDataSuccess, tokenTransfersData])

    if (tokenTransfersData && tokenTransfersData.tokens.length > 0) {
        return (
            <>
                <div className="token-table-container">
                    <div className="token-table-title">
                        <h1>Digital Assets</h1>
                    </div>
                    <div className="token-table-header">
                        <div className="token-table-header-item-asset">Asset</div>
                        <div className="token-table-header-item-value">Value</div>
                        <div className="token-table-header-item-price">Price</div>
                        <div className="token-table-header-item-return">Return</div>
                        <div className="token-table-header-item-cta"></div>
                    </div>
                    <div className="token-table-header-mobile">
                        <div className="token-table-header-item-asset-mobile">Asset</div>
                        <div className="token-table-header-item-value-mobile">Total Balance</div>
                        <div className="token-table-header-item-price-mobile">Price</div>
                        <div className="token-table-header-item-return-mobile">Return</div>
                        <div className="token-table-header-item-cta-mobile"></div>
                    </div>
                    <div>
                        {tokenTransfersData.tokens.map((data) =>
                            <div key={data.address}>
                                <TokenTableRow
                                    address={data.address}
                                    name={data.name}
                                    symbol={data.symbol}
                                    logoURI={data.logoURI}
                                    decimals={data.decimals}
                                    latest_price={data.latest_price}
                                    current_assets={data.current_assets}
                                    current_value={data.current_value}
                                    purchase_value={data.purchase_value}
                                    current_return={data.current_return}
                                    currency={props.currency}
                                    vsPrices={props.vsPrices}
                                />
                            </div>)}
                    </div>
                </div>
            </>
        )
    }
    if (tokenTransfersDataSuccess && tokenTransfersData && tokenTransfersData.tokens.length === 0) {
        return (
            <TokenTablePlaceholder />
        )
    }
    return (
        <div className="token-table-container">
            <div className="token-table-title">
                <h1>Digital Assets</h1>
            </div>
            <div>
                <div className="token-table-header">
                    <div className="token-table-header-item-asset">Asset</div>
                    <div className="token-table-header-item-value">Total Balance</div>
                    <div className="token-table-header-item-price" >Price</div>
                    <div className="token-table-header-item-return" >Return</div>
                    <div className="token-table-header-item-cta"></div>
                </div>
                <div className="token-table-header-mobile">
                    <div className="token-table-header-item-asset-mobile">Asset</div>
                    <div className="token-table-header-item-value-mobile">Total Balance</div>
                    <div className="token-table-header-item-price-mobile">Price</div>
                    <div className="token-table-header-item-return-mobile">Return</div>
                    <div className="token-table-header-item-cta-mobile"></div>
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