import DETFIndexList from '../DETFIndexList'
import TitleContainer from '../containers/Title'
import SubTitleContainer from '../containers/SubTitle'
import { Footer } from '../Footer/Footer'
import { useState, useContext, useEffect } from 'react'
import detfIndexInfo from "../../product/detfIndex.json"
import { CurrencyContext } from "../utils/Currency"
import { GetPriceVsCurrency } from '../api/GetPriceVsCurrency'
import { Loading } from '../Loading/Loading'
import { InlineDropDown } from '../dropdowns/InlineDropDown'
import sortDown from "../../assets/icons/sort-down-solid.svg"
import { GetThemeIndexData } from '../api/GetThemeIndexData'
import { useLocation } from 'react-router-dom'
import { initialiseGA4 } from '../utils/Analytics'
import ReactGA from "react-ga4"
import { Helmet } from 'react-helmet-async'

const DETFIndex = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const title = "Invest in familiar themes"
    const info = "Displaying Investment Themes in all categories with all dimensions"
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

    const { response: detfIndexData, isSuccess: detfIndexDataSuccess } = GetThemeIndexData()
    const [detfData, setDETFData] = useState<Array<any>>([])

    useEffect(() => {
        if (detfIndexData && detfIndexData) {
            setDETFData(detfIndexData)
        }
    }, [detfIndexData])

    const categories = ["All Categories"]
    const dimensions = ["All Dimensions"]
    const subTitle = <div><h2>Displaying Investment Themes in <button
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
        </button></h2></div>

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
                <Helmet>
                    <title>{`DETF Index | Polybit Finance`}</title>
                    <meta name="description" content="Displaying Investment Themes in all categories with all dimensions" />
                </Helmet>
                <TitleContainer title={title} />
                <SubTitleContainer info={subTitle} />
                <DETFIndexList detfIndex={detfData} vsPrices={vsPrices} currency={currency} categoryFilter={categoryFilter} dimensionFilter={dimensionFilter} />
                <Footer />
            </>
        )
    }

    return (<>
        <Helmet>
            <title>{`DETF Index | Polybit Finance`}</title>
            <meta name="description" content="Displaying Investment Themes in all categories with all dimensions" />
        </Helmet>
        <TitleContainer title={title} />
        <SubTitleContainer info={info} />
        <Loading />
        <Footer />
    </>)
}

export default DETFIndex