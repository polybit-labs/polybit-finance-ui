import { useEffect } from 'react';
import { Link } from 'react-router-dom'
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
                <img className="withdraw-success-tick" height="120px" width="120px" src={require("../../assets/icons/success_tick.png")}></img>
                <div className="withdraw-success-text">You have successfully exited your investment in the {props.category} {props.dimension} and your funds have been returned to your wallet.</div>
                <div>INSERT DETAIL</div>
                <Link className="withdraw-success-link" to="/account">View my account and investments</Link>
            </div>
        </MainContainer>
    )
}