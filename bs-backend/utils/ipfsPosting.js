const {
    metaDataTemplate,
    svgPrefixForBase64,
} = require("../helper-hardhat-config")
const { storeMetadata, generateMessageSvg } = require("./upToPinata")

async function postToIpfs(_messageToSend, doWeLog) {
    const messageSvg = await generateMessageSvg(_messageToSend)
    const messageSvgString = messageSvg.toString()

    const base64Message = Buffer.from(messageSvgString).toString("base64")

    const mergedWithPrefix = `${svgPrefixForBase64}${base64Message}`
    finalImageSource = mergedWithPrefix

    let _messageMetaData = { ...metaDataTemplate }

    _messageMetaData.name = "MessageExample"
    _messageMetaData.description = "I don't want to write description"
    _messageMetaData.attributes[0] = {
        trait_Type: "Impact",
        value: 53,
    }
    _messageMetaData.image = finalImageSource

    const metaResponse = await storeMetadata(_messageMetaData)

    const finalMetaIpfsHash = metaResponse.IpfsHash
    if (doWeLog) {
        console.log(`Metadata URI: ${finalMetaIpfsHash}`)
    }
    return finalMetaIpfsHash
}

module.exports = { postToIpfs }
