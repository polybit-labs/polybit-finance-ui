import Footer from './Footer'
import { truncateAddress } from '../../utils'
import { Link, useLocation } from 'react-router-dom'
import {
    useAccount,
    useNetwork
} from "wagmi"
import AccountTable from '../AccountTable'
import Title from '../Title'
import { useEffect, useState } from 'react'
import AccountSummary from '../AccountSummary'
import { GetListOfOwnedDETFs } from '../utils/DETFFactoryUtils'
import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFFactoryInterface from "../../chain-info/IPolybitDETFFactory.json"
import map from "../../chain-info/map.json"
import { GetOwnedAssets, GetOwnedAssetsPrices, GetTotalBalanceInWeth, GetTotalDeposited } from '../utils/DETFUtils'

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
                {/* <AccountSummary totalDeposited={totalDeposited} totalPortfolioWorth={totalPortfolioWorth} totalReturn={totalReturn} totalReturnPercentage={totalReturnPercentage} /> */}
                <AccountSummary data={ownedDETFsData} />
                {/* <AccountTable data={ownedDETFs} /> */}
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