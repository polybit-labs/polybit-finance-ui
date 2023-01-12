import { useAccount, useConnect, useDisconnect } from "wagmi"
import "./Connect.css"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { Button } from "./Button";

/* interface Connect {
    source: string;
} */

export const Connect = () => {
    /*     const navigate = useNavigate();
        const navToAccount = () => navigate("/account")
        const navToEstablishDETF = () => navigate("/establish-detf") */
    const { address, connector, isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect()
    const { disconnect } = useDisconnect({
        onError(error) {
            console.log('Error', error)
        }
    })

    /*     useEffect(() => {
            if (isConnected && props.source === "account") {
                navToAccount()
            }
            if (isConnected && props.source === "establish-detf") {
                navToEstablishDETF()
            }
        }, [isConnected]) */

    const coinbaseConnector = connectors[0]
    const metamaskConnector = connectors[1]
    const walletConnectConnector = connectors[2]

    return (
        <><div className="connect-provider">
            <div className="connect-provider-box">
                <img className="coinbase-logo" src={require("../assets/images/coinbase-logo.png")} alt="Connect to Coinbase"></img>
                {!coinbaseConnector.ready && <Button buttonStyle="primary" buttonSize="standard" status="disabled" text="Use Coinbase" />}
                {!isLoading && coinbaseConnector.ready && coinbaseConnector.id !== connector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Use Coinbase" onClick={() => connect({ connector: coinbaseConnector })} />}
                {isLoading && coinbaseConnector.id !== pendingConnector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Use Coinbase" />}
                {isLoading && coinbaseConnector.id === pendingConnector?.id && <Button buttonStyle="primary" buttonSize="standard" status="loading" text="Use Coinbase" />}
                {coinbaseConnector.id === connector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Connected" />}
            </div>
            <div className="connect-provider-box">
                <img className="metamask-logo" src={require("../assets/images/metamask-logo.png")} alt="Connect to MetaMask"></img>
                {!metamaskConnector.ready && <Button buttonStyle="primary" buttonSize="standard" status="disabled" text="Use MetaMask" />}
                {!isLoading && metamaskConnector.ready && metamaskConnector.id !== connector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Use MetaMask" onClick={() => connect({ connector: metamaskConnector })} />}
                {isLoading && metamaskConnector.id !== pendingConnector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Use MetaMask" />}
                {isLoading && metamaskConnector.id === pendingConnector?.id && <Button buttonStyle="primary" buttonSize="standard" status="loading" text="Use MetaMask" />}
                {metamaskConnector.id === connector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Connected" />}
            </div>
            <div className="connect-provider-box">
                <img className="walletconnect-logo" src={require("../assets/images/walletconnect-logo.png")} alt="Connect to WalletConnect"></img>
                {!walletConnectConnector.ready && <Button buttonStyle="primary" buttonSize="standard" status="disabled" text="Use WalletConnect" />}
                {!isLoading && walletConnectConnector.ready && walletConnectConnector.id !== connector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Use WalletConnect" onClick={() => connect({ connector: walletConnectConnector })} />}
                {isLoading && walletConnectConnector.id !== pendingConnector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Use WalletConnect" />}
                {isLoading && walletConnectConnector.id === pendingConnector?.id && <Button buttonStyle="primary" buttonSize="standard" status="loading" text="Use WalletConnect" />}
                {walletConnectConnector.id === connector?.id && <Button buttonStyle="primary" buttonSize="standard" text="Connected" />}
            </div>
        </div >
            <div className="connect-provider-notice">
                Wallets are provided by external providers and by selecting you agree to Terms of those Providers.&nbsp;
                {isConnected && <div className="disconnect-button" onClick={() => disconnect()}>Disconnect my wallet.</div>}
            </div>
        </>)
}