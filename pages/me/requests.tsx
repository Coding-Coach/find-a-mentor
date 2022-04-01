import React from 'react'
import Layout from '../../src/Me/Me'
import Requests from '../../src/Me/MentorshipRequests'

export default function Index() {
    return (
        <Layout title="Home">
            <Requests />
        </Layout>
    )
}