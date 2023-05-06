import { useContext, useEffect, useState } from "react"
import { CurrencyContext } from "../Currency"
import { GetPriceVsCurrency } from "../../api/GetPriceVsCurrency"
import { BigNumber } from "ethers"

interface BigNumberToCurrencyProps {
    address: string;
    amount: BigNumber;
    decimals: number;
}

interface TokenData {
    market_data: {
        current_price: any
    };
}

const fetchTokenData = async (address: string): Promise<number> => {
    //const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY
    const url = "https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/" + address
    console.log(url)
    const response = await fetch(url);
    const data = await response.json();
    const tokenData: TokenData = data;
    return tokenData.market_data.current_price;
};

export const BigNumberToCurrency = (props: BigNumberToCurrencyProps) => {
    const currency = useContext(CurrencyContext).currency
    const [priceData, setPriceData] = useState<any>({});

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const data = await fetchTokenData(props.address);
            setPriceData(data);
        };
        fetchData();
    }, [props.address]);

    let BigNumberToCurrency: number = 0

    if (priceData) {
        BigNumberToCurrency = (Number(props.amount)
            / 10 ** props.decimals *
            (() => {
                switch (currency) {
                    case "AUD": return (priceData.aud)
                    case "BNB": return (priceData.bnb)
                    case "CNY": return (priceData.cny)
                    case "EURO": return (priceData.eur)
                    case "IDR": return (priceData.idr)
                    case "JPY": return (priceData.jpy)
                    case "KRW": return (priceData.krw)
                    case "RUB": return (priceData.rub)
                    case "TWD": return (priceData.twd)
                    case "USD": return (priceData.usd)
                }
            })())
    }

    return BigNumberToCurrency
}

/* export const BigNumberToCurrency = (props: BigNumberToCurrencyProps) => {
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency(props.address)
    const [vsPrices, setVsPrices] = useState<any>({})

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    let BigNumberToCurrency: number = 0

    if (vsPrices) {
        BigNumberToCurrency = (Number(props.amount)
            / 10 ** props.decimals *
            (() => {
                switch (currency) {
                    case "AUD": return (vsPrices.aud)
                    case "BNB": return (vsPrices.bnb)
                    case "CNY": return (vsPrices.cny)
                    case "EURO": return (vsPrices.eur)
                    case "IDR": return (vsPrices.idr)
                    case "JPY": return (vsPrices.jpy)
                    case "KRW": return (vsPrices.krw)
                    case "RUB": return (vsPrices.rub)
                    case "TWD": return (vsPrices.twd)
                    case "USD": return (vsPrices.usd)
                }
            })())
    }

    return BigNumberToCurrency
} */