import { useState } from "react"
import { FcLikePlaceholder, FcLike } from "react-icons/fc"
import { AiFillCloseCircle } from "react-icons/ai"

export default function Post(props) {
    const [likeData, setLikeData] = useState(
        props.likeData || { likeCount: 53, didWeLike: false }
    )

    const [commentData, setCommentData] = useState(
        props.comments || {
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
    const postTitle = props.imageTitle || "Nice Day!"
    const postDescription =
        props.postDescription || "I feel very good man like omg.."

    const postTokenId = props.postTokenId || 0
    const postContractAddress =
        props.postContractAddress ||
        "0xdb6F6f88b32793349CA121421777a7615c4B8848"
    const postOpenSeaSource =
        props.postOpenSeaSource ||
        "https://testnets.opensea.io/assets/goerli/0xdb6f6f88b32793349ca121421777a7615c4b8848/407"

    const ourAccountImageSource =
        props.ourAccountImageSource || "https://picsum.photos/300"

    const contractFunctionCaller = props.contraactFunctionCaller

    const [showCommentPanel, setShowCommentPanel] = useState(false)

    return (
        <>
            {showCommentPanel === false ? (
                <div className="flex justify-center items-center my-5">
                    <div className="container w-11/12 bg-white rounded-xl shadow-lg transform transition duration-500 hover:shadow-2xl">
                        <div>
                            <a href={postOpenSeaSource} target="_blank">
                                <span className="text-white text-xs font-bold rounded-lg bg-green-500 inline-block mt-4 ml-4 py-1.5 px-4">
                                    Buy
                                </span>
                            </a>

                            <h1 className="text-2xl mt-2 ml-4 font-bold text-gray-800 hover:text-gray-900 transition duration-100 overflow-hidden overflow-ellipsis">
                                {postTitle}
                            </h1>
                            <p className="ml-4 mt-1 mb-2 text-gray-700 overflow-hidden overflow-ellipsis">
                                {postDescription}
                            </p>
                        </div>

                        <img className="w-full h-80" src={postImageSource} />
                        {"--------------"}
                        <div className="flex p-4 justify-between">
                            <a href={postSenderOpenSeaSource} target="_blank">
                                <div className="flex items-center space-x-2">
                                    <img
                                        className="w-10 rounded-full"
                                        src={postSenderImageSource}
                                        alt={postSender}
                                    />
                                    <h2 className="text-gray-800 font-bold cursor-pointer overflow-hidden overflow-ellipsis w-14">
                                        {postSender}
                                    </h2>
                                </div>
                            </a>

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
                                                contractFunctionCaller
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
                <div className="flex flex-col my-5" style={{ height: "500px" }}>
                    <div className="container w-11/12 mx-auto p-4 bg-gray-100 rounded-t-xl flex">
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
                    <div className="container w-11/12 mx-auto p-4 space-y-4 bg-gray-100 overflow-y-scroll">
                        <ul>
                            {commentData.comments.map((c, index) => (
                                <li key={index}>{c.commentContent}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="container w-11/12 mx-auto p-4 space-y-4 bg-gray-100 rounded-b-xl">
                        <div className="flex space-x-2">
                            <img
                                className="w-10 h-10 rounded-full"
                                src={ourAccountImageSource}
                            ></img>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                onChange={(e) => {
                                    // setComment(e.target.value)
                                }}
                                className="flex-grow bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 px-3 py-2 outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                className="text-blue-500 font-semibold"
                                onClick={async () => {
                                    // await handleSendCommentButtonClick(_tokenId)
                                }}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

async function handleLikeActions(
    toLike,
    likeStateSetter,
    contractFunctionCaller
) {
    if (toLike) {
        console.log("Liked")
        likeStateSetter((prevState) => ({
            ...prevState,
            didWeLike: true,
            likeCount: prevState.likeCount + 1,
        }))
        contractFunctionCaller("like")
    } else {
        console.log("UnLiked")
        likeStateSetter((prevState) => ({
            ...prevState,
            didWeLike: false,
            likeCount: prevState.likeCount - 1,
        }))
        await contractFunctionCaller("unLike")
    }
}
