import SubTitleContainer from "../containers/SubTitle"
import TitleContainer from "../containers/Title"
import Footer from "./Footer"
import "./HowItWorks.css"

const HowItWorks = () => {
    const title = "How it works"
    const subTitle = "Polybit is a..."

    return (
        <><TitleContainer title={title} />
            <SubTitleContainer info={subTitle} />
            <div className="how-it-works">
                <div className="how-it-works-container">
                    <h2>1. Themed investing</h2>
                    <p>Assets are grouped into familiar themes, which reduces the discovery and research process for the investor.</p>
                    <br />
                    <h2>2. Risk management</h2>
                    <p>DETFs are automatically rebalanced every 90 days to manage risk as the market moves.</p>
                    <br />
                    <h2>3. DEX aggregation</h2>
                    <p>Polybit’s DEX aggregation algorithm, leverages over $3.5 billion of liquidity pools to ensure both available liquidity and best price for efficient trades.</p>
                    <br />
                    <h2>4. Self-custodial wallet extension</h2>
                    <p>Each DETF is a self-custodial smart contract, connected to and controlled by the investor’s wallet, preventing risk of abuse by centralising/pooling assets and avoiding the impending tokenisation regulations.</p>
                </div>
            </div>
            <Footer />
        </>

    )
}

export default HowItWorks