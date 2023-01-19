import { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { TextLink } from './Buttons';
import MainContainer from './containers/Main';
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
        <MainContainer>
            <div className="withdraw-success">
                <img className="withdraw-success-tick" height="120px" width="120px" src={require("./../assets/icons/success_tick.png")}></img>
                <div className="withdraw-success-text">You have successfully exited your investment in the {props.category} {props.dimension} DETF and your funds have been returned to your wallet.</div>
                <TextLink to="/account" text="View my account and investments" arrowDirection="forward" />
            </div>
        </MainContainer>
    )
}