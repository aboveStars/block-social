const piantaSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv")

const piantaApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET

const pinata = new piantaSDK(piantaApiKey, pinataApiSecret) // to say pinata it is us who works....

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        )

        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        }

        try {
            await pinata
                .pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    responses.push(result)
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.error(error)
        }
    }

    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }
    try {
        const response = await pinata.pinJSONToIPFS(metadata, options)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
