import { Inter } from "@next/font/google"
import { ConnectButton } from "web3uikit"
import SendPostWorks from "@/components/sendPost"
import GetPosts from "@/components/getPosts"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <div>
            <nav className="bg-gray-900 p-6 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-white text-4xl font-bold tracking-tight text-shadow-lg">
                        BlockSocial
                    </h1>
                </div>
                <div className="flex">
                    <ConnectButton />
                </div>
            </nav>
            <div className="flex">
                <div className="m-5">
                    <SendPostWorks />
                </div>
                <div className="m-5">
                    <GetPosts />
                </div>
            </div>
        </div>
    )
}
