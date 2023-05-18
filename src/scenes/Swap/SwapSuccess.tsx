
import { useEffect } from 'react'
import { TextLink } from '../../components/Buttons/TextLink';
import "./SwapSuccess.css"
import { ERC20Token } from '../../components/utils/ERC20Utils';
import { useAccount } from 'wagmi';
import { TruncateAddress } from '../../components/utils/Formatting';

interface SwapSuccessProps {
    tokenOne: ERC20Token;
    tokenTwo: ERC20Token;
    txHash: string;
    walletOwner: `0x${string}` | undefined
}

export const SwapSuccess = (props: SwapSuccessProps) => {
    const { connector } = useAccount()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="swap-success">
            <img className="swap-success-tick" src={require("../../assets/icons/success_tick.png")} alt="success-tick"></img>
            <div className="swap-success-text">Your swap has been successful</div>
            <div className="swap-success-detailed">{`Your ${props.tokenTwo.symbol} is now available in your `}
                {connector?.name === "MetaMask" && <img width="20px" height="20px" src={require("../../assets/images/metamask_icon.png")} alt="MetaMask" />}
                {connector?.name === "Coinbase Wallet" && <img width="20px" height="20px" src={require("../../assets/images/coinbasewallet_icon.png")} alt="Coinbase Wallet" />}
                {connector?.name === "WalletConnect" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} alt="WalletConnect" />}
                {connector?.name === "WalletConnectLegacy" && <img width="20px" height="20px" src={require("../../assets/images/walletconnect_icon.png")} alt="WalletConnect" />}
                {` wallet ${TruncateAddress(props.walletOwner as string)}. `}
                {<a href={`https://bscscan.com/tx/${props.txHash}`} target="_blank" rel="noopener noreferrer">{`View your transaction record.`}</a>}
            </div>
            <TextLink to="/account" text="View my account" arrowDirection="forward" />
        </div>
    )
}