import { Link } from 'react-router-dom'
import { useSwitchNetwork, useDisconnect } from 'wagmi'
import { Button, TextLink } from './Buttons'
import MainContainer from './containers/Main'
import "./SwitchNetwork.css"

export const SwitchNetwork = () => {
    const { disconnect } = useDisconnect()
    const { chains, error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork()

    return (
        <MainContainer>
            <div className="switch-network">
                <img className="switch-network-warning" height="120px" width="120px" src={require("./../assets/icons/warning_large.png")}></img>
                <div className="switch-network-text">Currently, Polybit is only supported on the BNB Smart Chain. Please switch your network to continue.</div>
                <div>
                    {switchNetwork && <Button buttonStyle="primary" buttonSize="standard" text="Switch network in wallet" onClick={() => switchNetwork?.(97)} />}
                    {!switchNetwork && <Button buttonStyle="primary" buttonSize="standard" text="Switch network in wallet" status="disabled" />}
                </div>
                <TextLink to="/" text="Disconnect wallet and return home" onClick={() => disconnect()} arrowDirection="back" />
            </div>
        </MainContainer>
    )
}