import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/pages/Home"
import ScrollToTop from './components/ScrollToTop'
import DETFIndex from './components/pages/DETFIndex'
import Account from './components/pages/Account'
import Deposit from './components/pages/Deposit'
import { AvailableDETFs } from './components/AvailableDETFs'
import EstablishDETF from './components/pages/EstablishDETF'
import DETF from './components/pages/DETF'
import { CurrencyContext, CurrencyState } from "./components/utils/Currency"
import { useState } from 'react'
import { CloseDETF } from './components/pages/CloseDETF'
import { Fees } from './components/pages/Fees';
import { SwitchNetwork } from './components/SwitchNetwork';

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
              <Route path="/swap" element={<SwitchNetwork />} />
              <Route path="/how-it-works" element={<AvailableDETFs />} />
              <Route path="/account" element={<Account />} />
              <Route path="/establish-detf" element={<EstablishDETF />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/close-detf" element={<CloseDETF />} />
              <Route path="/detfs/:urlChainId/:urlCategoryId/:urlDimensionId" element={<DETF />} />
              <Route path="/fees" element={<Fees />} />
            </Routes>
          </CurrencyContext.Provider>
        </ScrollToTop>
      </Router>
    </div>
  );
}

export default App;
