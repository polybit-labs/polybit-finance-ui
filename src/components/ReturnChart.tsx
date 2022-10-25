import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import data from "../product/detfs/BTC-USD.json"

interface chartProps {
    width: string | number
    height: string | number
}

export const ReturnChart = (props: chartProps) => {
    const moment = require('moment')
    const formatXAxis = (tickItem: any) => {
        return moment(tickItem).format("MMM YY")
    }
    const formatYAxis = (tickItem: any) => {
        return `${parseFloat(tickItem).toString()}%`
    }

    return (
        <ResponsiveContainer width={props.width} height={props.height}>
            <LineChart data={data} /* margin={{ top: 5, right: 20, bottom: 5, left: 0 } }*/>
                <Line type="linear" dataKey="Close" stroke="#00C213" strokeWidth={3} dot={false} />
                {/* <CartesianGrid stroke="#EEEEEE" strokeDasharray="5 5" /> */}
                <XAxis dataKey="Date" tickFormatter={formatXAxis} color={"#000000"} tick={{ fontSize: "14px" }} />
                <YAxis tickFormatter={formatYAxis} tick={{ fontSize: "14px" }} />
            </LineChart >
        </ResponsiveContainer>
    )
}