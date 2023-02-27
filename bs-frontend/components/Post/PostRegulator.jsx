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
import { generateMetdataUriForTextBased } from "@/scripts/metadataURIGenaratorTB"
import { useNotification } from "web3uikit"

import { Bounce, toast, Zoom } from "react-toastify"
import PostLineUp from "./PostLineUp"

export default function PostRegulator(props) {
    const searchKeyword = props.searchKeyword
    const isAddressValid = Web3.utils.isAddress(searchKeyword)

    const [posts, setPosts] = useState(null)

    const { chainId, account } = useMoralis()
    const { runContractFunction } = useWeb3Contract({})

    const [postsStatus, setPostStatus] = useState("NoStatusProvided")

    const dispatch = useNotification()

    async function postComponentArrayCreator() {
        setPostStatus((a) => "Preparing")
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
                const postSenderOpenSeaSource = `https://testnets.opensea.io/${m.from}`
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
                // ------------------------------------------------------

                const ourAccountImageSource = addressToProfilePhoto(account)
                const ourAccountAddress = account
                const ourAccountOpenSeaSource = `https://testnets.opensea.io/${account}`

                // ------------------------------------------------------

                const contractFunctionCaller = handleContractFunctions

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
                        ourAccountAddress={ourAccountAddress}
                        ourAccountImageSource={ourAccountImageSource}
                        ourAccountOpenSeaSource={ourAccountOpenSeaSource}
                        contractFunctionCaller={contractFunctionCaller}
                    />
                )
            })
        )
        const filteredMainPostComponentArray = mainPostComponentArray.filter(
            (a) => a
        )
        setPostStatus((a) => "Ready")
        setPosts(filteredMainPostComponentArray)
    }

    useEffect(() => {
        if (isAddressValid) {
            postComponentArrayCreator()
        }
    }, [searchKeyword])

    async function handleContractFunctions(action, tokenId, comment) {
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

                try {
                    await runContractFunction({
                        params: approveOptionsForLike,
                        onError: (error) => {
                            console.error(error)
                            throw error
                        },
                        onSuccess: (results) =>
                            handleApproveSuccess(results, "like"),
                    })
                } catch (error) {
                    throw error
                }

                console.log("This will be used for test")

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

                await runContractFunction({
                    params: approveOptionsForUnLike,
                    onError: (error) => {
                        console.error(error)
                        throw error
                    },
                    onSuccess: (results) =>
                        handleApproveSuccess(results, "unLike"),
                })
                console.log("This will be used for test")

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
                        throw error
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
                        throw error
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
                        throw error
                    },
                })

                return tokenUri

            case "sendingComment":
                const _approveOptionsForComment = { ...approveOptions }

                _approveOptionsForComment.abi = blockSocialAbi
                _approveOptionsForComment.contractAddress =
                    contractNetworkInformations["BlockSocial"][
                        Web3.utils.hexToNumberString(chainId)
                    ]
                _approveOptionsForComment.functionName = "mintComment"

                const uri = await generateMetdataUriForTextBased(
                    `Comment for : #${tokenId}`,
                    comment,
                    comment
                )

                _approveOptionsForComment.params = {
                    _tokenIdToComment: tokenId,
                    _uri: uri,
                }

                await runContractFunction({
                    params: _approveOptionsForComment,
                    onError: (error) => {
                        console.log("Error while minting comment")
                        console.error(error)
                        throw error
                    },
                    onSuccess: (results) =>
                        handleApproveSuccess(results, "Comment Sending"),
                })
                console.log("This will be used for test")

            default:
                break
        }
    }

    async function handleApproveSuccess(tx, isForWhat) {
        toast.info(
            `View "${
                isForWhat == "like" ? "❤️" : isForWhat == "unLike" ? "💔" : "💬"
            }"  transaction on Etherscan`,
            {
                closeButton: (
                    <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={() => {
                            window.open(
                                `https://goerli.etherscan.io/tx/${tx.hash.toString()}`,
                                "_blank"
                            )
                        }}
                    >
                        View
                    </button>
                ),
                autoClose: 30000,
                transition: Zoom,
            }
        )
        handleNewNotification(
            "warning",
            `Transaction in Progress 🚀`,
            `"${
                isForWhat == "like" ? "❤️" : isForWhat == "unLike" ? "💔" : "💬"
            }" Waiting for Confirmations`
        )

        console.log(
            `%cWaiting Confirmaitons ==> %c${isForWhat} ==> %chttps://goerli.etherscan.io/tx/${tx.hash.toString()}`,
            `color : #19EEEE`,
            `color : #FF8B00 `,
            `color : #EC5AE7`
        )

        try {
            await tx.wait(1)
        } catch (error) {
            handleNewNotification(
                "error",
                "Transaction Couldn't Confirmed!",
                "Error While Action Confirming"
            )

            toast.error(
                `"${
                    isForWhat == "like"
                        ? "❤️"
                        : isForWhat == "unLike"
                        ? "💔"
                        : "💬"
                }" Transaction Failed`,
                {
                    closeButton: (
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={() => {
                                window.open(
                                    `https://goerli.etherscan.io/tx/${tx.hash.toString()}`,
                                    "_blank"
                                )
                            }}
                        >
                            Analyze
                        </button>
                    ),
                    autoClose: false,
                    transition: Bounce,
                }
            )

            console.error(error)
            return
        }

        handleNewNotification(
            "success",
            `Transaction Confirmed! 🥳`,
            `"${
                isForWhat == "like" ? "❤️" : isForWhat == "unLike" ? "💔" : "💬"
            }" Action Successfully Sent!`
        )

        console.log(
            `%cConfirmed ==> %c${isForWhat}`,
            `color: #0DE54B`,
            `color: #FF8B00`
        )
    }

    function handleNewNotification(_type, _title, _message) {
        dispatch({
            type: _type,
            message: _message,
            title: _title,
            position: "topR",
        })
    }

    return (
        <>
            <PostLineUp posts={posts} postsStatus={postsStatus} />
        </>
    )
}
