import "./Footer.css"
import { Link } from "react-router-dom";
import { Email } from "react-obfuscate-email";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-logo-wrapper">
                        <Link to="/" className="footer-logo">
                            <img src={require("../../assets/images/polybit-logo-3x-white.png")} alt="Polybit" width="100px" height="28px"></img>
                        </Link>
                    </div>
                    <div className="footer-link-items">
                        <h2>DETF Categories</h2>
                        <Link to="/detfs/category/bsc-index-top-10"><u>BSC Index Top 10</u></Link>
                        <Link to="/detfs/category/defi"><u>DeFi</u></Link>
                        <Link to="/detfs/category/governance"><u>Governance</u></Link>
                        <Link to="/detfs/category/metaverse"><u>Metaverse</u></Link>
                    </div>
                    <div className="footer-link-items">
                        <h2>Legal</h2>
                        <Link to="/privacy-policy"><u>Privacy Policy</u></Link>
                    </div>
                    <div className="footer-link-items">
                        <h2>Contact Us</h2>
                        <Email email="contactus@polybit.finance"><u>Contact</u></Email>
                        <a href="https://twitter.com/PolybitFinance" target="_blank" rel="noreferrer"><u>Twitter</u> {/* <i class="fa-solid fa-up-right-from-square" /> */}</a>
                        <a href="https://www.linkedin.com/company/polybit" target="_blank" rel="noreferrer"><u>LinkedIn</u> {/* <i class="fa-solid fa-up-right-from-square" /> */}</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-copyright-wrapper">
                        <div className="footer-copyright-text">
                            <p>Copyright © 2023 Polybit Labs Pty Ltd. All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer