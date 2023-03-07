import { Link } from "react-router-dom";
import "./Buttons.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

export interface ButtonProps {
    text: string,
    type?: "button" | "submit" | "reset" | undefined,
    onClick?: any,
    buttonStyle: string,
    buttonSize: string,
    status?: string,
    loadingMsg?: string;
}

export const Button = (props: ButtonProps) => {
    if (props.status === "loading") {
        return (
            <button className={`button-${props.buttonStyle}-${props.buttonSize}-${props.status}`} onClick={props.onClick} type={props.type}>
                {props.buttonSize === "standard" && <div className="button-loading-content"><img src={require("../assets/images/polybit-loader-white-60px.gif")}></img>&nbsp;{props.loadingMsg}</div>}
                {props.buttonSize === "slim" && <div className="button-loading-content"><img src={require("../assets/images/polybit-loader-white-40px.gif")}></img>&nbsp;{props.loadingMsg}</div>}
            </button>
        )
    }
    if (props.status === "disabled") {
        return (
            <button className={`button-${props.buttonStyle}-${props.buttonSize}-${props.status}`}>
                {props.text}
            </button>
        )
    }
    return (
        <button className={`button-${props.buttonStyle}-${props.buttonSize}`} onClick={props.onClick} type={props.type}>
            {props.text}
        </button>
    )
}

interface TextLink {
    to: string;
    onClick?: any;
    arrowDirection?: string;
    underline?: boolean;
    text: string;
}

export const TextLink = (props: TextLink) => {
    if (props.underline) {
        return (
            <>
                {props.to !== "" && <Link className={`text-link-underline`} to={props.to} onClick={props.onClick}>{props.text}</Link>}
                {props.to == "" && <div className={`text-link-underline`} onClick={props.onClick}>{props.text}</div>}
            </>
        )
    }

    if (props.arrowDirection) {
        return (
            <>
                {props.to !== "" && <Link className={`text-link-${props.arrowDirection}`} to={props.to} onClick={props.onClick}>
                    {props.arrowDirection === "forward" && <div>{props.text} <FontAwesomeIcon className="fa-right-long" icon={icon({ name: "right-long", style: "solid" })} /></div>}
                    {props.arrowDirection === "back" && <div><FontAwesomeIcon className="fa-left-long" icon={icon({ name: "left-long", style: "solid" })} /> {props.text}</div>}

                    {props.arrowDirection === "forward-logout" && <div>{props.text} <FontAwesomeIcon className="fa-right-from-bracket" icon={icon({ name: "right-from-bracket", style: "solid" })} /></div>}
                </Link>}
                {props.to === "" && <div className={`text-link-${props.arrowDirection}`} onClick={props.onClick}>
                    {props.arrowDirection === "forward" && <div>{props.text} <FontAwesomeIcon className="fa-right-long" icon={icon({ name: "right-long", style: "solid" })} /></div>}
                    {props.arrowDirection === "back" && <div><FontAwesomeIcon className="fa-left-long" icon={icon({ name: "left-long", style: "solid" })} /> {props.text}</div>}

                    {props.arrowDirection === "forward-logout" && <div>{props.text} <FontAwesomeIcon className="fa-right-from-bracket" icon={icon({ name: "right-from-bracket", style: "solid" })} /></div>}
                </div>}
            </>
        )
    }
    return (
        <>
            {props.to !== "" && <Link className={`text-link`} to={props.to} onClick={props.onClick}>{props.text}</Link>}
            {props.to === "" && <div className={`text-link`} onClick={props.onClick}>{props.text}</div>}
        </>
    )
}