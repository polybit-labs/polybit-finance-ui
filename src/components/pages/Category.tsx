import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useParams } from "react-router-dom"
import { CategoryData, GetCategoryData } from "../api/GetCategoryData"
import { CategoryDETFBox } from "../CategoryDETFBox"
import { ColourCategories } from "../utils/Formatting"
import "./Category.css"
import { Footer } from "../Footer/Footer"

export type CategoryProductContent = {
    "category": string;
    "descriptionTitle": string;
    "description": string;
    "detfs": Array<string>;
}

export const Category = () => {
    const urlCategoryId = useParams().urlCategoryId
    const product = require(`../../product/categories/${urlCategoryId}.json`)
    const [productContent, setProductContent] = useState<CategoryProductContent>()
    const { response: category, isSuccess: categoryDataSuccess } = GetCategoryData(urlCategoryId ? urlCategoryId : "")
    const [categoryData, setCategoryData] = useState<Array<CategoryData>>()
    const [combinedData, setCombinedData] = useState<Array<any>>()

    useEffect(() => {
        product && setProductContent(product)
        category && setCategoryData(category)
    }, [urlCategoryId, categoryDataSuccess])

    useEffect(() => {
        let combined: Array<any> = []

        categoryData && productContent && productContent["detfs"].map((i: any) => {
            let performance7d: number = 0
            let performanceData: Array<number> = []
            categoryData?.map((j: any) => {
                if ((i.category.replaceAll(" ", "-").toLowerCase() === j.category) && (i.dimension.replaceAll(" ", "-").toLowerCase() === j.dimension)) {
                    performance7d = j.performance_7d
                    performanceData = j.performance_data
                }
            })
            combined.push({
                "chainId": i.chainId,
                "chainName": i.chainName,
                "category": i.category,
                "description": i.description,
                "dimension": i.dimension,
                "performance7d": performance7d,
                "performanceData": performanceData
            })
        })
        combined && setCombinedData(combined)
    }, [categoryData, productContent])

    if (combinedData && productContent) {
        return (
            <>
                <Helmet>
                    <title>{`${productContent["category"]} DETFs | Polybit Finance`}</title>
                    <meta name="description" content={productContent["descriptionTitle"]} />
                </Helmet>
                <div className="category">
                    <div className="category-container">
                        <div className="category-title">
                            <div className="category-title-name-wrapper">
                                <img className="category-title-name-logo" src={require(`../../assets/icons/${urlCategoryId}.png`)}></img>
                                <div className="category-title-name" style={{ color: ColourCategories(productContent["category"]) }}>
                                    {productContent["category"]}
                                </div>
                            </div>
                        </div>
                        <div className="category-main-desktop">
                            <div className="category-main-content-desktop">
                                <h2>{productContent["descriptionTitle"]}</h2>
                                <br />
                                <p>{productContent["description"]}</p>
                            </div>
                            <div className="category-icons-container-desktop">
                                <img className="category-icons" src={require(`../../assets/images/category_${urlCategoryId}_logos.png`)}></img>
                            </div>
                        </div>
                        <div className="category-main-mobile">
                            <div className="category-icons-container-mobile">
                                <img className="category-icons" src={require(`../../assets/images/category_${urlCategoryId}_logos.png`)}></img>
                            </div>
                            <div className="category-main-content-mobile">
                                <h2>{productContent["descriptionTitle"]}</h2>
                                <br />
                                <p>{productContent["description"]}</p>
                            </div>
                        </div>
                        <div className="category-cta">
                            {`Explore ${productContent["category"]} DETFs`}
                        </div>
                        <div className="category-detfs-container">
                            <ul className="category-detf-boxes">
                                {combinedData && combinedData.map((detf: any, index: number) =>
                                    <li className="category-detf-box" key={index}>
                                        <CategoryDETFBox chainId={detf.chainId} chainName={detf.chainName} category={detf.category} dimension={detf.dimension} description={detf.description} performance7d={detf.performance7d} performanceData={detf.performanceData} />
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (<></>)

}