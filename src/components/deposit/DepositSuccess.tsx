
import { useEffect } from 'react'
import { TextLink } from '../Buttons/TextLink';
import "./DepositSuccess.css"

interface DepositSuccess {
    category: string;
    dimension: string;
}

export const DepositSuccess = (props: DepositSuccess) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="deposit-success">
            <img className="deposit-success-tick" src={require("../../assets/icons/success_tick.png")}></img>
            <div className="deposit-success-text">Congratulations, your investment into the {props.category} {props.dimension} investment theme was successful.</div>
            <TextLink to="/account" text="View my account" arrowDirection="forward" />
        </div>
    )
}