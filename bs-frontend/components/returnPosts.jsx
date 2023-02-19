import { urlPrefixForOpensea } from "@/utils/openseaStuff"
import { useState } from "react"
import PostBottomPart from "./postsBottomPart"

export default function ReturnPosts({ _posts }) {
    const [showPanel, setShowPanel] = useState({})
    return (
        <>
            {console.log("Heyyyyyy")}
            <div
                className="flex flex-col"
                id="main"
                style={{ maxHeight: "510px" }}
            >
                <div className="overflow-y-scroll flex flex-col">
                    {_posts.map((post) => {
                        const postSender = post.sender
                        const shortSender = `${postSender.slice(
                            0,
                            3
                        )}..${postSender.slice(
                            postSender.length - 3,
                            postSender.length
                        )}`

                        const postTitle = post.title
                        const postImageSrc = post.imageSrc
                        const postDescription = post.description
                        const postContractAddress = post.contractAddress
                        const postTokenId = post.tokenId

                        const openSeaUrlForImage = `${urlPrefixForOpensea}${postContractAddress}/${postTokenId}`

                        console.log(showPanel)
                        console.log(showPanel[postTokenId])

                        return (
                            // <div key={postTokenId} className="bg-white rounded-lg shadow-md p-4 mb-4">
                            //     <div className="text-white">{shortSender} </div>
                            //     <div className="text-white">{postTitle} </div>

                            //     <img src={postImageSrc} />

                            //     <div className="text-white">{postDescription}</div>

                            //     <PostBottomPart
                            //         _openSeaUrlForImage={`${urlPrefixForOpensea}${postContractAddress}/${postTokenId}`}
                            //         _tokenId={postTokenId}
                            //     />
                            // </div>

                            <>
                            
                                {(typeof showPanel[postTokenId]).toString() ===
                                    "undefined" ||
                                showPanel[postTokenId] === false ? (
                                    <div className=" flex justify-center items-center my-5">
                                        <div className="container w-11/12 bg-white rounded-xl shadow-lg transform transition duration-500 hover:shadow-2xl">
                                            <div>
                                                <a
                                                    href={openSeaUrlForImage}
                                                    target="_blank"
                                                >
                                                    <span className="text-white text-xs font-bold rounded-lg bg-green-500 inline-block mt-4 ml-4 py-1.5 px-4">
                                                        Buy
                                                    </span>
                                                </a>

                                                <h1 className="text-2xl mt-2 ml-4 font-bold text-gray-800 hover:text-gray-900 transition duration-100 overflow-hidden overflow-ellipsis">
                                                    {postTitle}
                                                </h1>
                                                <p className="ml-4 mt-1 mb-2 text-gray-700 hover:underline overflow-hidden overflow-ellipsis">
                                                    {postDescription}
                                                </p>
                                            </div>

                                            <img
                                                className="w-full"
                                                src={postImageSrc}
                                            />

                                            <PostBottomPart
                                                _postSender={postSender}
                                                _tokenId={postTokenId}
                                                _setShowPanel={(a) => {
                                                    setShowPanel(a)
                                                }}
                                                _showPanel={showPanel}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-blue-500">
                                            <button
                                                onClick={() => {
                                                    const existed = {...showPanel}
                                                    existed[postTokenId] = false
                                                    setShowPanel(existed)
                                                }}
                                            >
                                                Comments
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
