import { useEffect, useState } from 'react';
import { YAxis, ResponsiveContainer, LineChart, Line } from 'recharts'

interface chartProps {
    width: string | number
    height: string | number
    performanceData: Array<any>
}

export const ReturnChartMini = (props: chartProps) => {
    return (
        <ResponsiveContainer width={props.width} height={props.height}>
            <LineChart data={props.performanceData} >
                <Line type="linear" dataKey="index_price" stroke="#875CFF" strokeWidth={4} dot={false} />
                <YAxis domain={["auto", "auto"]} hide={true} />
            </LineChart >
        </ResponsiveContainer>
    )
}