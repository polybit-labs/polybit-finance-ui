import TitleContainer from "../containers/Title"
import PrivacyPolicy from "../PrivacyPolicy"
import Footer from "./Footer"
import ReactGA from "react-ga4"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { initialiseGA4 } from "../utils/Analytics"

const Privacy = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    return (
        <>
            <TitleContainer title="Privacy Policy" />
            <PrivacyPolicy />
            <Footer />
        </>
    )
}

export default Privacy