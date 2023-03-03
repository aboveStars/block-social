import { CircularProgress } from "@mui/material"
import { useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import Skeletons from "../SkeletonComponent"
export default function PostLineUp(props) {
    const posts = props.posts

    const pageSetter = props.pageSetter
    const isFetching = props.isFetching
    const hasMore = props.hasMore

    const handleLoadMore = (p) => {
        if (isFetching) {
            return
        }

        pageSetter((a) => a + 1)
    }

    return (
        <>
            <div
                className="overflow-y-auto scrollbar-hide"
                style={{
                    maxHeight: "650px",
                }}
            >
                <InfiniteScroll
                    loadMore={handleLoadMore}
                    hasMore={hasMore}
                    loader={<Skeletons key="loader" />}
                    useWindow={false}
                    initialLoad={false}
                >
                    <ul>
                        {posts.map((post, index) => (
                            <li key={index}>{post}</li>
                        ))}
                    </ul>
                </InfiniteScroll>
            </div>
        </>
    )
}
