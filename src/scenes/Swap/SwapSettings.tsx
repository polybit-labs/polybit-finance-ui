import "./SwapSettings.css"
import { ChangeEvent, useState } from "react";

interface SwapSettingsProps {
    setSlippage: Function;
    slippage: number;
    deadline: number;
    setDeadline: Function;
    setShowSwapSettings: Function;
}

export const SwapSettings = (props: SwapSettingsProps) => {
    const [deadlineInputValue, setDeadlineInputValue] = useState(20)

    const onChangeSlippage = (e: ChangeEvent<HTMLInputElement>) => {
        props.setSlippage(Number(e.target.value) / 100)
    }

    const onChangeDeadline = (e: ChangeEvent<HTMLInputElement>) => {
        props.setDeadline(Number(e.target.value))
    }
    return (
        <div className="swap-settings">
            <div className="swap-settings-slippage">
                <div className="swap-settings-slippage-header">
                    Slippage Tolerance
                </div>
                <div className="swap-settings-slippage-main">
                    <div className="swap-settings-button" style={{
                        backgroundColor: props.slippage == 0.001 ? "#875CFF" : "#F8F8F8",
                        color: props.slippage == 0.001 ? "#ffffff" : "#000000",
                        fontWeight: props.slippage == 0.001 ? "700" : "500"
                    }}
                        onClick={() => props.setSlippage(0.001)}>0.1%</div>
                    <div className="swap-settings-button" style={{
                        backgroundColor: props.slippage == 0.005 ? "#875CFF" : "#F8F8F8",
                        color: props.slippage == 0.005 ? "#ffffff" : "#000000",
                        fontWeight: props.slippage == 0.005 ? "700" : "500"
                    }}
                        onClick={() => props.setSlippage(0.005)}>0.5%</div>
                    <div className="swap-settings-button" style={{
                        backgroundColor: props.slippage == 0.01 ? "#875CFF" : "#F8F8F8",
                        color: props.slippage == 0.01 ? "#ffffff" : "#000000",
                        fontWeight: props.slippage == 0.01 ? "700" : "500"
                    }}
                        onClick={() => props.setSlippage(0.01)}>1.0%</div>
                    <div className="swap-settings-slippage-input" style={{ color: props.slippage >= 0.05 ? "#F74040" : "#000000" }}>
                        <input type="number" min="0.10" max="5" step=".01" value={Number(props.slippage * 100)} onChange={onChangeSlippage} style={{ color: props.slippage >= 0.05 ? "#F74040" : "#000000" }} />%</div>
                </div>
            </div>
            <div className="swap-settings-slippage-warning"></div>
            <div className="swap-settings-deadline">
                <div className="swap-settings-deadline-header">
                    Transaction Deadline (mins)
                </div>
                <div className="swap-settings-deadline-main">
                    <div className="swap-settings-button" style={{
                        backgroundColor: props.deadline == 20 ? "#875CFF" : "#F8F8F8",
                        color: props.deadline == 20 ? "#ffffff" : "#000000",
                        fontWeight: props.deadline == 20 ? "700" : "500"
                    }}
                        onClick={() => props.setDeadline(20)}>20</div>
                    <div className="swap-settings-slippage-input"><input type="number" min="1" max="1000" step="1" value={props.deadline} onChange={onChangeDeadline} /></div>
                </div>
            </div>
        </div>
    )
}