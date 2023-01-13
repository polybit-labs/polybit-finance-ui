import "./Loading.css"

interface Loading {
    loadingMsg?: string;
}

export const Loading = (props: Loading) => {
    return (
        <div className="loading">
            <img height="90px" width="90px" src={require("../assets/images/loading.gif")} alt="Loading"></img>
            <div className="loading-message">{props.loadingMsg}</div>
        </div>
    )
}