import { useState } from "react"
import { BsPlusCircle } from "react-icons/bs"
import SendPostWorks from "./sendPost"

export default function CreateButton() {
    const [showCreatePanel, setCreateShowPanel] = useState(false)

    return (
        <>
            <button
                className="flex my-10"
                onClick={async () => {
                    setCreateShowPanel(!showCreatePanel)
                }}
            >
                <BsPlusCircle color="white" size="25" />
                <div className="text-white mx-2">Create</div>
            </button>

            {showCreatePanel == true ? (
                <>
                    <SendPostWorks />
                </>
            ) : (
                <></>
            )}
        </>
    )
}
