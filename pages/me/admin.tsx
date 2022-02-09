import React from 'react'
import Layout from '../../src/Me/Me'
import Admin from '../../src/Me/Routes/Admin'

export default function Index() {
    return (
        <Layout title="Home">
            <Admin />
        </Layout>
    )
}