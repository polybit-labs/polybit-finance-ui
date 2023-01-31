import "./Progress.css"

interface ProgressStage {
    activeStage: string;
}

export function Progress({ activeStage }: ProgressStage) {
    if (activeStage === "establish" ||
        activeStage === "establish-deposit-details" ||
        activeStage === "establish-deposit-summary") {
        return (
            <>
                <div className="progress-section-container">
                    <div className="progress-bar-step-container">
                        <div className="progress-bar-steps">
                            <div className="progress-bar-step">
                                <div className={activeStage === "establish" ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 1</b></p>
                                    <p>Establish DETF</p></div>
                                <div className="progress-bar-step-image">
                                    <div className={activeStage === "establish" ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                    <div className={activeStage === "establish" ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                                </div>
                            </div>
                            <div className="progress-bar-step">
                                <div className={activeStage === "establish-deposit-details" ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 2</b></p>
                                    <p>Deposit details</p></div>
                                <div className="progress-bar-step-image">
                                    <div className={activeStage === "establish-deposit-details" ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                    <div className={activeStage === "establish-deposit-details" ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                                </div>
                            </div>
                            <div className="progress-bar-step">
                                <div className={activeStage === "establish-deposit-summary" ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 3</b></p>
                                    <p>Deposit Summary</p></div>
                                <div className="progress-bar-step-image">
                                    <div className={activeStage === "establish-deposit-summary" ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="progress-section-container-mobile">
                    <div className="progress-bar-step-container-mobile">
                        <div className="progress-bar-step-mobile">
                            <div className="progress-bar-step-title-active">
                                {activeStage === "establish" && <p><b>Step 1 of 3</b></p>}
                                {activeStage === "establish" && <p>Establish DETF</p>}
                                {activeStage === "establish-deposit-details" && <p><b>Step 2 of 3</b></p>}
                                {activeStage === "establish-deposit-details" && <p>Deposit details</p>}
                                {activeStage === "establish-deposit-summary" && <p><b>Step 3 of 3</b></p>}
                                {activeStage === "establish-deposit-summary" && <p>Deposit Summary</p>}
                            </div>
                            <div className="progress-bar-step-image-mobile">
                                <div className="progress-bar-step-line-active"></div>
                                <div className="progress-bar-circle-active"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (activeStage === "deposit-details" ||
        activeStage === "deposit-summary") {
        return (
            <>
                <div className="progress-section-container">
                    <div className="progress-bar-step-container">
                        <div className="progress-bar-steps">
                            <div className="progress-bar-step">
                                <div className={activeStage === "deposit-details" ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 1</b></p>
                                    <p>Deposit details</p></div>
                                <div className="progress-bar-step-image">
                                    <div className={activeStage === "deposit-details" ? "progress-bar-step-line-active" : "progress-bar-step-line"}></div>
                                    <div className={activeStage === "deposit-details" ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                                </div>
                            </div>
                            <div className="progress-bar-step">
                                <div className={activeStage === "deposit-summary" ? "progress-bar-step-title-active" : "progress-bar-step-title"}><p><b>Step 2</b></p>
                                    <p>Deposit Summary</p></div>
                                <div className="progress-bar-step-image">
                                    <div className={activeStage === "deposit-summary" ? "progress-bar-circle-active" : "progress-bar-circle"}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="progress-section-container-mobile">
                    <div className="progress-bar-step-container-mobile">
                        <div className="progress-bar-step-mobile">
                            <div className="progress-bar-step-title-active">
                                {activeStage === "deposit-details" && <p><b>Step 1 of 2</b></p>}
                                {activeStage === "deposit-details" && <p>Deposit details</p>}
                                {activeStage === "deposit-summary" && <p><b>Step 2 of 2</b></p>}
                                {activeStage === "deposit-summary" && <p>Deposit Summary</p>}
                            </div>
                            <div className="progress-bar-step-image-mobile">
                                <div className="progress-bar-step-line-active"></div>
                                <div className="progress-bar-circle-active"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (<div></div>)
}


