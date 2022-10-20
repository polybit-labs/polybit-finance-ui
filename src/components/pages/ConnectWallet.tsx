import "./ConnectWallet.css"
import Footer from './Footer'
import Title from "../Title"
import Connect from "../Connect"

function ConnectWallet() {


    return (
        <>
            <Title title="Select your source of funds" info="Polybit is non-custodial by design: we do not have any control over your cryptoasset wallets or your funds. Privacy and security is our priority: Polybit does not not store, send, or receive any cryptoassets on your behalf."
                switchButton={false} />
            <Connect />
            <Footer />

        </>
    )
}

export default ConnectWallet