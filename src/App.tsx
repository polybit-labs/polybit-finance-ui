import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/pages/Home"
import ScrollToTop from './components/ScrollToTop'
import DETFIndex from './components/pages/DETFIndex'
import Account from './components/pages/Account'
import Deposit from './components/pages/Deposit'
import EstablishDETF from './components/pages/EstablishDETF'
import DETF from './components/pages/DETF'
import { CurrencyContext, CurrencyState } from "./components/utils/Currency"
import { useEffect, useState } from 'react'
import { CloseDETF } from './components/pages/CloseDETF'
import HowItWorks from './components/pages/HowItWorks'
import Privacy from './components/pages/Privacy'
import { Category } from './components/pages/Category'
import ReactGA from "react-ga4"

const App = () => {
  const [currency, setCurrency] = useState<CurrencyState>({ currency: "USD" })
  const BETA_TRACKING_ID = "G-KGE04XZB58"
  const PUBLIC_TRACKING_ID = "G-3J6PET904V"

  if (window.location.href.includes("beta")) {
    ReactGA.initialize(BETA_TRACKING_ID)
  }
  if (!window.location.href.includes("beta" || "dev" || "localhost")) {
    ReactGA.initialize(PUBLIC_TRACKING_ID)
  }

  return (
    <div className="app">
      <Router>
        <ScrollToTop>
          <CurrencyContext.Provider value={currency}>
            <Navbar setCurrency={setCurrency} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detfs" element={<DETFIndex />} />
              <Route path="/category" element={<Category />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/account" element={<Account />} />
              <Route path="/establish-detf" element={<EstablishDETF />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/close-detf" element={<CloseDETF />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/detfs/:urlChainId/:urlCategoryId/:urlDimensionId" element={<DETF />} />
            </Routes>
          </CurrencyContext.Provider>
        </ScrollToTop>
      </Router>
    </div>
  );
}

export default App;
