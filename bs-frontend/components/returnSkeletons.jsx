import { Skeleton } from "web3uikit"

export default function ReturnSkeletons({ _length }) {
    return (
        <>
            {Array.from({ length: _length }, (_, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        padding: "10px",
                        border: "1px solid",
                        borderRadius: "20px",
                        width: "250px",
                        gap: "5px",
                        margin: "10px 0",
                    }}
                    className="my-2"
                >
                    <Skeleton theme="image" />
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Skeleton theme="text" />
                        <Skeleton theme="subtitle" width="30%" />
                    </div>
                </div>
            ))}
        </>
    )
}
