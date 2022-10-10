import React from 'react'
import "./Hero.css"

function Hero() {
    /* const [mobileDevice, setMobileDevice] = useState(false)

    const checkMediaSize = () => {
        if (window.innerWidth < 992) {
            setMobileDevice(true)
        } else {
            setMobileDevice(false)
        }
    }

    window.addEventListener("resize", checkMediaSize) */
    return (
        <div className="hero">
            <div className="hero-container">
                <div className="hero-wrapper">
                    <div className="hero-top"></div>
                    <div className="hero-middle">
                        <div className="hero-middle-content">
                            <h1>A brand new way to invest in next generation assets. Simple, fast, secure.</h1>
                            <p>Introducing Polybit Decentralized Exchange Traded Funds. With a single DETF transaction, get diversified exposure to pools of top performing cryptoassets - such as the Binance DeFi Top 20 - across categories including Web3 gaming, NFTs, IoT, and more...</p>
                        </div>
                    </div>
                    <div className="hero-bottom"></div>
                </div>
            </div>
        </div>
    )
}

export default Hero