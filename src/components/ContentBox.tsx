import React from 'react';
import "./ContentBox.css"

type ContentBoxProps = {
    children: React.ReactNode
}

const ContentBox = (props: ContentBoxProps) => {
    return (
        <div className="content-container">
            <div className="content-container-box">
                {props.children}
            </div>
        </div>
    )
}

export default ContentBox