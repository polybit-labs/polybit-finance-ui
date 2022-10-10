import "./Button.css"

const STYLES = ["btn--primary", "btn--filled"]
const SIZES = ["btn--medium", "btn--large"]

export interface ButtonProps {
    text: string,
    type: "button" | "submit" | "reset" | undefined,
    onClick: any,
    buttonStyle: string,
    buttonSize: string
}

export const Button = ({ text, type, onClick, buttonStyle, buttonSize }: ButtonProps) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

    return (
        <button className={`btn ${checkButtonStyle} ${checkButtonSize}`} onClick={onClick} type={type}>
            {text}
        </button>
    )
}