import "./Buttons.css"

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
                {props.buttonSize === "standard" && <div className="button-loading-content"><img src={require("../../assets/images/polybit-loader-white-60px.gif")}></img>&nbsp;{props.loadingMsg}</div>}
                {props.buttonSize === "slim" && <div className="button-loading-content"><img src={require("../../assets/images/polybit-loader-white-40px.gif")}></img>&nbsp;{props.loadingMsg}</div>}
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