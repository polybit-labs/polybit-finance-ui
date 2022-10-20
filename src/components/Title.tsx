import "./Title.css"
import { Link } from 'react-router-dom'


interface TitleProps {
    title: string;
    info: any;
    switchButton: boolean;
}

function Title({ title, info, switchButton, }: TitleProps) {

    return (
        <div className="title-section-container">
            <div className="title-section">
                <h1>{title}</h1>
            </div>
            <div className="title-info">
                <p>{info}</p>
                <Link to="/connect-wallet" >
                    <button className={switchButton ? "switch-wallet" : "switch-wallet-inactive"}>Switch wallet</button>
                </Link>
            </div>
        </div>
    )
}

export default Title