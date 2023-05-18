import { Link } from "react-router-dom"
import { Button } from "../../../../components/Buttons/Buttons"
import "./Hero.css"

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-content-title">
                        <h1>A brand new way to invest in next generation assets.</h1>
                        <p>Introducing Polybit’s Investment Themes. Get diversified exposure to a range of digital assets in a single investment that tracks the performance of familiar themes, such as Defi, Governance or the Metaverse.</p>
                        <div className="hero-content-title-button-wrapper">
                            <Link to="/themes" >
                                <Button buttonStyle="primary" buttonSize="standard" text="Invest in the future, today" />
                            </Link>
                        </div>
                    </div>
                    <img className="hero-content-image-desktop" src={require("./images/geometric-shapes-desktop-2x.png")} />
                    <img className="hero-content-image-mobile" src={require("./images/geometric-shapes-mobile-2x.png")} />
                </div>
            </div>
        </div>
    )
}

export default Hero