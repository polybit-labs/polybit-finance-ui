import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"
import { CurrencyContext, CurrencyFormats } from "./utils/Currency"
import { CurrencyDropDown } from "./dropdowns/CurrencyDropDown"
import sortDown from "../assets/icons/sort-down-solid.svg"
import { InlineDropDown } from './dropdowns/InlineDropDown'

interface NavbarProps {
    setCurrency: Function;
}

function Navbar(props: NavbarProps) {
    const currency = useContext(CurrencyContext).currency
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

    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const [selectCurrencyFormat, setCurrencyFormat] = useState<string>(currency)
    const toggleDropDown = () => {
        setShowDropDown(!showDropDown)
    }
    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShowDropDown(false)
        }
    }
    const currencyFormatSelection = (currencyFormat: string): void => {
        setCurrencyFormat(currencyFormat)
    }

    function SetCurrency(currency: string) {
        props.setCurrency({ currency: currency })
    }

    useEffect(() => {
        SetCurrency(selectCurrencyFormat)
    }, [selectCurrencyFormat, setCurrencyFormat])

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
                        <Link to="/detfs" className="nav-links" onClick={closeMobileMenu}>
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
                        <button
                            className="currency-format"
                            onClick={(): void => toggleDropDown()}
                            onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                                dismissHandler(e)
                            }
                        >
                            <div>{selectCurrencyFormat ? selectCurrencyFormat : "Select ..."} <img src={sortDown} height="20px" width="20px"></img></div>
                            {showDropDown && (
                                <CurrencyDropDown
                                    options={CurrencyFormats()}
                                    showDropDown={false}
                                    toggleDropDown={(): void => toggleDropDown()}
                                    selectedOption={currencyFormatSelection}
                                />

                            )}
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar