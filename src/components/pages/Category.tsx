import { ColourCategories, DETFIconFilename } from "../utils/Formatting"
import "./Category.css"

export const Category = () => {
    const tokenIcons: Array<string> = [
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0xFeea0bDd3D07eb6FE305938878C0caDBFa169042.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0xBc7d6B50616989655AfD682fb42743507003056D.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x6bfF4Fb161347ad7de4A625AE5aa3A1CA7077819.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0xAC51066d7bEC65Dc4589368da368b212745d63E8.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0xc5E6689C9c8B02be7C49912Ef19e79cF24977f03.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0xa1faa113cbE53436Df28FF0aEe54275c13B40975.png",
        "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/assets/tokens/images/56/0xDB021b1B247fe2F1fa57e0A87C748Cc1E321F07F.png"
    ]
    const iconSizes: Array<any> = [240, 160, 110, 90, 80, 80, 60, 50, 40, 50]
    const leftCoordinates: Array<number> = [
        97,
        18,
        340,
        300,
        10,
        226,
        304,
        350,
        128,
        58
    ]
    const topCoordinates: Array<number> = [
        69,
        0,
        20,
        280,
        230,
        13,
        226,
        150,
        280,
        304
    ]

    const zIndexes: Array<number> = [8, 6, 4, 3, 5, 9, 8, 7, 2, 10, 1]
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const shuffledArray: Array<any> = array.sort((a, b) => 0.5 - Math.random())

    return (
        <div className="category">
            <div className="category-container">
                <div className="category-title">
                    <img className="detf-name-logo" src={require(`../../assets/icons/${DETFIconFilename("Governance", "Liquidity")}`)}></img>
                    <div style={{ color: ColourCategories("Governance") }}>{"Governance"}</div>                </div>
                <div className="category-main">
                    <div className="category-main-content">
                        main title
                    </div>
                    <div className="category-icons-container">
                        <div className="category-icons">
                            {shuffledArray.map((randNumber: number, index: number) =>
                                <img key={randNumber} className="category-icon" src={tokenIcons[randNumber]} height={`${iconSizes[index]}px`} width={`${iconSizes[index]}px`} style={{ top: topCoordinates[index], left: leftCoordinates[index], zIndex: zIndexes[index] }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}