import "./SwapSettings.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Button } from "../Buttons";
import { ChangeEvent, useState } from "react";

interface SwapSettingsProps {
    setSlippage: Function;
    slippage: number;
    setShowSwapSettings: Function;
}

export const SwapSettings = (props: SwapSettingsProps) => {
    //const [slippageInputValue, setSlippageInputValue] = useState(0.5)
    const [deadlineInputValue, setDeadlineInputValue] = useState(20)

    const onChangeSlippage = (e: ChangeEvent<HTMLInputElement>) => {
        props.setSlippage(Number(e.target.value) / 100)
    }

    const onChangeDeadline = (e: ChangeEvent<HTMLInputElement>) => {
        setDeadlineInputValue(Number(e.target.value))
    }
    return (
        <div className="swap-settings">
            <div className="swap-settings-container">
                <div className="swap-settings-header">
                    <h2>Settings</h2>
                    <p className="swap-settings-header-close" onClick={() => props.setShowSwapSettings(false)}>
                        <FontAwesomeIcon className="fa-times" icon={icon({ name: "times", style: "solid" })} />
                    </p>
                </div>
                <div className="swap-settings-slippage">
                    <div className="swap-settings-slippage-header">
                        Slippage Tolerance
                    </div>
                    <div className="swap-settings-slippage-main">
                        <Button text="reset" buttonStyle="primary" buttonSize="small" status={props.slippage == 0.005 ? "disabled" : ""} onClick={() => props.setSlippage(0.005)}></Button >
                        <div className="swap-settings-slippage-input"><input type="number" min="0.10" max="5" step=".01" value={Number(props.slippage * 100)} onChange={onChangeSlippage} />%</div>
                    </div>
                </div>
                <div className="swap-settings-slippage-warning"></div>
                <div className="swap-settings-deadline">
                    <div className="swap-settings-deadline-header">
                        Transaction Deadline
                    </div>
                    <div className="swap-settings-deadline-main">
                        <Button text="reset" buttonStyle="primary" buttonSize="small" status={deadlineInputValue == 20 ? "disabled" : ""} onClick={() => setDeadlineInputValue(20)}></Button>
                        <div className="swap-settings-slippage-input"><input type="number" min="1" max="1000" step="1" value={deadlineInputValue} onChange={onChangeDeadline} />mins</div>
                    </div>
                </div>
            </div>
        </div>
    )
}