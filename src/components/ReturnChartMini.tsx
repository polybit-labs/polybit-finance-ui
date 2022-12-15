import { Tooltip, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface chartProps {
    width: string | number
    height: string | number
    period: string | number
    performanceData: Array<any>
}

export const ReturnChartMini = (props: chartProps) => {
    const performanceData = props.performanceData.slice(-props.period)
    const moment = require('moment')
    const formatXAxis = (tickItem: any) => {
        return moment(tickItem).format("DD MMM YY")
    }
    const formatYAxis = (tickItem: any) => {
        return `${parseFloat(tickItem).toString()}`
    }

    return (
        <ResponsiveContainer width={props.width} height={props.height}>
            <AreaChart data={performanceData} margin={{ left: -15 }}>
                <Area type="monotone" dataKey="index_price" stroke="#875CFF" strokeWidth={2} fillOpacity={1} fill="#DEDDE4" />
                {/* <XAxis dataKey="date" tickFormatter={formatXAxis} color={"#000000"} tick={{ fontSize: "14px" }} />
                <YAxis type="number" domain={['auto', 'auto']} tickFormatter={formatYAxis} tick={{ fontSize: "14px" }} /> */}
            </AreaChart >
        </ResponsiveContainer>
    )
}