import '../styles/globals.css'
import { motion } from 'framer-motion'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AutoBebeSys - Modern Healthcare for Modern Families</title>
        <meta name="description" content="Streamline your pediatric practice with AutoBebeSys" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp 