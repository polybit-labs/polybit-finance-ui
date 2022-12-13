import "./Loading.css"

export const Loading = () => {
    return (
        <div className="loading">
            <img height="90px" width="90px" src={require("../assets/images/loading.gif")} alt="Loading"></img>
        </div>
    )
}