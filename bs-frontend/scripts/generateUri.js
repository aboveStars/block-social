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

const svgPrefixForBase64 = "data:image/svg+xml;base64,"
const jsonPrefixForBase64 = "data:application/json;base64,"

async function generateFinalURI(_messageToSend, _name) {
    const messageSvg = await generateMessageSVG(_messageToSend)
    const messageSvgString = messageSvg.toString()

    const base64Message = Buffer.from(messageSvgString).toString("base64")

    const mergedWithPrefix = `${svgPrefixForBase64}${base64Message}`
    const finalImageSource = mergedWithPrefix

    let _messageMetaData = { ...metaDataTemplate }

    _messageMetaData.name = _name
    _messageMetaData.description = _messageToSend
    _messageMetaData.attributes[0] = {
        trait_Type: "Impact",
        value: 53,
    }
    _messageMetaData.image = finalImageSource

    const stringMetaData = JSON.stringify(_messageMetaData)
    const base64Meta = Buffer.from(stringMetaData).toString("base64")

    const mergedWithPrefixMeta = `${jsonPrefixForBase64}${base64Meta}`
    const finalMetaCode = mergedWithPrefixMeta

    console.log(finalMetaCode)

    return finalMetaCode
}

async function generateMessageSVG(_messageToSend) {
    const imageSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
        <style>
            div 
                {
                    word-wrap: break-word;
                    color: white; 
                    height: 100%;
                    overflow: scroll; 
                    font-family: monospace;
                    font-size: 14px;
                }
        </style>

        <rect
            width="100%"
            height="100%" 
            fill="black"
        />

        <foreignObject
            x="20"
            y="20"
            width="315px"
            height="315px">
                <div
                    xmlns="http://www.w3.org/1999/xhtml">
                    ${_messageToSend}
                </div>
        </foreignObject>
    </svg>
    `
    return imageSvg
}

export { generateFinalURI }
