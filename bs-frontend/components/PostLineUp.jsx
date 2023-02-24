export default function PostLineUp(props) {
    const posts = props.posts

    return (
        <>
            {posts && (
                <div
                    className="overflow-y-auto scrollbar-hide"
                    style={{
                        maxHeight: "650px",
                    }}
                >
                    <div>{posts.map((post) => post)}</div>
                </div>
            )}
        </>
    )
}
