import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"
import currencyContext, { CurrencyState } from '../context/currency'

function CurrencyComponent() {
    const user = useContext(currencyContext)
    return (
        <div>{user.currency}</div>
    )
}

function Navbar() {
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyState>({ currency: "AUD" })
    const [click, setClick] = useState(false)
    const [button, setButton] = useState(true)
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)


    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false)
        } else {
            setButton(true)
        }
    }

    useEffect(() => {
        showButton()
    }, [])

    window.addEventListener("resize", showButton)
    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo-wrapper">
                        <img className="polybit-logo" src={require("../assets/images/polybit-logo-3x.png")} alt="Polybit"></img>
                    </Link>
                </div>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? "fas fa-times" : "fas fa-bars"} />
                </div>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item">
                        <Link to="/detf-index" className="nav-links" onClick={closeMobileMenu}>
                            DETF Index
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/how-it-works" className="nav-links" onClick={closeMobileMenu}>
                            How it works
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/account" className="nav-links" onClick={closeMobileMenu}>
                            Account
                        </Link>
                    </li>
                    <li className="nav-item">
                        <div className="nav-currency">Base currency is&nbsp;</div>
                        <Link to="/connect-wallet" className="nav-links" onClick={closeMobileMenu}>
                            <currencyContext.Provider value={selectedCurrency}><CurrencyComponent /></currencyContext.Provider>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar