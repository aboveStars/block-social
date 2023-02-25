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
                    <ul>
                        {posts.map((post, index) => (
                            <li key={index}>{post}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}
