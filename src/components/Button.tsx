import "./Button.css"

const STYLES = ["btn--primary", "btn--secondary"]

export interface ButtonProps {
    text: string,
    type: "button" | "submit" | "reset" | undefined,
    buttonStyle: string,
}

export const Button = ({ text, type, buttonStyle }: ButtonProps) => {
    return (
        <button className={`button-${buttonStyle}`} type={type}>
            {text}
        </button>
    )

}