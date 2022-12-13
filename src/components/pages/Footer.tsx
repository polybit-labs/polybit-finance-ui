import "./Footer.css"
import { Link } from "react-router-dom";
import { Email } from "react-obfuscate-email";

function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-top">
                <div className="footer-logo-wrapper">
                    <Link to="/" className="footer-logo">
                        <img src={require("../../assets/images/polybit-logo-3x-white.png")} alt="Polybit" width="100px" height="28px"></img>
                    </Link>
                </div>
                <div className="footer-link-items">
                    <h2>Legal</h2>
                    <Link to="/privacy-policy"><u>Privacy Policy</u></Link>
                </div>
                <div className="footer-link-items">
                    <h2>Contact Us</h2>
                    <Email email="contactus@polybit.finance"><u>Contact</u></Email>
                    <a href="https://www.linkedin.com/company/polybit" target="_blank" rel="noreferrer"><u>LinkedIn</u> {/* <i class="fa-solid fa-up-right-from-square" /> */}</a>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-copyright-wrapper">
                    <div className="footer-copyright-text">
                        <p>Copyright © 2022 Polybit Labs Pty Ltd. All rights reserved</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer