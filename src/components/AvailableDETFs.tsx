import { useAccount, useNetwork } from "wagmi"
import { Interface } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import PolybitDETFFactoryInterface from "../chain_info/IPolybitDETFFactory.json"
import polybitAddresses from "../chain_info/polybitAddresses.json"
import { GetPrice } from "./api/GetPrice"
import { GetPrices } from "./api/GetPrices"
import { GetOrderData } from "./api/GetOrderData"
import { GetOwnedAssets } from "./api/GetOwnedAssets"
import { GetTargetAssets } from "./api/GetTargetAssets"
import { GetDETFAccounts } from "./api/GetDETFAccounts"
import { GetProductData } from "./api/GetProductData"
import { GetPerformanceData } from "./api/GetPerformanceData"
import { GetDETFAccountsDataAll } from "./api/GetDETFAccountsDataAll"
import { useEffect, useState } from "react"
import sortDown from "../assets/icons/sort-down-solid.svg"
import axios from "axios"

export function AvailableDETFs() {
    const IPolybitDETFFactory = new Interface(PolybitDETFFactoryInterface)
    const detfFactoryAddress: string = polybitAddresses["5777"]["detf_factory"]
    const { address: walletOwner, connector, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const array = Array(10)
    let ownedDETFsData: Array<string> = Array(10)

    const { data: ownedDETFs, isError, isLoading, isSuccess } = useContractRead({
        addressOrName: detfFactoryAddress,
        contractInterface: IPolybitDETFFactory,
        functionName: "getDETFAccounts",
        args: [walletOwner],
    })

    if (isSuccess && ownedDETFs) {
        let index = 0
        ownedDETFs.map((address) => {
            ownedDETFsData[index] = address
            index++
        })
    }


    //"0x4D9De6e0d0D956e0FD2fEE0b27f3B9aec5A9FAb7" 
    //"0x395f090d100a3df563a13e94f549d7B6Be9cFe8a"
    //"0x2B722190dfb54b7E94Aa9a3460e7772ee55AA087"
    //"0xEaA68d32FdcdC94f04E8Ada9914a9c5f8bC11545"
    //"0x35EfcC904EB9d853FFcf7Fe91D6e8681B6D9D218"
    //"0xBe7985A4c9004CCF8b05a288bF10e5F87296f10a"

    /* console.log("addresses", ownedDETFsData)
    let detfAddress = ownedDETFsData[0]

    const { response: price } = GetPrice("0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377")
    console.log("GetPrice", price)

    const { response: prices } = GetPrices(["0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377", "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377", "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377", "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377"])
    console.log("GetPrices", prices)

    const { response: detfAccounts, isLoading: detfAccountsLoading, isSuccess: detfAccountsSuccess } = GetDETFAccounts(walletOwner ? walletOwner : "")
    console.log(detfAccounts)

    const { response: detfAccountsData, isLoading: detfAccountsDataLoading, isSuccess: detfAccountsDataSuccess } = GetDETFAccountsData(walletOwner ? walletOwner : "")
    console.log(detfAccountsData)

    const { response: ownedAssets, isLoading: ownedAssetsLoading, isSuccess: ownedAssetsSuccess } = GetOwnedAssets(detfAddress)
    console.log(ownedAssets)

    const { response: targetAssets, isLoading: targetAssetsLoading, isSuccess: targetAssetsSuccess } = GetTargetAssets(detfAddress)
    console.log(targetAssets)

    const { response: orderData, isLoading: orderDataLoading, isSuccess: orderDataSuccess } = GetOrderData(detfAddress, Math.round(10 ** 18 * 2).toString())
    console.log(orderData)

    const S3PATH = "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/detfs/"
    const url = S3PATH + "bnb-smart-chain/defi/dex-liquidity"
    console.log("url", url)

    const { response: productData, isLoading: productDataLoading, isSuccess: productDataSuccess } = GetProductData(url ? url : "")
    console.log(productData)

    const { response: performanceData, isLoading: performanceDataLoading, isSuccess: performanceDataSuccess } = GetPerformanceData(url ? url : "")
    console.log(performanceData) 

    return (
        <>
            <div><b>DETF Accounts</b></div>
            {detfAccountsLoading && (<div>DETF Accounts loading...</div>)}
            {detfAccountsSuccess && (
                <div>{JSON.stringify(detfAccounts)}</div>)}
            <div><b>DETF Accounts Data</b></div>
            {detfAccountsDataLoading && (<div>DETF Accounts Data loading...</div>)}
            {detfAccountsDataSuccess && (
                <div>{JSON.stringify(detfAccountsData)}</div>)}
            <div><b>Owned Assets</b></div>
            {ownedAssetsLoading && (<div>Owned Assets loading...</div>)}
            {ownedAssetsSuccess && (
                <div>{JSON.stringify(ownedAssets)}</div>)}
            <div><b>Target Assets</b></div>
            {targetAssetsLoading && (<div>Target Assets loading...</div>)}
            {targetAssetsSuccess && (
                <div>{JSON.stringify(targetAssets)}</div>
            )}
            <div><b>Product Data</b></div>
            {productDataLoading && (<div>Product Data loading...</div>)}
            {productDataSuccess && (
                <div>{JSON.stringify(productData)}</div>)}
            <div><b>Performance Data</b></div>
            {performanceDataLoading && (<div>Performance Data loading...</div>)}
            {performanceDataSuccess && (
                <div>{JSON.stringify(performanceData)}</div>)}
            <div><b>OrderData</b></div>
            {orderDataLoading && (<div>Order Data loading...</div>)}
            {orderDataSuccess && (
                <div>{JSON.stringify(orderData)}</div>)}
        </>
    )*/

    const categories = ["All", "Defi", "Metaverse", "BSC Index Top 10"]
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const [selectDropDownOption, setDropDownOption] = useState<string>("all categories")
    const toggleDropDown = () => {
        setShowDropDown(!showDropDown)
    }
    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShowDropDown(false)
        }
    }
    const dropDownSelection = (selection: string): void => {
        setDropDownOption(selection)
    }

    function SetFilterOption(filter: string) {
        console.log(filter)
    }

    useEffect(() => {
        SetFilterOption(selectDropDownOption)
    }, [selectDropDownOption, setDropDownOption])

    const GetHeroku = () => {
        const [response, setResponse] = useState<any>()
        const network = useNetwork()
        const rpc = network.chain?.rpcUrls.default
        let isLoading: boolean
        let isSuccess: boolean

        useEffect(() => {
            const token_address = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
            axios.post("https://fierce-tor-79709.herokuapp.com/api/get_price_vs_currency", { "token_address": token_address })
                .then(res => {
                    const prices = {
                        "aud": res.data.aud,
                        "bnb": res.data.bnb,
                        "cny": res.data.cny,
                        "eur": res.data.eur,
                        "idr": res.data.idr,
                        "jpy": res.data.jpy,
                        "krw": res.data.krw,
                        "rub": res.data.rub,
                        "twd": res.data.twd,
                        "usd": res.data.usd
                    }
                    setResponse(prices)
                    console.log(prices)
                })
        }, []);

        if (response === undefined) {
            isLoading = true
            isSuccess = false
        } else {
            isLoading = false
            isSuccess = true
        }
        return { response, isLoading, isSuccess }
    }
    GetHeroku()

    const GetHeroku2 = () => {
        const [response, setResponse] = useState<any>()
        const network = useNetwork()
        const rpc = network.chain?.rpcUrls.default
        let isLoading: boolean
        let isSuccess: boolean

        useEffect(() => {
            axios.get("https://fierce-tor-79709.herokuapp.com/api")
                .then((res) => {
                    setResponse(res.data);
                })
        }, [])

        if (response === undefined) {
            isLoading = true
            isSuccess = false
        } else {
            isLoading = false
            isSuccess = true
        }
        console.log("heroku2", response)
        return { response, isLoading, isSuccess }
    }
    GetHeroku2()

    const GetHeroku3 = () => {
        const token_address = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
        let data: any
        useEffect(() => {
            axios.post("https://fierce-tor-79709.herokuapp.com/api/get_price_vs_currency_test", { "token_address": token_address })
                .then((res) => {
                    console.log("heroku3", res.data)
                })
                .catch((err) => {
                    console.log(err.response)
                })
            /* const prices = {
                "aud": data.aud,
                "bnb": data.bnb,
                "cny": data.cny,
                "eur": data.eur,
                "idr": data.idr,
                "jpy": data.jpy,
                "krw": data.krw,
                "rub": data.rub,
                "twd": data.twd,
                "usd": data.usd
            }
            console.log(prices); */
        }, []);
    }
    GetHeroku3()
    return (
        <div></div>
    )
}

