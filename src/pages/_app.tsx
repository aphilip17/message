import type { AppProps } from 'next/app'
import { getLoggedUserId } from '../utils/getLoggedUserId'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import { useEffect } from 'react'

// Default way to get a logged user
export const loggedUserId = getLoggedUserId()
console.log(loggedUserId)

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);
  return <Component {...pageProps} />
}

export default MyApp
