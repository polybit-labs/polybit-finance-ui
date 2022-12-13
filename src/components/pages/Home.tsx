import Hero from '../Hero'
import TitleContainer from '../containers/Title'
import MainContainer from '../containers/Main'
import Footer from "./Footer"

function Home() {
    return (
        <>
            <TitleContainer title="Invest in Decentralized ETFs" />
            <Hero />
            <MainContainer>

            </MainContainer>
            <Footer />
        </>
    )
}

export default Home