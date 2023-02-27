import SendPost from "./SendPost/SendPost"

export default function LeftPanel() {
    return (
        <div className="flex flex-col gap-16">
            <a href="http://localhost:3000/">
                <h1 className="text-white text-3xl font-bold tracking-tight text-shadow-lg ">
                    BlockSocial
                </h1>
            </a>
            <SendPost />
        </div>
    )
}
