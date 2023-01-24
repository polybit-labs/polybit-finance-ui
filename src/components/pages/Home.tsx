import Hero from '../Hero'
import TitleContainer from '../containers/Title'
import MainContainer from '../containers/Main'
import Footer from "./Footer"
import { TopDETFs } from '../TopDETFs'

const Home = () => {
    return (
        <>
            <TitleContainer title="Invest in ideas of the future." />
            <Hero />
            <TopDETFs />
            <Footer />
        </>
    )
}

export default Home