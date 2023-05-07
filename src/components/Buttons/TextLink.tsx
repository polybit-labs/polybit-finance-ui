import "./TextLink.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

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