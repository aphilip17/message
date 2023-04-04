import React, { ReactElement, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { UserSelect } from '../components/UserSelect'

const Home = ():ReactElement => {

    const year = new Date().getFullYear()

    useEffect(() => {
        localStorage.clear()
    })

    return (
        <div className={styles.container}>
            <Head>
                <title>Frontend Technical test - Leboncoin</title>
                <meta name="description" content="Frontend exercise for developpers who want to join us on leboncoin.fr"></meta>
            </Head>

            <main className={styles.main}>
                <UserSelect />
            </main>

            <footer className={styles.footer}>
                &copy; leboncoin - {year}
            </footer>
        </div>
    )
}

export default Home