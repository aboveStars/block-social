import { useRef, useState } from "react"
import { FcLikePlaceholder, FcLike } from "react-icons/fc"
import { AiFillCloseCircle } from "react-icons/ai"
import html2canvas from "html2canvas"
import { CircularProgress } from "@mui/material"

export default function Post(props) {
    const [likeData, setLikeData] = useState(
        props.likeData || { likeCount: 53, didWeLike: false }
    )

    const [commentData, setCommentData] = useState(
        props.commentData || {
            comments: [
                {
                    who: "0x3434",
                    commentContent: "Wow!",
                    openSeaSource:
                        "https://testnets.opensea.io/assets/goerli/0xdb6f6f88b32793349ca121421777a7615c4b8848/407",
                },
                {
                    who: "0x3434",
                    commentContent: "Omg!",
                    openSeaSource:
                        "https://testnets.opensea.io/assets/goerli/0xdb6f6f88b32793349ca121421777a7615c4b8848/407",
                },
            ],
            commentCount: 34,
        }
    )

    const postSender = props.postSender || "0x5353"
    const postSenderImageSource =
        props.postSenderImageSource || "https://picsum.photos/200/200"
    const postSenderOpenSeaSource =
        props.postSenderOpenSeaSource ||
        "https://testnets.opensea.io/0x5a950467e9BEfAbdACc2f6DC038f7cEEEE340a9a"

    const postImageSource =
        props.postImageSource || "https://picsum.photos/2000"
    const postTitle = props.postTitle || "Nice Day!"
    const postDescription = props.postDescription || "No Description"
    const postTextOnly = props.postTextOnly || "false"

    const postTokenId = props.postTokenId || 0
    const postContractAddress =
        props.postContractAddress ||
        "0xdb6F6f88b32793349CA121421777a7615c4B8848"
    const postOpenSeaSource =
        props.postOpenSeaSource ||
        "https://testnets.opensea.io/assets/goerli/0xdb6f6f88b32793349ca121421777a7615c4b8848/407"

    const ourAccountImageSource =
        props.ourAccountImageSource || "https://picsum.photos/300"
    const ourAccountAddress = props.ourAccountAddress
    const ourAccountOpenSeaSource = props.ourAccountOpenSeaSource

    const contractFunctionCaller = props.contractFunctionCaller

    const [showCommentPanel, setShowCommentPanel] = useState(false)

    const [currentWrittenComment, setCurrentWrittenComment] = useState("")

    const containerRef = useRef(null)

    const [sendCommentStatus, setSendCommentStatus] = useState("clear")

    return (
        <>
            {showCommentPanel === false ? (
                <div className="flex justify-center items-center my-5">
                    <div className="container bg-white rounded-xl shadow-lg transform transition duration-500 hover:shadow-2xl">
                        <div>
                            <h1 className="text-2xl mt-2 ml-4 font-bold text-gray-800 hover:text-gray-900 transition duration-100 overflow-hidden overflow-ellipsis">
                                {postTitle}
                            </h1>
                            <p className="ml-4 mt-1 mb-2 text-gray-700 overflow-hidden overflow-ellipsis">
                                {postDescription}
                            </p>
                        </div>
                        {postTextOnly === "false" ? (
                            <img
                                id="PostImage"
                                className="object-cover"
                                src={postImageSource}
                            />
                        ) : (
                            <></>
                        )}

                        <div className="flex p-3 justify-between">
                            <button
                                className="flex items-center space-x-2"
                                onClick={() => {
                                    window.open(
                                        postSenderOpenSeaSource,
                                        "_blank"
                                    )
                                }}
                            >
                                <img
                                    className="w-10 rounded-full"
                                    src={postSenderImageSource}
                                    alt={postSender}
                                />
                                <h2 className="text-gray-800 font-bold cursor-pointer overflow-hidden overflow-ellipsis w-14">
                                    {postSender}
                                </h2>
                            </button>

                            <div className="flex justify-center items-center mr-5">
                                <button
                                    onClick={() => {
                                        window.open(postOpenSeaSource, "_blank")
                                    }}
                                    className="w-24"
                                >
                                    <img
                                        src="https://storage.googleapis.com/opensea-static/Logomark/OpenSea-Full-Logo%20(dark).svg"
                                        className="object-cover"
                                    />
                                </button>
                            </div>

                            <div className="flex space-x-2">
                                <div className="flex space-x-1 items-center">
                                    <button
                                        onClick={() => {
                                            setShowCommentPanel((a) => true)
                                        }}
                                    >
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-7 w-7 text-gray-600 cursor-pointer"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                            </svg>
                                        </span>
                                    </button>

                                    <span>{commentData.commentCount}</span>
                                </div>
                                <div className="flex space-x-1 items-center">
                                    <button
                                        onClick={async () => {
                                            handleLikeActions(
                                                !likeData.didWeLike,
                                                setLikeData,
                                                contractFunctionCaller,
                                                postTokenId
                                            )
                                        }}
                                    >
                                        {likeData.didWeLike == true ? (
                                            <>
                                                <FcLike size="27" />
                                            </>
                                        ) : (
                                            <>
                                                <FcLikePlaceholder size="27" />
                                            </>
                                        )}
                                    </button>

                                    <span>{likeData.likeCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="flex flex-col my-5"
                    style={{ maxHeight: "650px" }}
                >
                    <div className="container mx-auto p-4 bg-gray-100 rounded-t-xl flex">
                        <div className="container flex justify-start">
                            <div className="font-bold">Comments</div>
                        </div>
                        <div className="container flex justify-end">
                            <button
                                onClick={() => {
                                    setShowCommentPanel((a) => false)
                                }}
                            >
                                <AiFillCloseCircle size="20" />
                            </button>
                        </div>
                    </div>
                    <div className="container mx-auto p-4 space-y-4 bg-gray-100 overflow-y-auto">
                        <ul className="flex flex-col gap-2">
                            {commentData.comments.map((c, index) => (
                                <li
                                    className={`flex space-x-2  ${
                                        c.who == ourAccountAddress
                                            ? "bg-gray-200"
                                            : ""
                                    }  items-center`}
                                    key={index}
                                >
                                    <button
                                        className="flex gap-2 items-center"
                                        onClick={() => {
                                            window.open(
                                                c.whoOpenSeaSource,
                                                "_blank"
                                            )
                                        }}
                                    >
                                        <img
                                            className="w-8 h-8 rounded-full bg-gray-200"
                                            src={c.whoProfilePhotoSource}
                                        />
                                        <div className="font-bold">
                                            {c.who.slice(0, 4)}...
                                        </div>
                                    </button>

                                    <div className="font-bold">:</div>

                                    <button
                                        onClick={() => {
                                            window.open(
                                                c.openSeaSource,
                                                "blank"
                                            )
                                        }}
                                    >
                                        <div>{c.commentContent}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="container mx-auto p-4 space-y-4 bg-gray-100 rounded-b-xl">
                        <form
                            className="flex space-x-2"
                            onSubmit={async (e) => {
                                e.preventDefault()
                                setSendCommentStatus("sending")
                                let imgData
                                await html2canvas(containerRef.current).then(
                                    (canvas) => {
                                        imgData = canvas.toDataURL()
                                    }
                                )

                                const byteString = atob(imgData.split(",")[1])
                                const mimeString = imgData
                                    .split(",")[0]
                                    .split(":")[1]
                                    .split(";")[0]
                                const ab = new ArrayBuffer(byteString.length)
                                const ia = new Uint8Array(ab)
                                for (let i = 0; i < byteString.length; i++) {
                                    ia[i] = byteString.charCodeAt(i)
                                }
                                const file = new Blob([ab], {
                                    type: mimeString,
                                })

                                await handleCommentActions(
                                    setCommentData,
                                    contractFunctionCaller,
                                    postTokenId,
                                    currentWrittenComment,
                                    file,
                                    ourAccountAddress,
                                    ourAccountImageSource,
                                    ourAccountOpenSeaSource,
                                    setSendCommentStatus
                                )

                                setCurrentWrittenComment("")
                            }}
                        >
                            <img
                                className="w-10 h-10 rounded-full"
                                src={ourAccountImageSource}
                            ></img>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                onChange={(e) => {
                                    setCurrentWrittenComment(e.target.value)
                                }}
                                className="flex-grow bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 px-3 py-2 outline-none focus:border-blue-500"
                                required
                                value={currentWrittenComment}
                                disabled={sendCommentStatus != "clear"}
                            />
                            {sendCommentStatus == "clear" ? (
                                <>
                                    <button
                                        type="submit"
                                        className="text-blue-500 font-semibold"
                                    >
                                        Send
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <CircularProgress />
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}

            <div
                ref={containerRef}
                className="fixed top-0 left-0 -z-10 flex w-96 h-96 items-center justify-center bg-black text-white"
            >
                <p className="break-words font-thin">{currentWrittenComment}</p>
            </div>
        </>
    )
}

async function handleLikeActions(
    toLike,
    likeStateSetter,
    contractFunctionCaller,
    tokenId
) {
    if (toLike) {
        likeStateSetter((prevState) => ({
            ...prevState,
            didWeLike: true,
            likeCount: (Number(prevState.likeCount) + 1).toString(),
        }))

        try {
            await contractFunctionCaller("like", tokenId)
        } catch (error) {
            console.log("Error While contract interaction.... aborting")
            console.error(error)
            likeStateSetter((prevState) => ({
                ...prevState,
                didWeLike: false,
                likeCount: (Number(prevState.likeCount) - 1).toString(),
            }))
        }
    } else {
        likeStateSetter((prevState) => ({
            ...prevState,
            didWeLike: false,
            likeCount: (Number(prevState.likeCount) - 1).toString(),
        }))

        try {
            await contractFunctionCaller("unLike", tokenId)
        } catch (error) {
            console.log("Error on contract interaction, aborting....")
            console.error(error)
            likeStateSetter((prevState) => ({
                ...prevState,
                didWeLike: true,
                likeCount: (Number(prevState.likeCount) + 1).toString(),
            }))
        }
    }
}

async function handleCommentActions(
    commentStateSetter,
    contractFunctionCaller,
    tokenId,
    comment,
    commentFile,
    ourAddress,
    ourAccountImageSource,
    ourAccountOpenSeaSource,
    sendCommentStatusStater
) {
    commentStateSetter((prevState) => {
        const fakeComment = {
            who: ourAddress,
            whoProfilePhotoSource: ourAccountImageSource,
            whoOpenSeaSource: ourAccountOpenSeaSource,
            commentContent: comment,
            openSeaSource: "https://testnets.opensea.io/",
        }
        const updatedCommentDueToCommenting = [...prevState.comments]
        updatedCommentDueToCommenting.push(fakeComment)
        return {
            comments: updatedCommentDueToCommenting,
            commentCount: (Number(prevState.commentCount) + 1).toString(),
        }
    })

    try {
        await contractFunctionCaller(
            "sendingComment",
            tokenId,
            comment,
            commentFile
        )
    } catch (error) {
        sendCommentStatusStater("clear")
        console.log("Error on contract interaction, aborting....")
        console.error(error)

        commentStateSetter((prevState) => {
            const updatedCommentsDueToFail = [...prevState.comments]
            updatedCommentsDueToFail.pop()
            return {
                comments: updatedCommentsDueToFail,
                commentCount: (Number(prevState.commentCount) - 1).toString(),
            }
        })
    }
    sendCommentStatusStater("clear")
}
