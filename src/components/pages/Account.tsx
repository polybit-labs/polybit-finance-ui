import Footer from './Footer'
import { truncateAddress } from '../../utils'
import { Link } from 'react-router-dom'
import {
    useAccount,
    useNetwork
} from "wagmi"
import AccountTable from '../AccountTable'
import Title from '../Title'
import AccountSummary from '../AccountSummary'
import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFFactoryInterface from "../../chain_info/IPolybitDETFFactory.json"
import map from "../../chain_info/map.json"

const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
const detfFactoryAddress: string = map["5777"]["detf_factory"][0]

const Account = () => {
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const array = Array(10)
    console.log(array)
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

    if (isConnected) {
        return (
            <>
                <Title title="Account" info={`You are currently connected to ${truncateAddress(walletOwner ? walletOwner : "")} on the ${chain?.name} network via ${connector?.name}.`}
                    switchButton={true} />
                <AccountSummary data={ownedDETFsData} />
                <AccountTable data={ownedDETFsData} />
                <Footer />
            </>
        )
    }

    return (
        <>
            <div className="account-title-section">
                <div>
                    <h1>Account</h1>
                </div>
                <div>
                    <p>You are not currently connected to a crypto wallet. <Link to="/connect-wallet" className="account-switch-wallet">
                        <u>Connect wallet</u>.
                    </Link></p>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Account