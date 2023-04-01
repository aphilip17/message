import { ReactElement } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'

import { useUsers } from '../hooks/users'

const Home = ():ReactElement => {
  const year = new Date().getFullYear()
  const { users, isLoading, isError } = useUsers()

    if (isLoading) return <div>Loading</div>
    if (isError) return <div>Error</div>

  return (
    <div className={styles.container}>
      <Head>
        <title>Frontend Technical test - Leboncoin</title>
        <meta name="description" content="Frontend exercise for developpers who want to join us on leboncoin.fr"></meta>
      </Head>

      <main className={styles.main}>
        {JSON.stringify(users)}

        <label htmlFor="users">Choose a user:</label>

        <select name="users" id="users">
            <option value="dog">Dog</option>
        </select>

      </main>

      <footer className={styles.footer}>
        &copy; leboncoin - {year}
      </footer>
    </div>
  )
}

export default Home