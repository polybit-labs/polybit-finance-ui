import "./BetaMessage.css"

export const BetaMessage = () => {
    return (
        <div className="beta-message">
            <div className="beta-message-container">
                <h2>This section is locked for a closed beta.</h2>
                <h2>If you would like access to the beta, please follow us on Twitter and send a DM to request access.</h2>
                <div><br /></div>
                <a href="https://twitter.com/polybitfinance?ref_src=twsrc%5Etfw" className="twitter-follow-button" rel="nofollow">Follow @PolybitFinance</a>
            </div>
        </div>
    )
}