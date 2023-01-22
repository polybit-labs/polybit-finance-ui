import "./CustomTooltip.css"

export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <div className="label" style={{ fontSize: "12px" }}>{`${label}`}</div>
                <div className="intro">{`Change: ${parseFloat((payload[0].payload.pct * 100).toString()).toFixed(2)}%`}</div>
            </div>
        )
    }
    return null
}