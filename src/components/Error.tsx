import "./Error.css"

interface ErrorPageProps {
    errorText: string
}
export const ErrorPage = (props: ErrorPageProps) => {
    return (
        <div className="error-container">
            <h1>{props.errorText}</h1>
        </div>
    )
}