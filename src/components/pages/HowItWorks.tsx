import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import SubTitleContainer from "../containers/SubTitle"
import TitleContainer from "../containers/Title"
import { initialiseGA4 } from "../utils/Analytics"
import Footer from "./Footer"
import "./HowItWorks.css"
import ReactGA from "react-ga4"
import { Helmet } from "react-helmet-async"

const HowItWorks = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const title = "How it works"
    const subTitle = "Polybit’s Decentralised ETFs (DETFs) make the process of investing in digital assets easier, through discovery, investment and risk management."

    return (
        <>
            <Helmet>
                <title>{`How it works | Polybit Finance`}</title>
                <meta name="description" content={subTitle} />
            </Helmet>
            <TitleContainer title={title} />
            <SubTitleContainer info={subTitle} />
            <div className="how-it-works-container">
                <div className="how-it-works-container-desktop">
                    <div className="dark-grey-section">
                        <div className="dark-grey-section-container">
                            <div className="desktop-dark-grey-section-content">
                                <div className="dark-grey-section-image">
                                    <img className="section-one-image" src={require("../../assets/images/how-it-works-section-one-image.png")}></img>
                                </div>
                                <div className="dark-grey-section-text">
                                    <div className="dark-grey-section-text-header">
                                        <img className="text-header-icon" src={require("../../assets/images/how-it-works-section-one-icon.png")}></img>
                                        <div className="text-header-title">Thematic investing</div>
                                    </div>
                                    <div className="dark-grey-section-text-description">
                                        <p>Assets are grouped into familiar themes, which reduces the research and discovery process to find exciting and legitimate decentralised projects.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mobile-dark-grey-section-content">
                                <div className="dark-grey-section-image">
                                    <img className="section-one-image" src={require("../../assets/images/how-it-works-section-one-image.png")}></img>
                                </div>
                                <div className="dark-grey-section-text">
                                    <div className="dark-grey-section-text-header">
                                        <img className="text-header-icon" src={require("../../assets/images/how-it-works-section-one-icon.png")}></img>
                                        <div className="text-header-title">Thematic investing</div>
                                    </div>
                                    <div className="dark-grey-section-text-description">
                                        <p>Assets are grouped into familiar themes, which reduces the research and discovery process to find exciting and legitimate decentralised projects.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="light-grey-section">
                        <div className="light-grey-section-container">
                            <div className="desktop-light-grey-section-content">
                                <div className="light-grey-section-text">
                                    <div className="light-grey-section-text-header">
                                        <img className="text-header-icon" src={require("../../assets/images/how-it-works-section-two-icon.png")}></img>
                                        <div className="text-header-title">Risk management</div>
                                    </div>
                                    <div className="light-grey-section-text-description">
                                        <p>DETFs are automatically rebalanced every 90 days to manage risk as the market moves. Each DETF is rebalanced by a different weighting such as total liquidity, total market cap or equally balanced.</p>
                                    </div>
                                </div>
                                <div className="light-grey-section-image">
                                    <img className="section-two-image" src={require("../../assets/images/how-it-works-section-two-image.png")}></img>
                                </div>
                            </div>
                            <div className="mobile-light-grey-section-content">
                                <div className="light-grey-section-image">
                                    <img className="section-two-image" src={require("../../assets/images/how-it-works-section-two-image.png")}></img>
                                </div>
                                <div className="light-grey-section-text">
                                    <div className="light-grey-section-text-header">
                                        <img className="text-header-icon" src={require("../../assets/images/how-it-works-section-two-icon.png")}></img>
                                        <div className="text-header-title">Risk management</div>
                                    </div>
                                    <div className="light-grey-section-text-description">
                                        <p>DETFs are automatically rebalanced every 90 days to manage risk as the market moves. Each DETF is rebalanced by a different weighting such as total liquidity, total market cap or equally balanced.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dark-grey-section">
                        <div className="dark-grey-section-container">
                            <div className="desktop-dark-grey-section-content">
                                <div className="dark-grey-section-image">
                                    <img className="section-three-image" src={require("../../assets/images/how-it-works-section-three-image.png")}></img>
                                </div>
                                <div className="dark-grey-section-text">
                                    <div className="dark-grey-section-text-header">
                                        <img className="text-header-icon" src={require("../../assets/images/how-it-works-section-three-icon.png")}></img>
                                        <div className="text-header-title">DEX aggregation</div>
                                    </div>
                                    <div className="dark-grey-section-text-description">
                                        <p>Polybit’s Decentralised Exchange (DEX) aggregation algorithm, leverages over $3.5 billion of liquidity pools to ensure both available liquidity and best price for efficient digital asset trades.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mobile-dark-grey-section-content">
                                <div className="dark-grey-section-image">
                                    <img className="section-three-image" src={require("../../assets/images/how-it-works-section-three-image.png")}></img>
                                </div>
                                <div className="dark-grey-section-text">
                                    <div className="dark-grey-section-text-header">
                                        <img className="text-header-icon" src={require("../../assets/images/how-it-works-section-three-icon.png")}></img>
                                        <div className="text-header-title">DEX aggregation</div>
                                    </div>
                                    <div className="dark-grey-section-text-description">
                                        <p>Polybit’s Decentralised Exchange (DEX) aggregation algorithm, leverages over $3.5 billion of liquidity pools to ensure both available liquidity and best price for efficient digital asset trades.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="light-grey-section">
                        <div className="light-grey-section-container">
                            <div className="desktop-light-grey-section-content">
                                <div className="light-grey-section-text">
                                    <div className="light-grey-section-text-header">
                                        <img className="text-header-icon" src={require("../../assets/images/how-it-works-section-four-icon.png")}></img>
                                        <div className="text-header-title">Self-custodial</div>
                                    </div>
                                    <div className="light-grey-section-text-description">
                                        <p>Each DETF is a self-custodial smart contract, connected to and controlled by your wallet. Assets are never pooled or centralised and their ownership can be proven on the blockchain at any time.</p>
                                    </div>
                                </div>
                                <div className="light-grey-section-image">
                                    <img className="section-four-image" src={require("../../assets/images/how-it-works-section-four-image.png")}></img>
                                </div>
                            </div>
                            <div className="mobile-light-grey-section-content">
                                <div className="light-grey-section-image">
                                    <img className="section-four-image" src={require("../../assets/images/how-it-works-section-four-image.png")}></img>
                                </div>
                                <div className="light-grey-section-text">
                                    <div className="light-grey-section-text-header">
                                        <img className="text-header-icon" src={require("../../assets/images/how-it-works-section-four-icon.png")}></img>
                                        <div className="text-header-title">Self-custodial</div>
                                    </div>
                                    <div className="light-grey-section-text-description">
                                        <p>Each DETF is a self-custodial smart contract, connected to and controlled by your wallet. Assets are never pooled or centralised and their ownership can be proven on the blockchain at any time.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    )
}

export default HowItWorks