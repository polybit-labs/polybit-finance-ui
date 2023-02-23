import SubTitleContainer from "../containers/SubTitle"
import TitleContainer from "../containers/Title"
import Footer from "./Footer"
import "./HowItWorks.css"

const HowItWorks = () => {
    const title = "How it works"
    const subTitle = "Polybit’s Decentralised ETFs (DETFs) make the process of investing in crypto easier, through discovery, investment and risk management."

    return (
        <><TitleContainer title={title} />
            <SubTitleContainer info={subTitle} />
            <div className="how-it-works">
                <div className="how-it-works-container">
                    <h2>1. Themed investing</h2>
                    <p>Assets are grouped into familiar themes, which reduces the research and discovery process to find exciting and legitimate crypto projects.</p>
                    <br />
                    <h2>2. Risk management</h2>
                    <p>DETFs are automatically rebalanced every 90 days to manage risk as the market moves. Each DETF is rebalanced by a different weighting such as total liquidity, total market cap or equally balanced.</p>
                    <br />
                    <h2>3. DEX aggregation</h2>
                    <p>Polybit’s Decentralised Exchange (DEX) aggregation algorithm, leverages over $3.5 billion of liquidity pools to ensure both available liquidity and best price for efficient cryptocurrency trades.</p>
                    <br />
                    <h2>4. Self-custodial wallet extension</h2>
                    <p>Each DETF is a self-custodial smart contract, connected to and controlled by your wallet. Assets are never pooled or centralised and their ownership can be proven on the blockchain at any time.</p>
                </div>
            </div>
            <Footer />
        </>

    )
}

export default HowItWorks