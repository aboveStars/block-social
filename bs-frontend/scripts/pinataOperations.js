import axios from "axios"
import { pinataFileUrl, pinataJSONUrl } from "@/utils/pinataStuffs"
import { urlPrefixForIPFS } from "@/utils/ipfsStuffs"

/** Send to IPFS whatever you want except JSON, returns Ipfs Link
 */
export async function sendFileToIpfs(_file) {
    const formData = new FormData()

    const file = _file
    formData.append("file", file)

    const metadata = JSON.stringify({
        name: "name",
    })
    formData.append("pinataMetadata", metadata)

    const options = JSON.stringify({
        cidVersion: 0,
    })
    formData.append("pinataOptions", options)
    let ipfsHash
    try {
        const res = await axios.post(pinataFileUrl, formData, {
            maxBodyLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: process.env.NEXT_PUBLIC_PINATA_JSW,
            },
        })
        ipfsHash = res.data.IpfsHash
    } catch (error) {
        console.error(error.response)
        console.error(error.request)
        console.error(error.message)
        return
    }
    const result = `${urlPrefixForIPFS}${ipfsHash}`
    return result
}

/** Send to JSON to IPFS, returns Ipfs Link
 * @param {JSON} _json
 */
export async function sendJSONToIpfs(_json) {
    var data = JSON.stringify({
        pinataOptions: {
            cidVersion: 1,
        },
        pinataMetadata: {
            name: "testing",
        },
        pinataContent: _json,
    })
    var config = {
        method: "post",
        url: pinataJSONUrl,
        headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_PINATA_JSW,
        },
        data: data,
    }
    let ipfsHash
    try {
        const res = await axios(config)
        ipfsHash = res.data.IpfsHash
    } catch (error) {
        console.error(error.response)
        console.error(error.request)
        console.error(error.message)
        return
    }

    const final = `${urlPrefixForIPFS}${ipfsHash}`

    return final
}
