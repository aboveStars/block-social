import { urlPrefixForIPFS } from "@/utils/ipfsStuffs"
import { metaDataTemplate } from "@/utils/metadataTemplate"
import { sendJSONToIpfs } from "./pinataOperations"

const svgPrefixForBase64 = "data:image/svg+xml;base64,"
const jsonPrefixForBase64 = "data:application/json;base64,"

/**
 * All params have default value. Feel free.
 * @param {string} _title
 * @param {string} _messageToSend
 * @param {string} _description
 * @returns {string}
 */
export async function generateMetdataUriForTextBased(
    _title,
    _messageToSend,
    _description
) {
    const messageSvg = await generateMessageSVG(_messageToSend)
    const messageSvgString = messageSvg.toString()

    const base64Message = Buffer.from(messageSvgString).toString("base64")

    const mergedWithPrefix = `${svgPrefixForBase64}${base64Message}`
    const finalImageSource = mergedWithPrefix

    let _messageMetaData = { ...metaDataTemplate }

    _messageMetaData.name = _title || "no-title"
    _messageMetaData.description = _description || ""
    _messageMetaData.attributes[0] = {
        trait_Type: "Impact",
        value: 53,
    }
    _messageMetaData.image = finalImageSource

    const metadataUri = await sendJSONToIpfs(_messageMetaData)
    return metadataUri
}

async function generateMessageSVG(_messageToSend) {
    const imageSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 200 200">
        <style>
            div {
            word-wrap: break-word;
            color: white;
            height: 100%;
            font-family: monospace;
            font-size: 10px;
            }
        </style>
        <rect width="100%" height="100%" fill="black" />
        <foreignObject width="200" height="200">
            <div xmlns="http://www.w3.org/1999/xhtml" id="text-container">
            ${_messageToSend}
            </div>
        </foreignObject>
    </svg>
    `
    return imageSvg
}
