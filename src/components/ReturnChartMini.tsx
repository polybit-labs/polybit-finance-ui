import { Tooltip, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';

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
            </AreaChart >
        </ResponsiveContainer>
    )

    /*     return (
            <ResponsiveContainer width={props.width} height={props.height}>
                <LineChart data={performanceData} margin={{ left: -15 }}>
                    <Line type="linear" dataKey="index_price" stroke="#875CFF" strokeWidth={4} dot={false} />
                </LineChart >
            </ResponsiveContainer>
        ) */
}