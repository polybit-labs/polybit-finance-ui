import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFFactoryInterface from "../../chain-info/IPolybitDETFFactory.json"
import map from "../../chain-info/map.json"

const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
const detfFactoryAddress: string = map["5777"]["detf_factory"][0]

export const GetDepositFee = (chainId: number) => {
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
    const detfFactoryAddress: Array<string> = map["5777"]["detf_factory"]

    const { data } = useContractRead({
        addressOrName: detfFactoryAddress[0],
        contractInterface: IPolybitDETFFactory,
        functionName: "getDepositFee",
        chainId: chainId
    })
    if (data) { return data } else { return 0 }
}

export const GetListOfOwnedDETFs = (walletOwner: string) => {
    let ownedDETFs: Array<string> = []

    const { data, isError, isLoading, isSuccess } = useContractRead({
        addressOrName: detfFactoryAddress,
        contractInterface: IPolybitDETFFactory,
        functionName: "getDETFAccounts",
        args: [walletOwner],
        onError(error) {
            console.log('getDETFAccounts Error', error)
        },
        onSuccess(data) {
            console.log('getDETFAccounts Success', data)
        },
    })

    if (isSuccess) {
        data!.map((address) => {
            ownedDETFs.push(address)
        })
    }

    return ownedDETFs
}