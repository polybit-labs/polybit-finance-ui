import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFFactoryInterface from "../../chain-info/IPolybitDETFFactory.json"
import map from "../../chain-info/map.json"

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