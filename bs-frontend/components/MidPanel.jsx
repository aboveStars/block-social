import { useState } from "react"
import PostRegulator from "./PostRegulator"
import SearchPanel from "./SearchPanel"

export default function MidPanel() {
    const [searchKeyword, setSearchKeyword] = useState(null)

    return (
        <>
            <SearchPanel
                onDone={(a) => {
                    setSearchKeyword(a)
                }}
            />
            <PostRegulator searchKeyword={searchKeyword} />
        </>
    )
}
