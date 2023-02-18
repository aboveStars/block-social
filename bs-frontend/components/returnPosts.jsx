import { urlPrefixForOpensea } from "@/utils/openseaStuff"
import PostBottomPart from "./postsBottomPart"

export default function ReturnPosts({ _posts }) {
    return (
        <div className="overflow-y-scroll h-96 my-5">
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

                return (
                    <div key={postTokenId} className="border border-gray-500">
                        <div className="text-white">{shortSender} </div>
                        <div className="text-white">{postTitle} </div>

                        <img src={postImageSrc} />

                        <div className="text-white">{postDescription}</div>

                        <PostBottomPart
                            _openSeaUrlForImage={`${urlPrefixForOpensea}${postContractAddress}/${postTokenId}`}
                            _tokenId={postTokenId}
                        />
                    </div>
                )
            })}
        </div>
    )
}
