import { YAxis, ResponsiveContainer, LineChart, Line } from 'recharts'

interface chartProps {
    width: string | number
    height: string | number
    performanceData: Array<any>
}

export const ReturnChartMini = (props: chartProps) => {
    return (
        <ResponsiveContainer width={props.width} height={props.height}>
            <LineChart data={props.performanceData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <Line type="natural" dataKey="index_price" stroke="#875CFF" strokeWidth={4} dot={false} animationDuration={750} />
                <YAxis domain={["auto", "auto"]} hide={true} />
            </LineChart >
        </ResponsiveContainer>
    )
}