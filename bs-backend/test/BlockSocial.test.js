const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { postToIpfs } = require("../utils/ipfsPosting")

describe("BlockSocial", async function () {
    let blockSocial

    beforeEach(async function () {
        /** Contract Deploying... */
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

    describe("Like System Working Right", () => {
        beforeEach(async function () {
            /** NFT MINTING */
            const tx = await blockSocial.minting("An Uri")
            await tx.wait(1)
        })

        it("Is 'tokenId' valid ?", async () => {
            await expect(blockSocial.like("1")).to.be.revertedWithCustomError(
                blockSocial,
                "BLockSocial_TokenIdNotExist"
            )
        })

        it("Is 'Like System' being secured against to 'reLike'", async () => {
            await new Promise(async (resolve, reject) => {
                blockSocial.once("Liked", async () => {
                    try {
                        await expect(
                            blockSocial.like("0")
                        ).to.be.revertedWithCustomError(
                            blockSocial,
                            "BlockSocial_AlreadyLiked"
                        )
                    } catch (error) {
                        reject(error)
                    }
                    resolve()
                })

                const tx = await blockSocial.like("0")
                await tx.wait(1)
            })
        })

        describe("Is 'Like Count' being counted right ?", () => {
            it("Is like count true for '1' user ?", async () => {
                await new Promise(async (resolve, reject) => {
                    blockSocial.once("Liked", async () => {
                        try {
                            const likeCount = await blockSocial.getLikeCount(
                                "0"
                            )
                            assert.equal(likeCount, "1")
                        } catch (error) {
                            reject(error)
                        }
                        resolve()
                    })

                    const tx = await blockSocial.like("0")
                    await tx.wait(1)
                })
            })

            it("Is like count true for '2' user ?", async () => {
                await new Promise(async (resolve, reject) => {
                    blockSocial.once("Liked", async () => {
                        resolve()
                    })

                    const tx = await blockSocial.like("0")
                    await tx.wait(1)
                })

                await new Promise(async (resolve, reject) => {
                    blockSocial.once("Liked", async () => {
                        try {
                            const likeCount = await blockSocial.getLikeCount(
                                "0"
                            )
                            assert.equal(likeCount, "2")
                        } catch (error) {
                            reject(error)
                        }
                        resolve()
                    })

                    const accounts = await ethers.getSigners()
                    const blockSocialForOtherAccount =
                        await blockSocial.connect(accounts[1])

                    try {
                        const tx = await blockSocialForOtherAccount.like("0")
                        await tx.wait(1)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        })
    })

    describe("UnLike System Working Right", () => {
        beforeEach(async function () {
            /** NFT MINTING */
            const txM = await blockSocial.minting("An Uri")
            await txM.wait(1)
        })

        it("Is 'tokenId' valid ?", async () => {
            const txL = await blockSocial.like("0")
            await txL.wait(1)

            await expect(blockSocial.unLike("1")).to.be.revertedWithCustomError(
                blockSocial,
                "BLockSocial_TokenIdNotExist"
            )
        })

        it("Is 'unLike' System secured for 'unlikes' even not 'liked'", async () => {
            await expect(blockSocial.unLike("0")).to.be.revertedWithCustomError(
                blockSocial,
                "BlockSocial_DidNotEvenLiked"
            )
        })

        it("Is 'tokenId count' true after 'unlike' ", async () => {
            const txL = await blockSocial.like("0")
            await txL.wait(1)

            const txL2 = await blockSocial
                .connect((await ethers.getSigners())[1])
                .like("0")

            await txL2.wait(1)

            const likedCount = await blockSocial.getLikeCount("0")
            const expectedCountAfterUnLike = Number(likedCount) - 1

            await new Promise(async (resolve, reject) => {
                blockSocial.once("UnLiked", async () => {
                    try {
                        const updatedCount = await blockSocial.getLikeCount("0")
                        assert.equal(
                            updatedCount,
                            expectedCountAfterUnLike.toString()
                        )
                    } catch (error) {
                        reject(error)
                    }
                    resolve()
                })

                try {
                    await (await blockSocial.unLike("0")).wait(1)
                } catch (error) {
                    reject(error)
                }
            })
        })
    })
})
