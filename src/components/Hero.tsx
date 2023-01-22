import "./Hero.css"

const Hero = () => {
    return (
        <div className="hero-container">
            <div className="hero-top">
                <div className="hero-top-left"></div>
                <div className="hero-top-middle"></div>
                <div className="hero-top-right"></div>
            </div>
            <div className="hero-middle">
                <div className="hero-middle-left"></div>
                <div className="hero-middle-middle">
                    <div className="hero-middle-content">
                        <h1>A brand new way to invest in next generation assets. Simple, fast, secure.</h1>
                        <p>Introducing Polybit Decentralized Exchange Traded Funds. With a single DETF transaction, get diversified exposure to pools of top performing cryptoassets - such as the Binance DeFi Top 20 - across categories including Web3 gaming, NFTs, IoT, and more...</p>
                    </div>
                </div>
                <div className="hero-middle-right"></div>
            </div>
            <div className="hero-bottom">
                <div className="hero-bottom-left"></div>
                <div className="hero-bottom-middle"></div>
                <div className="hero-bottom-right"></div>
            </div>
        </div>
    )
}

export default Hero