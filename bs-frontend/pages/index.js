import { Inter } from "@next/font/google"
import styles from "@/styles/Home.module.css"
import { ConnectButton } from "web3uikit"
import Link from "next/link"

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

                <div className={styles.grid}>
                    <a
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className={inter.className}>
                            Send Post <span>-&gt;</span>
                        </h2>
                        <p className={inter.className}>
                            Find in-depth information about Next.js features
                            and&nbsp;API.
                        </p>
                    </a>

                    <a
                        href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className={inter.className}>
                            List Posts <span>-&gt;</span>
                        </h2>
                        <p className={inter.className}>
                            Learn about Next.js in an interactive course
                            with&nbsp;quizzes!
                        </p>
                    </a>
                </div>
            </main>
        </>
    )
}
