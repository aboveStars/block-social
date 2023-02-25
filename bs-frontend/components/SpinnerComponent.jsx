export default function Spinner(props) {
    const size = props.size || "4"
    return (
        <>
            <div
                className={`loader ease-linear rounded-full border-t-8 h-${size} w-${size}`}
            ></div>
        </>
    )
}
