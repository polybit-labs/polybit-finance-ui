import Footer from './Footer'
import "./Account.css"
import { truncateAddress } from '../../utils'
import { Link } from 'react-router-dom'

import {
    useAccount,
    useNetwork,
    useBalance,
    useConnect,
    useDisconnect,
    useEnsName,
} from "wagmi"
import AccountSummary from '../AccountSummary'

function Account() {
    const { address, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const { data } = useBalance({
        addressOrName: address,
    })
    console.log(chain?.name)
    const { data: ensName } = useEnsName({ address })
    if (isConnected) {
        return (
            <>
                <div className="account-title-section">
                    <div>
                        <h1>Account</h1>
                    </div>
                    <div>
                        <p>You are currently connected to <u>{truncateAddress(address ? address : "")}</u> on the {chain?.name} network via {connector?.name}. <Link to="/connect-wallet" className="account-switch-wallet">
                            <u>Switch wallet</u>.
                        </Link></p>
                    </div>
                </div>
                <div className="account-summary">
                    <div className="account-summary-container">
                        <div className="account-summary-wrapper">
                            <ul className="account-summary-items">
                                <li className="account-summary-item">
                                    <div className="portfolio-box-title">
                                        <div className="portfolio-box-title-text">Total portfolio worth</div>
                                        <div className="portfolio-box-title-context">As of datestamp</div></div>
                                    <div className="portfolio-box-balance">USD $921,021.16</div>
                                </li>
                                <li className="account-summary-item">
                                    <div className="return-box-title">
                                        <div><div className="return-box-title-text">Total return</div>
                                            <div className="return-box-title-context">As of datestamp</div></div>
                                        <div className="return-box-title-percentage">7.40%</div>
                                    </div>
                                    <div className="return-box-balance">USD $921,021.16</div>
                                </li>
                                <li className="account-summary-item">
                                    <div className="wallet-box-title">
                                        <div className="wallet-box-title-text">Available funds</div>
                                        <div className="wallet-box-title-context">in {connector?.name}</div></div>
                                    <div className="wallet-box-balance">{data?.symbol} {data?.formatted}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
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