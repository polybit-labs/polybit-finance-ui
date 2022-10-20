import React from 'react'
import DETFIndexList from '../DETFIndexList'
import Title from '../Title'
import Footer from './Footer'

function DETFIndex() {
    const title = "Invest in Decentralized ETFs"
    const info = "Displaying investment strategies in all ecosystems"
    return (
        <>
            <Title title={title} info={info} switchButton={false} />
            <DETFIndexList />
            <Footer />
        </>
    )
}

export default DETFIndex