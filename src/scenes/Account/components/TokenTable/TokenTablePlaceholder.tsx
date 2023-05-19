import "./TokenTable.css"
import { Button } from '../../../../components/Buttons/Buttons'
import { Link } from 'react-router-dom'

export const TokenTablePlaceholder = () => {
    return (
        <><div className="token-table-container">
            <div className="token-table-title">
                <h1>Digital Assets</h1>
            </div>
            <div className="token-table-container-placeholder">
                <div className="token-table-container-placeholder-overlay">
                </div>
                <div className="token-table-container-placeholder-overlay-info">
                    Ready to trade some digital assets?
                    <div><br /></div>
                    <Link to="/swap"><Button text="Explore Digital Assets" buttonStyle="primary" buttonSize="standard" /></Link>
                </div>
            </div>
        </div>
        </>
    )
}