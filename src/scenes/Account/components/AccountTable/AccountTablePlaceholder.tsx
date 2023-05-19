import "./AccountTable.css"
import { Button } from '../../../../components/Buttons/Buttons'
import { Link } from 'react-router-dom'

export const AccountTablePlaceholder = () => {
    return (
        <><div className="account-detf-container">
            <div className="account-detf-title">
                <h1>Investment Themes</h1>
            </div>
            <div className="account-detf-container-placeholder">
                <div className="account-detf-container-placeholder-overlay">
                </div>
                <div className="account-detf-container-placeholder-overlay-info">
                    Ready to invest in a familar theme?
                    <div><br /></div>
                    <Link to="/themes"><Button text="Explore Investment Themes" buttonStyle="primary" buttonSize="standard" /></Link>
                </div>
            </div>
        </div>
        </>
    )
}