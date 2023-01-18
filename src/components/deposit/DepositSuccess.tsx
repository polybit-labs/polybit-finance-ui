
import { useEffect } from 'react';
import { Link } from 'react-router-dom'
import MainContainer from '../containers/Main';

interface DepositSuccess {
    category: string;
    dimension: string;
}

export const DepositSuccess = (props: DepositSuccess) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <MainContainer>
            <div className="deposit-success">
                <img className="deposit-success-tick" height="120px" width="120px" src={require("../../assets/icons/success_tick.png")}></img>
                <div className="deposit-success-text">Congratulations, your investment into the {props.category} {props.dimension} DETF was successful.</div>
                <Link className="deposit-success-link" to="/account">View my account and investments</Link>
            </div>
        </MainContainer>
    )
}