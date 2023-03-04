import SendPost from "./SendPost/SendPost"

export default function LeftPanel() {
    return (
        <div className="flex flex-col gap-16">
            <div>
                <button
                    onClick={() => {
                        window.location.reload(true)
                        console.log("Refresh Please")
                    }}
                >
                    <h1 className="text-white text-3xl font-bold tracking-tight text-shadow-lg ">
                        BlockSocial
                    </h1>
                </button>
            </div>

            <SendPost />
        </div>
    )
}
