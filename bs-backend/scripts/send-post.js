const { ethers, network } = require("hardhat")
const { postToIpfs } = require("../utils/ipfsPosting")

async function main() {
    const blockSocial = await ethers.getContract("BlockSocial")

    try {
        const metaUri = await postToIpfs("geçmiş olsun türkiyem sen her \n daim güçlü ve kuvvetlisin", true)
        const tx = await blockSocial.minting(metaUri)
        txR = await tx.wait(1)
    } catch (error) {
        console.error(error)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
