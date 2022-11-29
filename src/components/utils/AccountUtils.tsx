import { GetListOfOwnedDETFs } from "./DETFFactoryUtils"
import { GetOwnedAssets, GetOwnedAssetsPrices, GetTotalBalanceInWeth, GetTotalDeposited } from "./DETFUtils"

export const GetTotalAccountDeposits = (ownedDETFs: Array<string>) => {
    console.log("here", ownedDETFs)
    let deposits = 0

    ownedDETFs!.map((detfAddress: string) => {
        let deposit: string = GetTotalDeposited(detfAddress)
        deposits = deposits + Number(deposit)
    })

    return deposits > 0 ? deposits : 0
}

export const GetTotalPortfolioWorth = (data: any) => {
    let totalBalance = 0
    let ownedDETFs: Array<string> = data ? data : []

    ownedDETFs && ownedDETFs?.map((detfAddress, index) => {
        totalBalance = totalBalance + Number(GetTotalBalanceInWeth(detfAddress, GetOwnedAssetsPrices(GetOwnedAssets(detfAddress))))
    })
    return totalBalance
}

