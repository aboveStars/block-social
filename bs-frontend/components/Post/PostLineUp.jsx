import Skeletons from "../SkeletonComponent"
import ReturnSkeletons from "../SkeletonComponent"
import Spinner from "../SpinnerComponent"

export default function PostLineUp(props) {
    const posts = props.posts
    const postsStatus = props.postsStatus

    return (
        <>
            {postsStatus == "Ready" ? (
                <>
                    {posts && (
                        <div
                            className="overflow-y-auto scrollbar-hide"
                            style={{
                                maxHeight: "650px",
                            }}
                        >
                            <ul>
                                {posts.map((post, index) => (
                                    <li key={index}>{post}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {postsStatus == "Preparing" ? (
                        <>
                            <div
                                className="overflow-y-auto scrollbar-hide"
                                style={{
                                    maxHeight: "650px",
                                }}
                            >
                                <div className="my-5">
                                    <Skeletons />
                                </div>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </>
    )
}
