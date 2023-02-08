const piantaSDK = require("@pinata/sdk")
require("dotenv")
const TextToSvg = require("text-to-svg")

const piantaApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET

const pinata = new piantaSDK(piantaApiKey, pinataApiSecret)

async function generateMessageSvg(_messageToSend) {
    const textToSVG = TextToSvg.loadSync()
    const attributes = { fill: "yellow", stroke: "blue" }
    const options = {
        x: 0,
        y: 0,
        fontSize: 36,
        anchor: "top",
        attributes: attributes,
    }

    const svg = textToSVG.getSVG(_messageToSend, options)
    console.log(svg)
    return svg
}

async function storeMetadata(metadata) {
    let response
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }
    try {
        response = await pinata.pinJSONToIPFS(metadata, options)
    } catch (error) {
        console.error(error)
    }
    return response
}

module.exports = { generateMessageSvg, storeMetadata }
