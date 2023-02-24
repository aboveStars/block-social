import PostLineUp from "./PostLineUp"
import Web3 from "web3"
import { useEffect, useState } from "react"
import { apolloClient } from "@/pages/_app"
import {
    gqlCreatorForDesiredSenderAddress,
    gqlCreatorForDesiredTokenIdToComment,
} from "@/utils/graphQueries"
import Post from "./Post"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { addressToProfilePhoto } from "@/utils/addressToPp"
import { urlPrefixForOpensea } from "@/utils/openseaStuff"
import {
    approveOptions,
    blockSocialAbi,
    contractNetworkInformations,
} from "@/utils/approveOptions"

export default function PostRegulator(props) {
    const searchKeyword = props.searchKeyword
    const isAddressValid = Web3.utils.isAddress(searchKeyword)

    const [posts, setPosts] = useState(null)

    const { chainId, account } = useMoralis()
    const { runContractFunction } = useWeb3Contract({})

    async function postComponentArrayCreator() {
        const {
            data: dataFromQuery,
            error,
            loading,
        } = await apolloClient.query({
            query: gqlCreatorForDesiredSenderAddress(searchKeyword),
        })
        const mintingFinisheds = dataFromQuery.mintingFinisheds

        const orderedMintingFinisheds = [...mintingFinisheds]
        orderedMintingFinisheds.sort((a, b) => {
            return b.tokenId - a.tokenId
        })

        const mainPostComponentArray = await Promise.all(
            orderedMintingFinisheds.map(async (m) => {
                const likeData = {
                    likeCount: (
                        await handleContractFunctions("likeCount", m.tokenId)
                    ).toString(),
                    didWeLike: await handleContractFunctions(
                        "didPersonLike",
                        m.tokenId
                    ),
                }

                //------------------------------------------------------
                const {
                    data: dataFromQuery,
                    error,
                    loading,
                } = await apolloClient.query({
                    query: gqlCreatorForDesiredTokenIdToComment(m.tokenId),
                })

                const commentMinteds = dataFromQuery.commentMinteds

                const sortedCommentMinteds = [...commentMinteds]

                sortedCommentMinteds.sort((a, b) => {
                    return a.commentTokenId - b.commentTokenId
                })

                const commentObjectsArray = await Promise.all(
                    sortedCommentMinteds.map(async (c) => {
                        let metadataUri
                        try {
                            metadataUri = await handleContractFunctions(
                                "getTokenUri",
                                c.commentTokenId
                            )
                        } catch (error) {
                            console.error(
                                "Error while getting commentMeta uri from chain"
                            )
                            console.error(error)
                        }

                        let metadata
                        try {
                            metadata = await (await fetch(metadataUri)).json()
                        } catch (error) {
                            console.log(`Errored metadata uri: ${metadataUri}`)
                            console.error(
                                "Error while resolving comment metadata-URI"
                            )
                            return undefined
                        }

                        const commentObject = {
                            who: c.from,
                            whoProfilePhotoSource: addressToProfilePhoto(
                                c.from
                            ),
                            whoOpenSeaSource: `https://testnets.opensea.io/${c.from}`,
                            commentContent: metadata.description.toString(),
                            openSeaSource: `https://testnets.opensea.io/assets/goerli/${m.nftAddress}/${c.commentTokenId}`,
                        }

                        return commentObject
                    })
                )

                const filteredCommentsObjectsArray = commentObjectsArray.filter(
                    (a) => a
                )
                const commentCount = Object.keys(
                    filteredCommentsObjectsArray
                ).length
                const comments = filteredCommentsObjectsArray

                const commentData = {
                    commentCount: commentCount,
                    comments: comments,
                }

                // ------------------------------------------------------
                const postSender = m.from
                const postSenderImageSource = addressToProfilePhoto(m.from)
                const postSenderOpenSeaSource = `https://testnets.opensea.io/${account}`
                // ------------------------------------------------------
                let postMetadataURI
                try {
                    postMetadataURI = await handleContractFunctions(
                        "getTokenUri",
                        m.tokenId
                    )
                } catch (error) {
                    console.log(
                        "Error while getting 'post metadata' from chain"
                    )
                    console.error(error)
                }

                let postMetadata
                try {
                    postMetadata = await (await fetch(postMetadataURI)).json()
                } catch (error) {
                    console.error("Metadata URI is not valid!")
                    return undefined
                }
                const postImageSource = postMetadata.image
                const postTitle = postMetadata.name
                const postDescription = postMetadata.description
                // --------------------------------------------------------

                const postTokenId = m.tokenId
                const postContractAddress = m.nftAddress
                // ------------------------------------------------------

                const postOpenSeaSource = `${urlPrefixForOpensea}${postContractAddress}/${postTokenId}`
                const ourAccountImageSource = addressToProfilePhoto(account)

                // ------------------------------------------------------

                const contractFunctionCaller = undefined

                return (
                    <Post
                        likeData={likeData}
                        commentData={commentData}
                        postSender={postSender}
                        postSenderImageSource={postSenderImageSource}
                        postSenderOpenSeaSource={postSenderOpenSeaSource}
                        postImageSource={postImageSource}
                        postTitle={postTitle}
                        postDescription={postDescription}
                        postTokenId={postTokenId}
                        postContractAddress={postContractAddress}
                        postOpenSeaSource={postOpenSeaSource}
                        ourAccountImageSource={ourAccountImageSource}
                        contractFunctionCaller={contractFunctionCaller}
                    />
                )
            })
        )
        const filteredMainPostComponentArray = mainPostComponentArray.filter(
            (a) => a
        )
        console.log(filteredMainPostComponentArray)
        setPosts(filteredMainPostComponentArray)
    }

    useEffect(() => {
        if (isAddressValid) {
            postComponentArrayCreator()
        }
    }, [searchKeyword])

    async function handleContractFunctions(action, tokenId) {
        console.log("Contract Function request received")

        switch (action) {
            case "like":
                const approveOptionsForLike = { ...approveOptions }
                approveOptionsForLike.abi = blockSocialAbi

                approveOptionsForLike.contractAddress =
                    contractNetworkInformations["BlockSocial"][
                        Web3.utils.hexToNumberString(chainId)
                    ]
                approveOptionsForLike.functionName = "like"
                approveOptionsForLike.params = {
                    _tokenId: tokenId,
                }
                console.log(approveOptionsForLike)
                await runContractFunction({
                    params: approveOptionsForLike,
                    onError: (error) => {
                        console.error(error)
                    },
                    onSuccess: () => {
                        console.log("You approved")
                    },
                })
                break
            case "unLike":
                const approveOptionsForUnLike = { ...approveOptions }
                approveOptionsForUnLike.abi = blockSocialAbi

                approveOptionsForUnLike.contractAddress =
                    contractNetworkInformations["BlockSocial"][
                        Web3.utils.hexToNumberString(chainId)
                    ]
                approveOptionsForUnLike.functionName = "unLike"
                approveOptionsForUnLike.params = {
                    _tokenId: tokenId,
                }
                console.log(approveOptionsForUnLike)
                await runContractFunction({
                    params: approveOptionsForUnLike,
                    onError: (error) => {
                        console.error(error)
                    },
                    onSuccess: () => {
                        console.log("You approved")
                    },
                })

                break
            case "likeCount":
                const approveOptionsForLikeCount = { ...approveOptions }

                approveOptionsForLikeCount.abi = blockSocialAbi
                approveOptionsForLikeCount.contractAddress =
                    contractNetworkInformations["BlockSocial"][
                        Web3.utils.hexToNumberString(chainId)
                    ]
                approveOptionsForLikeCount.functionName = "getLikeCount"
                approveOptionsForLikeCount.params = {
                    _tokenId: tokenId,
                }

                const likeCount = await runContractFunction({
                    params: approveOptionsForLikeCount,
                    onError: (error) => {
                        console.error(error)
                    },
                })

                return likeCount

            case "didPersonLike":
                const _approveOptionsForLikeStatus = { ...approveOptions }

                _approveOptionsForLikeStatus.abi = blockSocialAbi
                _approveOptionsForLikeStatus.contractAddress =
                    contractNetworkInformations["BlockSocial"][
                        Web3.utils.hexToNumberString(chainId)
                    ]
                _approveOptionsForLikeStatus.functionName =
                    "getIsThisPersonLikedThisPost"
                _approveOptionsForLikeStatus.params = {
                    _tokenId: tokenId,
                    _personAddress: account,
                }

                const likeStatus = await runContractFunction({
                    params: _approveOptionsForLikeStatus,
                    onError: (error) => {
                        console.error(error)
                    },
                })

                return likeStatus

            case "getTokenUri":
                const _approveOptionsForGettingUri = { ...approveOptions }
                _approveOptionsForGettingUri.abi = blockSocialAbi

                _approveOptionsForGettingUri.contractAddress =
                    contractNetworkInformations["BlockSocial"][
                        Web3.utils.hexToNumberString(chainId)
                    ]

                _approveOptionsForGettingUri.functionName = "tokenURI"
                _approveOptionsForGettingUri.params = {
                    tokenId: tokenId,
                }

                const tokenUri = await runContractFunction({
                    params: _approveOptionsForGettingUri,
                    onError: (error) => {
                        console.error(error)
                    },
                })

                return tokenUri

            default:
                break
        }
    }

    return (
        <>
            <PostLineUp posts={posts} />
        </>
    )
}