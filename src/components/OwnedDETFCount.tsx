import { Interface } from "ethers/lib/utils"
import { useContractRead, useAccount } from "wagmi"
import PolybitDETFFactoryInterface from "../chain-info/IPolybitDETFFactory.json"
import map from "../chain-info/map.json"

export const OwnedDETFCount = () => {
    const detfFactoryAddress: Array<string> = map["5777"]["detf_factory"]
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
    const { address: walletOwner, connector, isConnected } = useAccount()

    const { data: ownedDETFs, isError, isLoading } = useContractRead({
        addressOrName: detfFactoryAddress[0],
        contractInterface: IPolybitDETFFactory,
        functionName: "getDETFAccounts",
        args: [walletOwner],
    })

    const detfCount = ownedDETFs ? ownedDETFs.length : 0

    if (isConnected) {
        return (
            detfCount
        )
    }
    return 0
}