import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/pages/Home"
import Privacy from "./components/pages/Privacy"
import ScrollToTop from './components/ScrollToTop';
import ProductIndex from './components/pages/ProductIndex';
import Account from './components/pages/Account';
import ConnectWallet from './components/pages/ConnectWallet';

function App() {
  return (
    <>
      <Router>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detf-index" element={<ProductIndex />} />
            <Route path="/how-it-works" element={<Account />} />
            <Route path="/account" element={<Account />} />
            <Route path="/connect-wallet" element={<ConnectWallet returnPath="/" />} />
          </Routes>
        </ScrollToTop>
      </Router>
    </>
  );
}

export default App;
