import "./Loading.css"

interface Loading {
    loadingMsg?: string;
}

export const Loading = (props: Loading) => {
    return (
        <div className="loading">
            <img height="100px" width="100px" src={require("../assets/images/polybit-loader-black-on-dark-grey-100px.gif")} alt="Loading"></img>
            <div className="loading-message">{props.loadingMsg}</div>
        </div>
    )
}