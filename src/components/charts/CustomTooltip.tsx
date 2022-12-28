export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="intro">{`Percent Change: ${parseFloat((payload[0].payload.pct).toString()).toFixed(2)}%`}</p>
            </div>
        )
    }
    return null
}