import "./CustomTooltip.css"

export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label" style={{ fontSize: "12px" }}>{`${label}`}</p>
                <p className="intro">{`Change: ${parseFloat((payload[0].payload.pct).toString()).toFixed(2)}%`}</p>
            </div>
        )
    }
    return null
}