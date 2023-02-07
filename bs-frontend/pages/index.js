import { Inter } from "@next/font/google"
import styles from "@/styles/Home.module.css"
import { Button, ConnectButton, Form } from "web3uikit"
import Link from "next/link"
import SendPostWorks from "@/components/sendPost"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <>
            <main className={styles.main}>
                <nav>
                    <Link href="/">
                        <ConnectButton />
                    </Link>
                </nav>

                <div className={styles.center}>
                    <h1>BLOCK SOCIAL</h1>
                </div>
                <div>
                    <SendPostWorks />
                </div>
            </main>
        </>
    )
}
