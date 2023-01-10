
import { Link } from 'react-router-dom'
import { Button } from './Button';

interface DepositSuccess {
    category: string;
    dimension: string;
}

export const DepositSuccess = (props: DepositSuccess) => {
    return (
        <div className="deposit-success">
            <img height="120px" width="120px" src={require("../assets/icons/success_tick.png")}></img>
            <div>Congratulations, your investment into the {props.category} {props.dimension} DETF was successful.</div>
            <Link className="success-deposit-button-link" to="/account">
                <Button text="Go To My Account" buttonStyle="primary" type="button"></Button></Link>
        </div>
    )
}