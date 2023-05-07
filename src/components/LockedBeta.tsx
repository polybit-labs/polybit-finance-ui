import { Link } from "react-router-dom"
import { Button } from "./Buttons/Buttons"
import "./LockedBeta.css"

export const LockedBeta = () => {
    return (
        <div className="locked-beta">
            <div className="locked-beta-top-container">
                <div className="locked-beta-content">
                    <div className="locked-beta-content-title">
                        <h1>We’re currently in closed beta.</h1>
                        <p>Polybit isn’t open to the public yet. To gain access to our beta, please follow us on Twitter and send us a direct message to express your interest. We look forward to hearing from you.</p>
                        <div className="locked-beta-content-title-twitter-wrapper">
                            <a href="https://twitter.com/polybitfinance?ref_src=twsrc%5Etfw" className="twitter-follow-button" target="_blank" rel="nofollow">Follow @PolybitFinance</a>
                        </div>
                    </div>
                    <img className="locked-beta-content-image-desktop" src={require("../assets/images/geometric-shapes-grey-desktop-2x.png")} />
                    <img className="locked-beta-content-image-mobile" src={require("../assets/images/geometric-shapes-grey-mobile-2x.png")} />
                </div>
            </div>
            <div className="locked-beta-bottom-container">
                <Link className="detf-index-row-item-link" to="/how-it-works" >
                    <Button text="Learn more about how Polybit works" buttonSize="standard" buttonStyle="primary" />
                </Link>
            </div>
        </div>
    )
}