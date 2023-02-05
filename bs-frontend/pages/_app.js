import "@/styles/globals.css"
import Head from "next/head"

import { MoralisProvider } from "react-moralis"


export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Block Social</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <Component {...pageProps} />
            </MoralisProvider>
        </div>
    )
}
