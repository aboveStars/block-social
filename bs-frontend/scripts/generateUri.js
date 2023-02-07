const metaDataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_Type: "",
            value: 0,
        },
    ],
}
// const svgPrefixForBase64 = "data:image/svg+xml;base64,"
const jsonPrefixForBase64 = "data:application/json;base64,"

import { UltimateTextToImage } from "ultimate-text-to-image"

async function generateFinalURI(_messageToSend) {
    const messageEncoded64PrefixedPng = await generateMessagePng(_messageToSend)

    const finalMessageSvg = messageEncoded64PrefixedPng

    let _messageMetaData = { ...metaDataTemplate }

    _messageMetaData.name = "MessageExample"
    _messageMetaData.description = "I don't want to write description"
    _messageMetaData.attributes[0] = {
        trait_Type: "Impact",
        value: 53,
    }
    _messageMetaData.image = finalMessageSvg

    const stringMetaData = JSON.stringify(_messageMetaData)
    const base64Meta = Buffer.from(stringMetaData).toString("base64")

    const mergedWithPrefixMeta = `${jsonPrefixForBase64}${base64Meta}`
    const finalMetaCode = mergedWithPrefixMeta

    console.log(finalMetaCode)

    return finalMetaCode
}

async function generateMessagePng(_messageToSend) {
    const imageUri = new UltimateTextToImage(_messageToSend)
        .render()
        .toDataUrl()
    return imageUri
}

module.exports = { generateFinalURI }
