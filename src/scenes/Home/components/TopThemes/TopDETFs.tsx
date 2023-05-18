import "./TopDETFs.css"
import { useEffect, useState } from "react"
import { InlineDropDown } from "../../../../components/dropdowns/InlineDropDown"
import sortDown from "./images/sort-down-solid.svg"
import { GetTopThemeData } from "../../../../components/api/GetTopThemeData"
import { TopDETFBox } from "./TopDETFBox"
import { Button } from "../../../../components/Buttons/Buttons"
import { Link } from "react-router-dom"

export const TopDETFs = () => {
    const [showTimePeriodDropDown, setShowTimePeriodDropDown] = useState<boolean>(false)
    const [timePeriodFilter, setTimePeriodFilter] = useState<string>("this week")
    const { response: detfDataOneWeek, isSuccess: detfDataSuccessOneWeek } = GetTopThemeData("one_week")
    const { response: detfDataOneMonth, isSuccess: detfDataSuccessOneMonth } = GetTopThemeData("one_month")
    const { response: detfDataOneYear, isSuccess: detfDataSuccessOneYear } = GetTopThemeData("one_year")
    const [topDETFData, setTopDETFData] = useState<Array<any>>()
    const firstResult = topDETFData ? topDETFData[0] : []
    const secondResult = topDETFData ? topDETFData[1] : []
    const thirdResult = topDETFData ? topDETFData[2] : []

    useEffect(() => {
        if (detfDataSuccessOneWeek && detfDataOneWeek && timePeriodFilter === "this week") {
            setTopDETFData(detfDataOneWeek)
        }
        if (detfDataSuccessOneMonth && detfDataOneMonth && timePeriodFilter === "this month") {
            setTopDETFData(detfDataOneMonth)
        }
        if (detfDataSuccessOneYear && detfDataOneYear && timePeriodFilter === "this year") {
            setTopDETFData(detfDataOneYear)
        }
    }, [detfDataSuccessOneWeek, detfDataSuccessOneMonth, detfDataSuccessOneYear, timePeriodFilter])

    const toggleTimePeriodDropDown = () => {
        setShowTimePeriodDropDown(!showTimePeriodDropDown)
    }
    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShowTimePeriodDropDown(false)
        }
    }
    const timePeriodDropDownSelection = (selection: string): void => {
        setTimePeriodFilter(selection)
    }

    const periods = ["this week", "this month", "this year"]
    const title = <div><h2>Top Investment Themes  <button
        className="inline-dropdown"
        onClick={(): void => toggleTimePeriodDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
        }
    >
        <div>{timePeriodFilter ? timePeriodFilter : "Select ..."} <img src={sortDown} height="20px" width="20px"></img></div>
        {showTimePeriodDropDown && (
            <InlineDropDown
                options={periods}
                showDropDown={false}
                toggleDropDown={(): void => toggleTimePeriodDropDown()}
                selectedOption={timePeriodDropDownSelection}
            />
        )}
    </button></h2></div>

    return (
        <div className="top-detfs-container">
            <h2>{title}</h2>
            <ul className="top-detfs-boxes">
                <li className="top-detf-box-first">
                    {topDETFData && <TopDETFBox
                        category={firstResult.category}
                        dimension={firstResult.dimension}
                        returnValue={firstResult.return_value}
                        totalLiquidity={firstResult.total_liquidity}
                        urlCategoryId={firstResult.url_category_id}
                        urlChainId={firstResult.url_chain_id}
                        urlDimensionId={firstResult.url_dimension_id}
                        performanceData={firstResult.performance_data} />}
                    {!topDETFData && <div className="top-detfs-box-loading">
                        <img height="60px" width="60px" src={require("../../../../assets/images/polybit-loader-black-on-light-grey-60px.gif")} alt="Loading"></img></div>}
                </li>
                <li className="top-detf-box-second">
                    {topDETFData && <TopDETFBox
                        category={secondResult.category}
                        dimension={secondResult.dimension}
                        returnValue={secondResult.return_value}
                        totalLiquidity={secondResult.total_liquidity}
                        urlCategoryId={secondResult.url_category_id}
                        urlChainId={secondResult.url_chain_id}
                        urlDimensionId={secondResult.url_dimension_id}
                        performanceData={secondResult.performance_data} />}
                    {!topDETFData && <div className="top-detfs-box-loading">
                        <img height="60px" width="60px" src={require("../../../../assets/images/polybit-loader-black-on-light-grey-60px.gif")} alt="Loading"></img></div>}
                </li>
                <li className="top-detf-box-third">
                    {topDETFData && <TopDETFBox
                        category={thirdResult.category}
                        dimension={thirdResult.dimension}
                        returnValue={thirdResult.return_value}
                        totalLiquidity={thirdResult.total_liquidity}
                        urlCategoryId={thirdResult.url_category_id}
                        urlChainId={thirdResult.url_chain_id}
                        urlDimensionId={thirdResult.url_dimension_id}
                        performanceData={thirdResult.performance_data} />}
                    {!topDETFData && <div className="top-detfs-box-loading">
                        <img height="60px" width="60px" src={require("../../../../assets/images/polybit-loader-black-on-light-grey-60px.gif")} alt="Loading"></img></div>}
                </li>
            </ul>
            <div className="top-detfs-container-button-wrapper">
                <Link to="/themes" >
                    <Button buttonStyle="primary" buttonSize="standard" text="View the full Investment Theme Index" />
                </Link>
            </div>
        </div>
    )
}
