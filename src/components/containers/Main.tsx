import React from 'react';
import "./Main.css"

type MainContainerProps = {
    children: React.ReactNode
}

const MainContainer = (props: MainContainerProps) => {
    return (
        <div className="main-background">
            <div className="main-container">
                {props.children}
            </div>
        </div>
    )
}

export default MainContainer