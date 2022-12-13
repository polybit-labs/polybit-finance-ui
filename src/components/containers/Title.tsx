import "./Title.css"

interface TitleProps {
    title: string;
}

const TitleContainer = (props: TitleProps) => {
    return (
        <div className="title-container">
            <h1>{props.title}</h1>
        </div>
    )
}

export default TitleContainer