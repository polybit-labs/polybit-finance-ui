import { useState } from "react"
import "./Progress.css"

interface ProgressStage {
    processOrigin: string;
    activeStage: number;
}

export function Progress({ processOrigin, activeStage }: ProgressStage) {
    if (processOrigin === "Connect") {
        return (
            <div className="progress-section-container">
                <div className="progress-bar-step-container">
                    <div className="progress-bar-steps">
                        <div className="progress-bar-step">
                            <div className={activeStage === 1 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 1</b></p>
                                <p>Source of funds</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 1 ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                <div className={activeStage === 1 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                        <div className="progress-bar-step">
                            <div className={activeStage === 2 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 2</b></p>
                                <p>DETF establishment</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 2 ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                <div className={activeStage === 2 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                        <div className="progress-bar-step">
                            <div className={activeStage === 3 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 3</b></p>
                                <p>Investment details</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 3 ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                <div className={activeStage === 3 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                        <div className="progress-bar-step">
                            <div className={activeStage === 4 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 4</b></p>
                                <p>Confirmation</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 4 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    if (processOrigin === "establish") {
        return (
            <div className="progress-section-container">
                <div className="progress-bar-step-container">
                    <div className="progress-bar-steps">
                        <div className="progress-bar-step">
                            <div className={activeStage === 1 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 1</b></p>
                                <p>DETF establishment</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 1 ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                <div className={activeStage === 1 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                        <div className="progress-bar-step">
                            <div className={activeStage === 2 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 2</b></p>
                                <p>Investment details</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 2 ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                <div className={activeStage === 2 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                        <div className="progress-bar-step">
                            <div className={activeStage === 3 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 3</b></p>
                                <p>Confirmation</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 3 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    if (processOrigin === "deposit") {
        return (
            <div className="progress-section-container">
                <div className="progress-bar-step-container">
                    <div className="progress-bar-steps">
                        <div className="progress-bar-step">
                            <div className={activeStage === 1 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 1</b></p>
                                <p>Investment details</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 1 ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                <div className={activeStage === 1 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                        <div className="progress-bar-step">
                            <div className={activeStage === 2 ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 2</b></p>
                                <p>Confirmation</p></div>
                            <div className="progress-bar-step-image">
                                <div className={activeStage === 2 ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
    return (<div></div>)
}


