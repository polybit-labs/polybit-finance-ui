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
import { useState } from 'react'
import { CloseDETF } from './components/pages/CloseDETF'
import HowItWorks from './components/pages/HowItWorks';
import Privacy from './components/pages/Privacy';

const App = () => {
  const [currency, setCurrency] = useState<CurrencyState>({ currency: "USD" })
  return (
    <div className="app">
      <Router>
        <ScrollToTop>
          <CurrencyContext.Provider value={currency}>
            <Navbar setCurrency={setCurrency} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detfs" element={<DETFIndex />} />
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
