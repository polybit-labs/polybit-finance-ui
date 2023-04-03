import { Helmet } from "react-helmet-async"
import { useParams } from "react-router-dom"
import { CategoryDETFBox } from "../CategoryDETFBox"
import { ColourCategories } from "../utils/Formatting"
import "./Category.css"
import Footer from "./Footer"

export const Category = () => {
    const urlCategoryId = useParams().urlCategoryId
    const productContent = require(`../../product/categories/${urlCategoryId}.json`)

    if (productContent) {
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