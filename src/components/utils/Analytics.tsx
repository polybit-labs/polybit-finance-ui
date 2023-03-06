import ReactGA from "react-ga4"

export const initialiseGA4 = () => {
    const BETA_TRACKING_ID = "G-KGE04XZB58"
    const PUBLIC_TRACKING_ID = "G-3J6PET904V"

    if (!window.location.href.includes("polybit.finance")) {
        ReactGA.initialize(BETA_TRACKING_ID)
    }
    if (window.location.href.includes("polybit.finance")) {
        ReactGA.initialize(PUBLIC_TRACKING_ID)
        console.log(window.location.href.includes("polybit.finance"))
    }
}