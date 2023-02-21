import "./TopDETFs.css"
import { useEffect, useState } from "react"
import { InlineDropDown } from "./dropdowns/InlineDropDown"
import sortDown from "../assets/icons/sort-down-solid.svg"
import { GetTopDETFData } from "./api/GetTopDETFData"
import { TopDETFBox } from "./TopDETFBox"
import { Button } from "./Buttons"
import { Link } from "react-router-dom"

export const TopDETFs = () => {
    const [showTimePeriodDropDown, setShowTimePeriodDropDown] = useState<boolean>(false)
    const [timePeriodFilter, setTimePeriodFilter] = useState<string>("this week")
    const { response: detfDataOneWeek, isSuccess: detfDataSuccessOneWeek } = GetTopDETFData("one_week")
    const { response: detfDataOneMonth, isSuccess: detfDataSuccessOneMonth } = GetTopDETFData("one_month")
    const { response: detfDataOneYear, isSuccess: detfDataSuccessOneYear } = GetTopDETFData("one_year")
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
    const title = <div><h2>Top DETF strategies  <button
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

    if (topDETFData) {
        return (
            <div className="top-detfs-container">
                <h2>{title}</h2>
                {/*<ul className="top-detfs-boxes">
                {topDETFData ? topDETFData.map((detf, index) =>
                    <div key={index}><li>
                        <TopDETFBox
                            category={detf.category}
                            dimension={detf.dimension}
                            returnValue={detf.return_value}
                            totalLiquidity={detf.total_liquidity}
                            urlCategoryId={detf.url_category_id}
                            urlChainId={detf.url_chain_id}
                            urlDimensionId={detf.url_dimension_id}
                            performanceData={detf.performance_data} />
                    </li></div>
                ) : void []}
            </ul> */}

                <ul className="top-detfs-boxes">
                    <li className="top-detf-box-first">
                        <TopDETFBox
                            category={firstResult.category}
                            dimension={firstResult.dimension}
                            returnValue={firstResult.return_value}
                            totalLiquidity={firstResult.total_liquidity}
                            urlCategoryId={firstResult.url_category_id}
                            urlChainId={firstResult.url_chain_id}
                            urlDimensionId={firstResult.url_dimension_id}
                            performanceData={firstResult.performance_data} />
                    </li>
                    <li className="top-detf-box-second">
                        <TopDETFBox
                            category={secondResult.category}
                            dimension={secondResult.dimension}
                            returnValue={secondResult.return_value}
                            totalLiquidity={secondResult.total_liquidity}
                            urlCategoryId={secondResult.url_category_id}
                            urlChainId={secondResult.url_chain_id}
                            urlDimensionId={secondResult.url_dimension_id}
                            performanceData={secondResult.performance_data} />
                    </li>
                    <li className="top-detf-box-third">
                        <TopDETFBox
                            category={thirdResult.category}
                            dimension={thirdResult.dimension}
                            returnValue={thirdResult.return_value}
                            totalLiquidity={thirdResult.total_liquidity}
                            urlCategoryId={thirdResult.url_category_id}
                            urlChainId={thirdResult.url_chain_id}
                            urlDimensionId={thirdResult.url_dimension_id}
                            performanceData={thirdResult.performance_data} />
                    </li>
                </ul>
                <div className="top-detfs-container-button-wrapper">
                    <Link to="/detfs" >
                        <Button buttonStyle="primary" buttonSize="standard" text="View the full DETF Index" />
                    </Link>
                </div>
            </div>
        )
    }

    return (<></>)
}