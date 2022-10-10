import React from 'react'
import Hero from '../Hero'
import Footer from "./Footer"
import "./Home.css"

function Home() {
    return (
        <>
            <div className="hp-title-section">
                <h1>Invest in Decentralized ETFs</h1>
            </div>
            <Hero />
            <Footer />
        </>
    )
}

export default Home