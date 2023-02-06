const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")
const { postToIpfs } = require("../utils/ipfsPosting")

describe("BlockSocial", async function () {
    let blockSocial
    let deployer
    beforeEach(async function () {
        /** Contract Deploying... */
        const namedAccounts = await getNamedAccounts()
        deployer = namedAccounts.deployer

        await deployments.fixture(["all"])
        blockSocial = await ethers.getContract("BlockSocial")
    })

    describe("Is Minting Events working ?", () => {
        it("Has 'MintingRequestReceived' been emitted ? ", async function () {
            await new Promise(async (resolve, reject) => {
                blockSocial.once("MintingRequestReceived", async () => {
                    resolve()
                })
                const metaUri = await postToIpfs("1907", false)
                const tx = await blockSocial.minting(metaUri)
                await tx.wait(1)
            })
        })

        it("Has 'MintingFinished been emitted' ?", async function () {
            await new Promise(async (resolve, reject) => {
                blockSocial.once("MintingFinished", async () => {
                    resolve()
                })
                const metaUri = await postToIpfs("1907", false)
                const tx = await blockSocial.minting(metaUri)
                await tx.wait(1)
            })
        })
    })

    describe("Is 'Token Count' working right ?", () => {
        it("Is 'Token Count' 0 at start ?", async () => {
            const tokenCount = await blockSocial.getTokenCount()
            try {
                assert(tokenCount == "0")
            } catch (error) {
                console.error(error)
            }
        })

        it("Will 'Token Count' be 1 after minting", async () => {
            await new Promise(async (resolve, reject) => {
                blockSocial.once("MintingFinished", async () => {
                    const tokenCount = await blockSocial.getTokenCount()
                    try {
                        assert(tokenCount == "1")
                    } catch (error) {
                        reject(error)
                    }
                    resolve()
                })

                const metaUri = await postToIpfs("1907", false)
                const tx = await blockSocial.minting(metaUri)
                await tx.wait(1)
            })
        })

        it("Will 'Token Count' be 2 after 2 minting", async () => {
            await new Promise(async (resolve, reject) => {
                blockSocial.once("MintingFinished", async () => {
                    resolve()
                })

                const metaUri = await postToIpfs("1907", false)
                const tx = await blockSocial.minting(metaUri)
                await tx.wait(1)
            })

            await new Promise(async (resolve, reject) => {
                blockSocial.once("MintingFinished", async () => {
                    const tokenCount = await blockSocial.getTokenCount()
                    try {
                        assert(tokenCount == "2")
                    } catch (error) {
                        reject(error)
                    }
                    resolve()
                })

                const metaUri = await postToIpfs("1907", false)
                const tx = await blockSocial.minting(metaUri)
                await tx.wait(1)
            })
        })
    })

    describe("Is 'tokenURI' right ?", () => {
        it("Is 'tokenURI' rigth for minting 1 NFT", async () => {
            await new Promise(async (resolve, reject) => {
                blockSocial.once("MintingFinished", async () => {
                    let tokenUri
                    try {
                        tokenUri = await blockSocial.tokenURI("0")
                    } catch (error) {
                        reject(error)
                    }

                    try {
                        assert.equal(tokenUri.toString(), metaUri)
                    } catch (error) {
                        console.error(error)
                        reject(error)
                    }
                    resolve()
                })

                const metaUri = await postToIpfs("1907", false)
                const tx = await blockSocial.minting(metaUri)
                await tx.wait(1)
            })
        })

        it("Is 'tokenURI' rigth for minting 2 NFT", async () => {
            await new Promise(async (resolve, reject) => {
                blockSocial.once("MintingFinished", async () => {
                    resolve()
                })

                const metaUri = await postToIpfs("1907", false)
                const tx = await blockSocial.minting(metaUri)
                await tx.wait(1)
            })

            await new Promise(async (resolve, reject) => {
                blockSocial.once("MintingFinished", async () => {
                    let tokenUri
                    try {
                        tokenUri = await blockSocial.tokenURI("1")
                    } catch (error) {
                        reject(error)
                    }

                    try {
                        assert.equal(tokenUri.toString(), metaUri)
                    } catch (error) {
                        console.error(error)
                        reject(error)
                    }
                    resolve()
                })

                const metaUri = await postToIpfs("1881", false)
                const tx = await blockSocial.minting(metaUri)
                await tx.wait(1)
            })
        })
    })
})
