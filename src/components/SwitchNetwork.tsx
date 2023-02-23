import { useEffect } from 'react'
import { useSwitchNetwork, useDisconnect } from 'wagmi'
import { Button, TextLink } from './Buttons'
import MainContainer from './containers/Main'
import Footer from './pages/Footer'
import "./SwitchNetwork.css"

export const SwitchNetwork = () => {
    const { disconnect } = useDisconnect()
    const { chains, error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork()
    useEffect(() => {
        //Reset view on component load
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <MainContainer>
                <div className="switch-network">
                    <img className="switch-network-warning" height="120px" width="120px" src={require("./../assets/icons/warning_large.png")}></img>
                    <div className="switch-network-text">Currently, Polybit is only supported on the BNB Smart Chain. Please switch your network to continue.</div>
                    <div className="switch-network-button-wrapper">
                        {switchNetwork && <Button buttonStyle="primary" buttonSize="standard" text="Switch network in wallet" onClick={() => switchNetwork?.(97)} />}
                        {!switchNetwork && <Button buttonStyle="primary" buttonSize="standard" text="Switch network in wallet" status="disabled" />}
                    </div>
                    <TextLink to="/" text="Disconnect wallet and return home" onClick={() => disconnect()} arrowDirection="back" />
                </div>
            </MainContainer>
            <Footer />
        </>
    )
}