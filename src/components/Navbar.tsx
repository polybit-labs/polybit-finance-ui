import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"
import { CurrencyContext, CurrencyFormats } from "./utils/Currency"
import { CurrencyDropDown } from "./dropdowns/CurrencyDropDown"
import sortDown from "../assets/icons/sort-down-solid.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

interface NavbarProps {
    setCurrency: Function;
}

const Navbar = (props: NavbarProps) => {
    const currency = useContext(CurrencyContext).currency
    const [click, setClick] = useState(false)
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
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

    const dismissHandlerMobile = (event: React.TouchEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            event.preventDefault()
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
                <div className="navbar-logo-wrapper">
                    <Link to="/">
                        <img className="polybit-logo" src={require("../assets/images/polybit-logo-3x.png")} alt="Polybit"></img>
                    </Link>
                </div>
                <div className="navbar-container">
                    <ul className={"nav-menu"}>
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
                                        toggleDropDown={(): void => toggleDropDown()}
                                        selectedOption={currencyFormatSelection}
                                    />

                                )}
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
            <nav className="navbar-mobile">
                <div className="navbar-header-mobile">
                    <Link to="/">
                        <img className="polybit-logo" src={require("../assets/images/polybit-logo-3x.png")} alt="Polybit"></img>
                    </Link>
                    <div className="menu-icon-mobile" onClick={handleClick}>
                        {click && <FontAwesomeIcon className="fa-times" icon={icon({ name: "times", style: "solid" })} />}
                        {!click && <FontAwesomeIcon className="fa-bars" icon={icon({ name: "bars", style: "solid" })} />}
                    </div>
                </div>
                <div className="nav-currency-mobile">
                    <div >Base currency is&nbsp;</div>
                    <button
                        className="currency-format"
                        onClick={(): void => toggleDropDown()}
                        onBlur={(): void => {
                            (e: React.FocusEvent<HTMLButtonElement>): void => dismissHandler(e)
                            ; (e: React.TouchEvent<HTMLButtonElement>) => dismissHandlerMobile(e)
                        }}
                    >
                        <div>{selectCurrencyFormat ? selectCurrencyFormat : "Select ..."} <img src={sortDown} height="20px" width="20px"></img></div>
                        {showDropDown && (
                            <CurrencyDropDown
                                options={CurrencyFormats()}
                                toggleDropDown={(): void => toggleDropDown()}
                                selectedOption={currencyFormatSelection}
                            />

                        )}
                    </button>
                </div>
                {click && <div className="nav-menu-mobile"></div>}
                {click && <ul className="nav-menu-mobile-items">
                    <li className="nav-item-mobile">
                        <Link to="/detfs" className="nav-links-mobile" onClick={closeMobileMenu}>
                            DETF Index
                        </Link>
                    </li>
                    <li className="nav-item-mobile">
                        <Link to="/how-it-works" className="nav-links-mobile" onClick={closeMobileMenu}>
                            How it works
                        </Link>
                    </li>
                    <li className="nav-item-mobile">
                        <Link to="/account" className="nav-links-mobile" onClick={closeMobileMenu}>
                            Account
                        </Link>
                    </li>
                </ul>}
            </nav>
        </>
    )
}

export default Navbar