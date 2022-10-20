import "./ConnectWallet.css"
import Footer from './Footer'
import {
    useAccount,
    useNetwork,
    useBalance,
    useConnect,
    useDisconnect,
} from "wagmi"
import Title from "../Title"

export interface ConnectWalletProps {
    returnPath: string
}

function ConnectWallet({ returnPath }: ConnectWalletProps) {
    const { address, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const { data } = useBalance({
        addressOrName: address,
    })
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect()
    const { disconnect } = useDisconnect({
        onError(error) {
            console.log('Error', error)
        }
    })
    const coinbaseConnector = connectors[0]
    const metamaskConnector = connectors[1]
    const walletConnectConnector = connectors[2]

    return (
        <>
            <Title title="Select your source of funds" info="Polybit is non-custodial by design: we do not have any control over your cryptoasset wallets or your funds. Privacy and security is our priority: Polybit does not not store, send, or receive any cryptoassets on your behalf."
                switchButton={false} />
            <div className="connect-provider">
                <div className="connect-provider-box">
                    <div><img className="coinbase-logo" src={require("../../assets/images/coinbase-logo.png")} alt="Connect to Coinbase"></img></div>
                    <div><button className="connect-wallet-button-primary" disabled={!coinbaseConnector.ready}
                        key={coinbaseConnector.id}
                        onClick={() => connect({ connector: coinbaseConnector })}>{coinbaseConnector.id !== connector?.id &&
                            "Use Coinbase"}
                        {!coinbaseConnector.ready && ' (unsupported)'}
                        {/* {isLoading &&
                            coinbaseConnector.id === pendingConnector?.id &&
                            '...'} */}
                        {coinbaseConnector.id === connector?.id &&
                            'Connected'}</button>
                    </div>
                </div>
                <div className="connect-provider-box">
                    <div>
                        <img className="metamask-logo" src={require("../../assets/images/metamask-logo.png")} alt="Connect to MetaMask"></img></div>
                    <div>
                        <button className="connect-wallet-button-secondary" disabled={!metamaskConnector.ready}
                            key={metamaskConnector.id}
                            onClick={() => connect({ connector: metamaskConnector })}>{metamaskConnector.id !== connector?.id &&
                                "Use MetaMask"}
                            {!metamaskConnector.ready && ' (unsupported)'}
                            {/* {isLoading &&
                                metamaskConnector.id === pendingConnector?.id &&
                                '...'} */}
                            {metamaskConnector.id === connector?.id &&
                                'Connected'}</button>
                    </div>
                </div>
                <div className="connect-provider-box">
                    <div>
                        <img className="walletconnect-logo" src={require("../../assets/images/walletconnect-logo.png")} alt="Connect to WalletConnect"></img>
                    </div>
                    <div>
                        <button className="connect-wallet-button-secondary" disabled={!walletConnectConnector.ready}
                            key={walletConnectConnector.id}
                            onClick={() => connect({ connector: walletConnectConnector })}>{walletConnectConnector.id !== connector?.id &&
                                "Use WalletConnect"}
                            {!walletConnectConnector.ready && ' (unsupported)'}
                            {/* {isLoading &&
                                walletConnectConnector.id === pendingConnector?.id &&
                                '...'} */}
                            {walletConnectConnector.id === connector?.id &&
                                'Connected'}</button>
                    </div>
                </div>
            </div>
            <div className="connect-provider-notice">
                <p>Wallets are provided by external providers and by selecting you agree to Terms of those Providers.&nbsp;
                    <button className="disconnect-button" onClick={() => disconnect()}>Disconnect my wallets.</button></p>
            </div>
            <Footer />

        </>
    )
}

export default ConnectWallet