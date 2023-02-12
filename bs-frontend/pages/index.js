import { ConnectButton } from "web3uikit"
import SendPostWorks from "@/components/sendPost"
import GetPosts from "@/components/getPosts"

export default function Home() {
    return (
        <div className="bg-black h-screen">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-11">
                <div className="col-span-1">
                    <h1 className="text-white text-3xl font-bold tracking-tight text-shadow-lg ">
                        BlockSocial
                    </h1>
                </div>

                <div className="col-span-1">
                    <GetPosts />
                </div>

                <div className="col-span-1">
                    <ConnectButton />
                </div>
            </div>
        </div>
    )
}
