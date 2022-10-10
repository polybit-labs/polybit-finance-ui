import React from 'react'
import { Button } from '../Button'
import "./ConnectWallet.css"
import Footer from './Footer'

export interface ConnectWalletProps {
    returnPath: string
}

function ConnectWallet({ returnPath }: ConnectWalletProps) {
    const thing = returnPath
    return (
        <>
            <div className="title-section">
                <div>
                    <h1>Select your source of funds</h1>
                </div>
                <div>
                    <p>Polybit is non-custodial by design: we do not have any control over your cryptoasset wallets or your funds. Privacy and security is our priority: Polybit does not not store, send, or receive any cryptoassets on your behalf.</p>
                </div>
                <div className="title-info-link">
                    <p>Learn more about Polybit technology and policies</p></div>
            </div>
            <div className="connect-provider">
                <div className="connect-provider-box">
                    <div><img className="coinbase-logo" src={require("../../assets/images/coinbase-logo.png")} alt="Connect to Coinbase"></img></div>
                    <div><Button text="Use Coinbase" type="button" onClick="" buttonSize="btn--large" buttonStyle="btn--filled" /></div>
                </div>
                <div className="connect-provider-box">
                    <div>
                        <img className="metamask-logo" src={require("../../assets/images/metamask-logo.png")} alt="Connect to MetaMask"></img></div>
                    <div><Button text="Use MetaMask" type="button" onClick="" buttonSize="btn--large" buttonStyle="btn--primary" /></div>
                </div>
                <div className="connect-provider-box">
                    <div>
                        <img className="walletconnect-logo" src={require("../../assets/images/walletconnect-logo.png")} alt="Connect to WalletConnect"></img>
                    </div>
                    <div><Button text="Use WalletConnect" type="button" onClick="" buttonSize="btn--large" buttonStyle="btn--primary" /></div>
                </div>
            </div>
            <div className="connect-provider-notice"><p>Wallets are provided by external providers and by selecting you agree to Terms of those Providers.</p></div>
            <Footer />

        </>
    )
}

export default ConnectWallet