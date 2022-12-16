import DETFIndexList from '../DETFIndexList'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import Footer from './Footer'
import { useState, useContext, useEffect } from 'react'
import detfIndexInfo from "../../product/detfIndex.json"
import { CurrencyContext } from "../utils/Currency"
import { GetProductData } from '../api/GetProductData'
import { GetPerformanceData } from '../api/GetPerformanceData'
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { Loading } from '../Loading'
import InlineDropDown from '../dropdowns/InlineDropDown'
import sortDown from "../../assets/icons/sort-down-solid.svg"


function DETFIndex() {
    const title = "Invest in Decentralized ETFs"
    const info = "Displaying thematic investment strategies in all categories with all dimensions"
    const currency = useContext(CurrencyContext).currency
    const { response: prices, isLoading: pricesLoading, isSuccess: pricesSuccess } = GetPriceVsCurrency("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const [vsPrices, setVsPrices] = useState({})
    const [showCategoryDropDown, setShowCategoryDropDown] = useState<boolean>(false)
    const [showDimensionDropDown, setShowDimensionDropDown] = useState<boolean>(false)
    const [categoryFilter, setCategoryFilter] = useState<string>("All Categories")
    const [dimensionFilter, setDimensionFilter] = useState<string>("All Dimensions")
    const toggleCategoryDropDown = () => {
        setShowCategoryDropDown(!showCategoryDropDown)
    }
    const toggleDimensionDropDown = () => {
        setShowDimensionDropDown(!showDimensionDropDown)
    }
    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShowCategoryDropDown(false)
            setShowDimensionDropDown(false)
        }
    }
    const categoryDropDownSelection = (selection: string): void => {
        setCategoryFilter(selection)
    }
    const dimensionDropDownSelection = (selection: string): void => {
        setDimensionFilter(selection)
    }

    useEffect(() => {
        setVsPrices(prices ? prices : {})
    }, [pricesLoading, pricesSuccess])

    const S3PATH = "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/detfs/"

    const GetDETFIndex = () => {
        let detfIndex: Array<any> = []
        let isLoading: boolean = false
        let isSuccess: boolean = false

        detfIndexInfo?.map((index => {
            const productUrl = `${index.urlChainId}/${index.urlCategoryId}/${index.urlDimensionId}`
            const s3Url = S3PATH + productUrl
            const { response: productData, isLoading: productDataLoading, isSuccess: productDataSuccess } = GetProductData(s3Url)
            const { response: performanceData, isLoading: performanceDataLoading, isSuccess: performanceDataSuccess } = GetPerformanceData(s3Url)
            const GetLogos = () => {
                let logos: Array<string> = []
                productData?.tokens.map((token) => {
                    logos.push(token.image)

                })
                return logos
            }

            if (productDataSuccess && productData && performanceDataSuccess && performanceData) {
                detfIndex.push({
                    "chainId": index.chainId,
                    "chainName": "BNB Smart Chain",
                    "productId": index.productId,
                    "category": index.category,
                    "dimension": index.dimension,
                    "urlChainId": index.urlChainId,
                    "urlCategoryId": index.urlCategoryId,
                    "urlDimensionId": index.urlDimensionId,
                    "logos": GetLogos(),
                    "liquidity": Number(productData.total_liquidity.liquidity_bnb),
                    "returnOneWeek": performanceData[performanceData.length - 1].performance_7d,
                    "returnOneMonth": performanceData[performanceData.length - 1].performance_30d,
                    "returnThreeMonths": performanceData[performanceData.length - 1].performance_90d,
                    "returnOneYear": performanceData[performanceData.length - 1].performance_365d,
                })
            }
        }))

        if (detfIndex[detfIndex.length - 1] === undefined) {
            isLoading = true
            isSuccess = false
        } else {
            isLoading = false
            isSuccess = true
        }
        return { detfIndex, isLoading, isSuccess }
    }

    const { detfIndex: detfData, isLoading, isSuccess } = GetDETFIndex()
    const categories = ["All Categories"]
    const dimensions = ["All Dimensions"]
    const subTitle = <div>Displaying thematic investment strategies in <button
        className="inline-dropdown"
        onClick={(): void => { toggleCategoryDropDown(); setDimensionFilter("All Dimensions") }}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
        }
    >
        {categoryFilter === "All Categories" && <div>{categoryFilter.toLowerCase()} <img src={sortDown} height="20px" width="20px"></img></div>}
        {categoryFilter !== "All Categories" && <div>{categoryFilter} <img src={sortDown} height="20px" width="20px"></img></div>}
        {showCategoryDropDown && (
            <InlineDropDown
                options={categories}
                showDropDown={false}
                toggleDropDown={(): void => toggleCategoryDropDown()}
                selectedOption={categoryDropDownSelection}
            />
        )}
    </button> with <button
        className="inline-dropdown"
        onClick={(): void => toggleDimensionDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
        }
    >
            {dimensionFilter === "All Dimensions" && <div>{dimensionFilter.toLowerCase()} <img src={sortDown} height="20px" width="20px"></img></div>}
            {dimensionFilter !== "All Dimensions" && <div>{dimensionFilter} <img src={sortDown} height="20px" width="20px"></img></div>}
            {showDimensionDropDown && (
                <InlineDropDown
                    options={dimensions}
                    showDropDown={false}
                    toggleDropDown={(): void => toggleDimensionDropDown()}
                    selectedOption={dimensionDropDownSelection}
                />
            )}
        </button></div>

    if (detfData.length === detfIndexInfo.length) {
        detfData.map((detf) => {
            if (categories.indexOf(detf.category) === -1) {
                categories.push(detf.category)
            }
        })
        if (categoryFilter === "All Categories") {
            detfData.map((detf) => {
                if (dimensions.indexOf(detf.dimension) === -1) {
                    dimensions.push(detf.dimension)
                }
            })
        }
        if (categoryFilter !== "All Categories") {
            const filtered = detfData.filter(detf => {
                return detf.category === categoryFilter
            })
            filtered.map((detf) => {
                dimensions.push(detf.dimension)
            })
        }

        return (
            <>
                <TitleContainer title={title} />
                <SubTitleContainer info={subTitle} />
                <DETFIndexList detfIndex={detfData} vsPrices={vsPrices} currency={currency} categoryFilter={categoryFilter} dimensionFilter={dimensionFilter} />
                <Footer />
            </>
        )
    }

    return (<>
        <TitleContainer title={title} />
        <SubTitleContainer info={info} />
        <Loading />
        <Footer />
    </>)
}

export default DETFIndex