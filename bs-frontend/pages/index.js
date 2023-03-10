import { ConnectButton } from "web3uikit"
import { useMoralis } from "react-moralis"
import MidPanel from "@/components/MidPanel"
import LeftPanel from "@/components/LeftPanel"

export default function Home() {
    const { isWeb3Enabled, account } = useMoralis()

    return (
        <>
            {isWeb3Enabled == true ? (
                <div className="bg-black h-screen">
                    <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-1 p-16">
                        <div className="col-span-1">
                            <LeftPanel />
                        </div>

                        <div className="col-span-1">
                            <MidPanel />
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
            ) : (
                <>
                    <div className="dark: bg-black h-screen">
                        <div className="flex justify-center p-5">
                            <a href="http://localhost:3000/">
                                <h1 className="text-white text-3xl font-bold tracking-tight text-shadow-lg ">
                                    BlockSocial
                                </h1>
                            </a>
                            <ConnectButton />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
