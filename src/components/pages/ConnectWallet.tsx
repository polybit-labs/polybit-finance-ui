import "./ConnectWallet.css"
import Footer from './Footer'
import TitleContainer from "../containers/Title"
import SubTitleContainer from "../containers/SubTitle"
import Connect from "../Connect"
import MainContainer from "../containers/Main"
function ConnectWallet() {


    return (
        <>
            <TitleContainer title="Select your source of funds" />
            <SubTitleContainer info="Polybit is non-custodial by design: we do not have any control over your cryptoasset wallets or your funds. Privacy and security is our priority: Polybit does not not store, send, or receive any cryptoassets on your behalf." />
            <MainContainer>
                <Connect />
            </MainContainer>
            <Footer />

        </>
    )
}

export default ConnectWallet