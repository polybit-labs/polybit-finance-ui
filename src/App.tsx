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
import { initialiseGA4 } from './components/utils/Analytics';
import EstablishDeposit from './components/pages/EstablishDeposit';
import { HelmetProvider } from "react-helmet-async"
import { Token } from './components/pages/Token';
import { TokenIndex } from './components/pages/TokenIndex';


const App = () => {
  const [currency, setCurrency] = useState<CurrencyState>({ currency: "USD" })
  initialiseGA4()

  return (
    <div className="app">
      <Router>
        <HelmetProvider>
          <ScrollToTop>
            <CurrencyContext.Provider value={currency}>
              <Navbar setCurrency={setCurrency} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detfs" element={<DETFIndex />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/account" element={<Account />} />
                <Route path="/establish-detf" element={<EstablishDETF />} />
                <Route path="/establish-deposit" element={<EstablishDeposit />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/close-detf" element={<CloseDETF />} />
                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/detfs/:urlChainId/:urlCategoryId/:urlDimensionId" element={<DETF />} />
                <Route path="/detfs/category/:urlCategoryId/" element={<Category />} />
                <Route path="/tokens" element={<TokenIndex />} />
                <Route path="/tokens/:urlTokenName/" element={<Token />} />
              </Routes>
            </CurrencyContext.Provider>
          </ScrollToTop>
        </HelmetProvider>
      </Router>
    </div>
  );
}

export default App;
