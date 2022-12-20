import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface chartProps {
    width: string | number
    height: string | number
    performanceData: Array<any>
}

export const ReturnChart = (props: chartProps) => {
    const performanceData90d = props.performanceData.slice(-90)
    const moment = require('moment')
    const formatXAxis = (tickItem: any) => {
        return moment(tickItem).format("DD MMM YY")
    }
    const formatYAxis = (tickItem: any) => {
        return `${parseFloat(tickItem).toString()}`
    }

    return (
        <ResponsiveContainer width={props.width} height={props.height}>
            <AreaChart data={performanceData90d} margin={{ left: -15 }}>
                <Area type="monotone" dataKey="index_price" stroke="#875CFF" strokeWidth={2} fillOpacity={1} fill="#DEDDE4" />
                <XAxis dataKey="date" tickFormatter={formatXAxis} color={"#000000"} tick={{ fontSize: "14px" }} />
                <YAxis type="number" domain={['auto', 'auto']} tickFormatter={formatYAxis} tick={{ fontSize: "14px" }} />
                <Tooltip />
            </AreaChart >
        </ResponsiveContainer>
    )
}