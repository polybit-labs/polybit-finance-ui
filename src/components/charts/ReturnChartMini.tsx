import { YAxis, ResponsiveContainer, LineChart, Line } from 'recharts'

interface chartProps {
    width: string | number
    height: string | number
    period: string | number
    performanceData: Array<any>
}

export const ReturnChartMini = (props: chartProps) => {
    const performanceData = props.performanceData.slice(-props.period)

    return (
        <ResponsiveContainer width={props.width} height={props.height}>
            <LineChart data={performanceData} margin={{ left: -15 }}>
                <Line type="linear" dataKey="index_price" stroke="#875CFF" strokeWidth={4} dot={false} />
                <YAxis domain={['auto', 'auto']} hide={true} />
            </LineChart >
        </ResponsiveContainer>
    )
}