import Hero from '../Hero'
import TitleContainer from '../containers/Title'
import Footer from "./Footer"
import { TopDETFs } from '../TopDETFs'
import ReactGA from "react-ga4"
import { useEffect } from 'react'
import { initialiseGA4 } from '../utils/Analytics'
import { useLocation } from 'react-router-dom'

const Home = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])

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