import axios from "axios"
import { pinataFileUrl, pinataJSONUrl } from "@/utils/pinataStuffs"

/** Send to IPFS whatever you want except JSON, returns IpfsHash */
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
    return ipfsHash
}

/** Send to JSON to IPFS, returns IpfsHash */
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

    return ipfsHash
}
