import { useState } from "react";
import { ERC20Token } from "../../components/utils/ERC20Utils";
import "./AssetList.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { BigNumber } from "ethers";

interface AssetListProps {
    setShowAssetList: Function;
    setTokenOne: Function;
    setTokenTwo: Function;
    tokenOne: ERC20Token;
    tokenTwo: ERC20Token;
    whichToken: string;
    approvedList: Array<ERC20Token>
    setTokenOneInputValue: Function;
    setTokenTwoInputValue: Function;
}

export const AssetList = (props: AssetListProps) => {
    const commonAssets: Array<ERC20Token> = [
        {
            symbol: "BNB",
            name: "Binance Chain Native Token",
            logoURI: "https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313",
            address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            chainId: 56,
            decimals: 18
        },
        {
            symbol: "USDT",
            name: "Tether USD",
            logoURI: "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x55d398326f99059fF775485246999027B3197955.png",
            address: "0x55d398326f99059fF775485246999027B3197955",
            chainId: 56,
            decimals: 18
        },
        {
            symbol: "CAKE",
            name: "PancakeSwap Token",
            logoURI: "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png",
            address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
            chainId: 56,
            decimals: 18
        },
        {
            symbol: "USDC",
            name: "Wrapped BTC Token",
            logoURI: "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d.png",
            address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            chainId: 56,
            decimals: 18
        },
    ]

    const CheckThenSetToken = (token: ERC20Token) => {
        if (props.whichToken === "tokenOne") {
            if (token.address === props.tokenTwo.address) {
                props.setTokenTwo(props.tokenOne)
                props.setTokenOne(token)
            } else {
                props.setTokenOne(token)
            }
        }

        if (props.whichToken === "tokenTwo") {
            if (token.address === props.tokenOne.address) {
                props.setTokenOne(props.tokenTwo)
                props.setTokenTwo(token)
            } else {
                props.setTokenTwo(token)
            }
        }
    }
    const [filteredAssets, setFilteredAssets] = useState<Array<ERC20Token>>(props.approvedList)

    const searchAssets = (textInput: string) => {
        if (textInput === "") {
            setFilteredAssets(props.approvedList)
        } else {
            let filtered: Array<ERC20Token> = props.approvedList.filter((asset) => {
                if (asset.symbol.toLowerCase().match(textInput.toLocaleLowerCase())) {
                    return asset.symbol.toLowerCase().match(textInput.toLocaleLowerCase())
                }
                if (asset.name.toLowerCase().match(textInput.toLocaleLowerCase())) {
                    return asset.name.toLowerCase().match(textInput.toLocaleLowerCase())
                }
                if (asset.address.toLowerCase().match(textInput.toLocaleLowerCase())) {
                    return asset.address.toLowerCase().match(textInput.toLocaleLowerCase())
                }
            })
            setFilteredAssets(filtered)
        }
    }

    return (
        <div className="asset-list">
            <div className="asset-list-container">
                <div className="asset-list-header">
                    <h2>Select an asset</h2>
                    <p className="asset-list-header-close" onClick={() => props.setShowAssetList(false)}>
                        <FontAwesomeIcon className="fa-times" icon={icon({ name: "times", style: "solid" })} />
                    </p>
                </div>
                <div className="asset-list-search">
                    <input type="text"
                        placeholder="Search name or paste address"
                        onChange={(e) => searchAssets(e.target.value)} />
                </div>
                <div className="asset-list-common">
                    <div className="asset-list-common-header">Common digital assets</div>
                    <div className="asset-list-common-selector">
                        {commonAssets.map((item, index) =>
                            <div key={index} className="asset-list-common-asset" onClick={() => {
                                CheckThenSetToken(item);
                                props.setShowAssetList(false);
                                /* props.setTokenOneInputValue(BigNumber.from("0"));
                                props.setTokenTwoInputValue(BigNumber.from("0")) */
                            }}>
                                <img className="asset-list-common-asset-logo" src={item.logoURI} />
                                <div className="asset-list-common-asset-name">{item.symbol}</div>
                            </div>)}
                    </div>
                </div>
                <div className="asset-list-scrollable-list">
                    {filteredAssets?.map((item, index) =>
                        <div key={index} className="asset-list-scrollable-list-asset" onClick={() => {
                            CheckThenSetToken(item);
                            props.setShowAssetList(false);
                            /* props.setTokenOneInputValue(BigNumber.from("0"));
                            props.setTokenTwoInputValue(BigNumber.from("0")) */
                        }}>
                            <img className="asset-list-scrollable-list-asset-logo" src={item.logoURI} />
                            <div className="asset-list-scrollable-list-asset-title">
                                <div className="asset-list-scrollable-list-asset-symbol">{item.symbol}</div>
                                <div className="asset-list-scrollable-list-asset-name">{item.name}</div>
                            </div>
                        </div>)}
                </div>
            </div>
        </div>
    )
}