import { Link } from "react-router-dom";
import { Button } from "../components/Buttons/Buttons"

interface DETFInvestButtonProps {
    setShowBetaMessage: Function;
    productId: string;
    category: string;
    dimension: string;
}
export const DETFInvestButton = (props: DETFInvestButtonProps) => {

    if (window.location.href.includes("polybit.finance")) {
        return (
            <div className="detf-invest-button">
                <Button text="Invest in this Theme" buttonStyle="primary" buttonSize="standard" onClick={() => props.setShowBetaMessage(true)} />
            </div>
        )
    }

    return (
        <Link className="detf-invest-button" to="/establish-deposit" state={{ productId: props.productId, category: props.category, dimension: props.dimension }}>
            <Button buttonStyle="primary" buttonSize="standard" text="Invest in this Theme" />
        </Link>
    )
}