import { useAccount, useNetwork } from "wagmi"
import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFFactoryInterface from "../chain_info/IPolybitDETFFactory.json"
import map from "../chain_info/map.json"
import { Rebalancer } from "./Rebalancer"
import { Flask } from "./Flask"


export function AvailableDETFs() {
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
    const detfFactoryAddress: string = map["5777"]["detf_factory"][0]
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const array = Array(10)
    let ownedDETFsData: Array<string> = Array(10)

    const { data: ownedDETFs, isError, isLoading, isSuccess } = useContractRead({
        addressOrName: detfFactoryAddress,
        contractInterface: IPolybitDETFFactory,
        functionName: "getDETFAccounts",
        args: [walletOwner],
    })

    if (isSuccess && ownedDETFs) {
        let index = 0
        ownedDETFs.map((address) => {
            ownedDETFsData[index] = address
            index++
        })
    }


    //"0x4D9De6e0d0D956e0FD2fEE0b27f3B9aec5A9FAb7" 
    //"0x395f090d100a3df563a13e94f549d7B6Be9cFe8a"
    //"0x2B722190dfb54b7E94Aa9a3460e7772ee55AA087"
    //"0xEaA68d32FdcdC94f04E8Ada9914a9c5f8bC11545"
    //"0x35EfcC904EB9d853FFcf7Fe91D6e8681B6D9D218"
    //"0xBe7985A4c9004CCF8b05a288bF10e5F87296f10a"

    console.log("addresses", ownedDETFsData)
    let detfAddress = ownedDETFsData[0]

    return (
        <>
            {/* <Rebalancer detfAddress={"0x35EfcC904EB9d853FFcf7Fe91D6e8681B6D9D218"} /> */}
            <Flask />
            <div>

            </div >
        </>
    )
}

