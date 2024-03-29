import Hero from './components/Hero/Hero'
import TitleContainer from '../../components/containers/Title'
import { Footer } from '../../components/Footer/Footer'
import { TopDETFs } from './components/TopThemes/TopDETFs'
import ReactGA from "react-ga4"
import { useEffect } from 'react'
import { initialiseGA4 } from '../../components/utils/Analytics'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const Home = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])

    return (
        <>
            <Helmet>
                <title>Polybit Finance</title>
                <meta name="description" content="Invest in ideas of the future." />
            </Helmet>
            <TitleContainer title="Invest in ideas of the future." />
            <Hero />
            <TopDETFs />
            <Footer />
        </>
    )
}

export default Home