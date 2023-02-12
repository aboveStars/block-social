import { ConnectButton } from "web3uikit"
import GetPosts from "@/components/getPosts"
import CreateButton from "@/components/createButton"

export default function Home() {
    return (
        <div className="bg-black h-screen">
            <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-1 p-11">
                <div className="col-span-1">
                    <h1 className="text-white text-3xl font-bold tracking-tight text-shadow-lg ">
                        BlockSocial
                    </h1>

                    <CreateButton />
                </div>

                <div className="col-span-1">
                    <GetPosts />
                </div>

                <div className="col-span-1 ml-auto">
                    <ConnectButton />
                </div>
            </div>
            <div className="fixed bottom-5 right-5">
                <a
                    href="https://github.com/aboveStars/block-social"
                    target="_blank"
                >
                    <img
                        src="/github-mark-white.svg"
                        className="w-9 h-9"
                        title="Support me in GitHub"
                    />
                </a>
            </div>
        </div>
    )
}
