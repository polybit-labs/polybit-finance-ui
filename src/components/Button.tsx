import "./Button.css"

const STYLES = ["btn--primary", "btn--secondary"]

export interface ButtonProps {
    text: string,
    type: "button" | "submit" | "reset" | undefined,
    onClick: any,
    buttonStyle: string,
    buttonSize: string
}

export const Button = ({ text, type, onClick, buttonStyle }: ButtonProps) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    return (
        <button className={`btn ${checkButtonStyle}`} onClick={onClick} type={type}>
            {text}
        </button>
    )
}