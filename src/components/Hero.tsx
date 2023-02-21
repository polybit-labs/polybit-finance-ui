import { Link } from "react-router-dom"
import { Button } from "./Buttons"
import "./Hero.css"

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-content-title">
                        <h1>Chocolate bar donut.</h1>
                        <p>Brownie candy canes carrot cake carrot cake ice cream candy tart marshmallow jelly beans. Soufflé cookie biscuit carrot cake jujubes cake toffee oat cake. Soufflé sugar plum jelly beans cake jujubes fruitcake icing gingerbread. Icing candy donut cheesecake cookie marzipan.</p>
                        <div className="hero-content-title-button-wrapper">
                            <Link to="/detfs" >
                                <Button buttonStyle="primary" buttonSize="standard" text="Invest in the future, today" />
                            </Link>
                        </div>
                    </div>
                    <img className="hero-content-image-desktop" src={require("../assets/images/geometric-shapes-desktop-2x.png")} />
                    <img className="hero-content-image-mobile" src={require("../assets/images/geometric-shapes-mobile-2x.png")} />
                </div>
            </div>
        </div>
    )
}

export default Hero