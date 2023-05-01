import { ERC20Token } from "../utils/ERC20Utils"

export const GetAssetLogo = (address: string, approvedList: Array<any>) => {
    let name: string = ""
    let logoURI: string = ""
    approvedList?.map((asset: ERC20Token) => {
        if (asset.address === address) {
            name = asset.name
            logoURI = asset.logoURI
        }
    })
    return [name, logoURI]
}