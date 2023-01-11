import "./Button.css"

export interface ButtonProps {
    text: string,
    type?: "button" | "submit" | "reset" | undefined,
    onClick?: any,
    buttonStyle: string,
    buttonSize: string,
    status?: string
}

export const Button = ({ text, type, onClick, buttonStyle, buttonSize, status }: ButtonProps) => {
    if (status === "loading") {
        return (
            <button className={`button-${buttonStyle}-${buttonSize}-${status}`} onClick={onClick} type={type}>
                {buttonSize === "standard" && <img src={require("../assets/images/polybit-loader-white-60px.gif")}></img>}
                {buttonSize === "slim" && <img src={require("../assets/images/polybit-loader-white-40px.gif")}></img>}
            </button>
        )
    }
    if (status === "disabled") {
        return (
            <button className={`button-${buttonStyle}-${buttonSize}-${status}`}>
                {text}
            </button>
        )
    }
    return (
        <button className={`button-${buttonStyle}-${buttonSize}`} onClick={onClick} type={type}>
            {text}
        </button>
    )
}