
import { useEffect } from 'react'
import { TextLink } from '../Buttons'
import "./SwapSuccess.css"
import { ERC20Token } from '../utils/ERC20Utils';
import { useAccount } from 'wagmi';
import { TruncateAddress } from '../utils/Formatting';

interface SwapSuccessProps {
    tokenOne: ERC20Token;
    tokenTwo: ERC20Token;
    txHash: string;
    walletOwner: `0x${string}` | undefined
}

export const SwapSuccess = (props: SwapSuccessProps) => {
    const { address: walletOwner, connector, isConnected } = useAccount()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="swap-success">
            <img className="swap-success-tick" src={require("../../assets/icons/success_tick.png")}></img>
            <div className="swap-success-text">Your swap has been successful</div>
            <div className="swap-success-detailed">{`Your ${props.tokenTwo.symbol} is now available in your `}
                {connector?.name === "MetaMask" && <img width="20px" height="20px" src={require("../../assets/images/metamask_icon.png")} />}
                {connector?.name === "Coinbase Wallet" && <img width="20px" height="20px" src={require("../../assets/images/coinbasewallet_icon.png")} />}
                {connector?.name === "WalletConnect" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
                {connector?.name === "WalletConnectLegacy" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} />}
                {` wallet ${TruncateAddress(props.walletOwner as string)}. `}
                {<a href={`https://bscscan.com/tx/${props.txHash}`} target="_blank" rel="noopener noreferrer">{`View your transaction record.`}</a>}
            </div>
            <TextLink to="/account" text="View my account" arrowDirection="forward" />
        </div>
    )
}