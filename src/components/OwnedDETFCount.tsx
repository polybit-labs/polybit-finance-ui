import { Interface } from "ethers/lib/utils"
import { useContractRead, useAccount } from "wagmi"
import PolybitDETFFactoryInterface from "../chain_info/IPolybitDETFFactory.json"
import map from "../chain_info/map.json"

export const OwnedDETFCount = () => {
    const detfFactoryAddress: string = map["5777"]["detf_factory"][0]
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
    const { address: walletOwner, connector, isConnected } = useAccount()

    const { data: ownedDETFs, isError, isLoading } = useContractRead({
        addressOrName: detfFactoryAddress,
        contractInterface: IPolybitDETFFactory,
        functionName: "getDETFAccounts",
        args: [walletOwner],
        onSuccess(data) {
            console.log('OwnedDETFCount Success', data.length)
            return data.length
        },
    })
}