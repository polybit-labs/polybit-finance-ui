import { useEffect } from 'react';
import { TextLink } from './Buttons/TextLink';
import { Footer } from './Footer/Footer';
import "./WithdrawSuccess.css"

interface WithdrawSuccess {
    category: string;
    dimension: string;
}

export const WithdrawSuccess = (props: WithdrawSuccess) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="withdraw-success">
                <img className="withdraw-success-tick" src={require("./../assets/icons/success_tick.png")}></img>
                <div className="withdraw-success-text">You have successfully exited your investment in the {props.category} {props.dimension} DETF.</div>
                <TextLink to="/account" text="View my account" arrowDirection="forward" />
            </div>
            <Footer />
        </>
    )
}