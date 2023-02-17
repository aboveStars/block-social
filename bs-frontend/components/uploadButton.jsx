import { useState } from "react"
import { BsCloudUploadFill } from "react-icons/bs"
import { AiOutlineSend } from "react-icons/ai"
import { sendFileToIpfs, sendJSONToIpfs } from "@/scripts/pinataOperations"
import { metaDataTemplate } from "@/utils/metadataTemplate"

export default function UploadButton() {
    const [showUploadPanel, setShowUploadPanel] = useState(false)
    const [image, setImage] = useState(null)

    async function sendPhotoToIpfs() {
        const file = image
        const imageURI = await sendFileToIpfs(file)
        console.log("IMAGE URI: " + imageURI)

        const imageMetadata = { ...metaDataTemplate }
        imageMetadata.name = "Very Interesting NFT"
        imageMetadata.description = "You will see very interesting nft..."
        imageMetadata.attributes[0] = {
            trait_Type: "Brownie",
            value: "100",
        }
        imageMetadata.image = imageURI
        const json = imageMetadata

        const metadataURI = await sendJSONToIpfs(json)
        console.log("MetadataURI:  " + metadataURI)
    }

    return (
        <>
            <div className="flex flex-col dark: text-white">
                <button
                    onClick={() => {
                        setShowUploadPanel(!showUploadPanel)
                    }}
                >
                    <div className="flex ">
                        <BsCloudUploadFill color="white" size="25" />
                        <div className="ml-2">Upload</div>
                    </div>
                </button>
                {showUploadPanel == true ? (
                    <>
                        <input
                            type="file"
                            onChange={(evt) => {
                                setImage(evt.target.files[0])
                            }}
                        />
                        <button
                            onClick={async () => {
                                await sendPhotoToIpfs()
                            }}
                        >
                            <AiOutlineSend size="15" />
                        </button>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}
