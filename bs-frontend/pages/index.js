import { Inter } from "@next/font/google"
import { ConnectButton } from "web3uikit"
import SendPostWorks from "@/components/sendPost"
import GetPosts from "@/components/getPosts"
import { useState } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const [desiredAddress, setDesiredAddress] = useState(null)

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
                    <GetPosts _desiredAddress={desiredAddress} />
                </div>

                <div className="relative mb-4">
                    <textarea
                        id="address-input"
                        className="bg-white text-gray-900 rounded-lg py-2 px-4 block w-full appearance-none focus:outline-none focus:shadow-outline"
                        placeholder="Please provide an address for posts..."
                        rows="3"
                        onChange={(evt) => {
                            setDesiredAddress(evt.target.value)
                        }}
                    ></textarea>
                </div>
            </div>
        </div>
    )
}
