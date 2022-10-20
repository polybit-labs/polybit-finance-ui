import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/pages/Home"
import Privacy from "./components/pages/Privacy"
import ScrollToTop from './components/ScrollToTop';
import ProductIndex from './components/pages/ProductIndex';
import Account from './components/pages/Account';
import ConnectWallet from './components/pages/ConnectWallet';
import HowItWorks from './components/pages/HowItWorks';
import Deposit from './components/pages/Deposit';
import Title from './components/Title';
import { AvailableDETFs } from './components/AvailableDETFs';
import EstablishDETF from './components/pages/EstablishDETF';

function App() {
  return (
    <>
      <Router>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detf-index" element={<AvailableDETFs />} />
            <Route path="/how-it-works" element={<AvailableDETFs />} />
            <Route path="/account" element={<Account />} />
            <Route path="/connect-wallet" element={<ConnectWallet returnPath="/" />} />
            <Route path="/establish-detf" element={<EstablishDETF />} />
            <Route path="/deposit" element={<Deposit />} />
          </Routes>
        </ScrollToTop>
      </Router>
    </>
  );
}

export default App;
