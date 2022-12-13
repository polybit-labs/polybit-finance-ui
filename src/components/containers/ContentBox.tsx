import "./ContentBox.css"

type ContentBoxContainerProps = {
    children: React.ReactNode
}

const ContentBoxContainer = (props: ContentBoxContainerProps) => {
    return (
        <div className="main-content-box">
            {props.children}
        </div>
    )
}

export default ContentBoxContainer