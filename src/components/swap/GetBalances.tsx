import { BigNumber } from "ethers"
import { ERC20Token, GetTokenBalance } from "../utils/ERC20Utils";

interface GetBalanceProps {
    walletOwner: `0x${string}`;
    tokenOne: ERC20Token;
    tokenTwo: ERC20Token;
    nativeSymbol: string;
    walletBalance: BigNumber;
}

export const GetBalances = (props: GetBalanceProps) => {
    let tokenOneBalance: BigNumber | undefined
    let tokenTwoBalance: BigNumber | undefined

    tokenOneBalance = GetTokenBalance(props.tokenOne.address as `0x${string}`, props.walletOwner)
    tokenTwoBalance = GetTokenBalance(props.tokenTwo.address as `0x${string}`, props.walletOwner)

    if (props.tokenOne.symbol === props.nativeSymbol) {
        tokenOneBalance = props.walletBalance
    } else if (props.tokenTwo.symbol === props.nativeSymbol) {
        tokenTwoBalance = props.walletBalance
    }

    return [tokenOneBalance ? tokenOneBalance : BigNumber.from("0"), tokenTwoBalance ? tokenTwoBalance : BigNumber.from("0")]
}