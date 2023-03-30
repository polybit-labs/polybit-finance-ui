import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNetwork } from "wagmi"
import { GetProductData, ProductData } from "../api/GetProductData"
import { CategoryDETFBox } from "../CategoryDETFBox"
import { ColourCategories, DETFIconFilename, toTitleCase } from "../utils/Formatting"
import "./Category.css"
import Footer from "./Footer"

export const Category = () => {
    const urlCategoryId = useParams().urlCategoryId
    const { chain } = useNetwork()
    const chainId: string = chain ? chain.id.toString() : "56"
    const productContent = require(`../../product/categories/${urlCategoryId}.json`)

    const productUrl = `${chainId}/${urlCategoryId}/${"liquidity"}`
    const { response: product, isLoading: productDataLoading, isSuccess: productDataSuccess } = GetProductData((productUrl))
    const [productData, setProductData] = useState<ProductData | undefined>()

    useEffect(() => {
        productDataSuccess && setProductData(product)
    }, [productDataSuccess])

    const tokenIcons: Array<string> = []
    productData && productData.tokens.map(token => {
        tokenIcons.push(token.image)
    })
    const iconSizes: Array<any> = [240, 160, 110, 90, 80, 80, 60, 50, 40, 50]
    const leftCoordinates: Array<number> = [
        97,
        18,
        340,
        300,
        10,
        226,
        304,
        350,
        128,
        58
    ]
    const topCoordinates: Array<number> = [
        69,
        0,
        20,
        280,
        230,
        13,
        226,
        150,
        280,
        304
    ]
    const zIndexes: Array<number> = [8, 6, 4, 3, 5, 9, 8, 7, 2, 10, 1]
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const slicedArray = array.slice(0, tokenIcons.length - 1)
    const shuffledArray: Array<any> = slicedArray.sort((a, b) => 0.5 - Math.random())

    if (productContent) {
        return (
            <>
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
                                <div className="category-icons">
                                    {shuffledArray.map((randNumber: number, index: number) =>
                                        <img key={randNumber} className="category-icon" src={tokenIcons[randNumber]} height={`${iconSizes[index]}px`} width={`${iconSizes[index]}px`} style={{ top: topCoordinates[index], left: leftCoordinates[index], zIndex: zIndexes[index] }} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="category-main-mobile">
                            <div className="category-icons-container-mobile">
                                <div className="category-icons">
                                    {shuffledArray.map((randNumber: number, index: number) =>
                                        <img key={randNumber} className="category-icon" src={tokenIcons[randNumber]} height={`${iconSizes[index]}px`} width={`${iconSizes[index]}px`} style={{ top: topCoordinates[index], left: leftCoordinates[index], zIndex: zIndexes[index] }} />
                                    )}
                                </div>
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
                                {productContent && productContent["detfs"].map((detf: any, index: number) =>
                                    <li className="category-detf-box" key={index}>
                                        <CategoryDETFBox chainId={detf.chainId} chainName={detf.chainName} category={detf.category} dimension={detf.dimension} description={detf.description} />
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