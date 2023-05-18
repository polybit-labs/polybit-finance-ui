import { useAccount } from "wagmi"
import { useLocation } from "react-router-dom"
import TitleContainer from "../containers/Title"
import SubTitleContainer from "../containers/SubTitle"
import { Footer } from "../Footer/Footer"
import { useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { WithdrawSummary } from "../WithdrawSummary"
import { WithdrawSuccess } from "../WithdrawSuccess"
import { initialiseGA4 } from "../utils/Analytics"
import ReactGA from "react-ga4"
import { Helmet } from "react-helmet-async"

export const CloseDETF = () => {
    const location = useLocation()
    useEffect(() => {
        initialiseGA4()
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])
    const { category, dimension, detfAddress, totalValue, currentTotalValue, currentReturn, currentReturnPercentage, currency, vsPrices, totalDeposited } = location.state
    const { address: walletOwner, connector, isConnected } = useAccount()
    const [withdrawSuccess, setWithdrawSuccess] = useState(false)

    if (!withdrawSuccess) {
        return (
            <>
                <Helmet>
                    <title>{`Exit Investment Theme | Polybit Finance`}</title>
                    <meta name="description" content="Exit and withdraw funds" />
                    <meta name="robots" content="noindex" />
                </Helmet>
                <TitleContainer title="Exit and withdraw funds" />
                <SubTitleContainer info="By exiting this investment theme, the balance of your funds will be returned to your connected wallet in BNB."
                />
                <WithdrawSummary
                    detfAddress={detfAddress}
                    category={category}
                    dimension={dimension}
                    totalValue={totalValue}
                    currentTotalValue={currentTotalValue}
                    currentReturn={currentReturn}
                    currentReturnPercentage={currentReturnPercentage}
                    totalDeposited={totalDeposited}
                    currency={currency}
                    vsPrices={vsPrices}
                    setWithdrawSuccess={setWithdrawSuccess}
                />
                <Footer />
            </>
        )
    }

    if (withdrawSuccess) {
        return (
            <WithdrawSuccess category={category} dimension={dimension} />
        )
    }

    return (
        <Loading />
    )
}
