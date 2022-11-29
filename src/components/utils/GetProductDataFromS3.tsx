import { useEffect, useState } from "react"
import axios from "axios"

export const GetProductData = (category: string | undefined, dimension: string | undefined, filename: string) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        GetData()
    }, [])
    const GetData = () => {
        if (category && dimension) {
            const url = `https://polybit-finance.s3.ap-southeast-1.amazonaws.com/detfs/bnb-smart-chain/${category}/${dimension}/`

            axios.get(url + filename).then((response) => {
                setData(response.data)
            }).catch((error) => {
                console.log(error)
            })
        }

        if (data) {
            return data
        } else {
            console.log(`Could not get data from S3`)
        }
    }

}