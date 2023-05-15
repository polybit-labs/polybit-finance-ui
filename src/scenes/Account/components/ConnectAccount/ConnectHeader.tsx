import { Button } from "../../../../components/Buttons/Buttons"
import "./ConnectHeader.css"

interface ConnectHeaderProps {
    setShowConnect: Function;
    setShowBetaMessage: Function;
}
export const ConnectHeader = (props: ConnectHeaderProps) => {

    if (window.location.href.includes("polybit.finance")) {
        return (
            <div className="connect-header-container">
                <h2>You are not currently connected to a wallet. Please connect your wallet to access all of the features of this app.</h2>
                <Button text="Connect Wallet" buttonStyle="primary" buttonSize="standard" onClick={() => props.setShowBetaMessage(true)} />
            </div>
        )
    }

    return (
        <div className="connect-header-container">
            <h2>You are not currently connected to a wallet. Please connect your wallet to access all of the features of this app.</h2>
            <Button text="Connect Wallet" buttonStyle="primary" buttonSize="standard" onClick={() => props.setShowConnect(true)} />
        </div>
    )
}