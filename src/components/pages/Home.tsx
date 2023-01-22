import Hero from '../Hero'
import TitleContainer from '../containers/Title'
import MainContainer from '../containers/Main'
import Footer from "./Footer"
import { TopDETFs } from '../TopDETFs'

const Home = () => {
    return (
        <>
            <TitleContainer title="Invest in Decentralized ETFs" />
            <Hero />
            <MainContainer>
                <TopDETFs />
            </MainContainer>
            <Footer />
        </>
    )
}

export default Home