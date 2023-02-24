import { MdSell } from "react-icons/md"
import {
    AiFillLike,
    AiOutlineLike,
    AiFillCloseCircle,
    AiOutlineClose,
} from "react-icons/ai"
import { FaCommentAlt } from "react-icons/fa"
import { RiSendPlaneFill } from "react-icons/ri"
import { useEffect, useState } from "react"
import {
    approveOptions,
    blockSocialAbi,
    contractNetworkInformations,
} from "@/utils/approveOptions"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { generateMetdataUriForTextBased } from "@/scripts/metadataURIGenaratorTB"
import { apolloClient } from "@/pages/_app"
import { gqlCreatorForDesiredTokenIdToComment } from "@/utils/graphQueries"
import waitUntil from "@/utils/waitUntil"
import Web3 from "web3"
import { urlPrefixForIPFS } from "@/utils/ipfsStuffs"
import { commentInformationTemplate } from "@/utils/commentStuff"

import { FcLikePlaceholder, FcLike } from "react-icons/fc"
import {
    addressToNumbers,
    loremPicsumPrefix,
} from "@/utils/addressToPp"

export default function PostBottomPart({
    _postSender,
    _tokenId,
    _showPanel,
    _setShowPanel,
    _directShowPanel,
}) {
    const { runContractFunction } = useWeb3Contract({})
    const [didWeLike, setDidWeLike] = useState(false)
    const dispatch = useNotification()
    const { chainId, account } = useMoralis()

    const [comment, setComment] = useState("")

    const [comments, setComments] = useState([])

    const [smartContractAddress, setSmartContractAddress] = useState("")

    const [likeCount, setLikeCount] = useState("0")
    const [commentCount, setCommentCount] = useState("0")

    const [profilePhoto, setProfilePhoto] = useState()

    useEffect(() => {
        if ((typeof chainId).toString() !== "undefined" || chainId != null) {
            setSmartContractAddress(
                contractNetworkInformations["BlockSocial"][
                    Web3.utils.hexToNumberString(chainId)
                ]
            )

            getLikeStatus(
                _tokenId,
                contractNetworkInformations["BlockSocial"][
                    Web3.utils.hexToNumberString(chainId)
                ]
            )

            // setShowCommentPanel(false)

            getProfilePhoto()
        }
    }, [chainId, account])

    async function handleApproveSuccess(tx, isForWhat, _fakeComments) {
        handleNewNotification(
            "warning",
            "Transaction in Progress 🚀",
            "Action Waiting for Confirmation"
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
            if (isForWhat == "like") {
                setDidWeLike(false)
                setLikeCount((Number(commentCount) + -1).toString())
            } else if (isForWhat == "unLike") {
                setDidWeLike(true)
                setLikeCount((Number(commentCount) + 1).toString())
            } else if (isForWhat == "sendingComment") {
                const fakeComments = _fakeComments
                fakeComments.pop()
                const updatedComments = fakeComments
                setComments(updatedComments)
            }

            handleNewNotification(
                "error",
                "Transaction Couldn't Confirmed!",
                "Error While Action Confirming"
            )

            console.error(error)
        }

        handleNewNotification(
            "success",
            "Transaction Confirmed! 🥳",
            "Action Successfully Sent!"
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

    async function handleLikeClick(_tokenId) {
        setDidWeLike(true)

        const existedLikeCount = likeCount
        const predictedLikeCount = (Number(existedLikeCount) + 1).toString()

        setLikeCount(predictedLikeCount)

        const _approveOptionsForLike = { ...approveOptions }

        _approveOptionsForLike.abi = blockSocialAbi
        _approveOptionsForLike.contractAddress = smartContractAddress
        _approveOptionsForLike.functionName = "like"
        _approveOptionsForLike.params = {
            _tokenId: _tokenId,
        }

        await runContractFunction({
            params: _approveOptionsForLike,
            onError: (error) => {
                setDidWeLike(false)
                setLikeCount(existedLikeCount)
                console.error(error)
            },
            onSuccess: (results) => handleApproveSuccess(results, "like"),
        })
    }

    async function handleUnLikeClick(_tokenId) {
        setDidWeLike(false)
        const existedLikeCount = likeCount
        const predictedLikeCount = (Number(existedLikeCount) - 1).toString()

        setLikeCount(predictedLikeCount)

        const _approveOptionsForLike = { ...approveOptions }

        _approveOptionsForLike.abi = blockSocialAbi
        _approveOptionsForLike.contractAddress = smartContractAddress
        _approveOptionsForLike.functionName = "unLike"
        _approveOptionsForLike.params = {
            _tokenId: _tokenId,
        }

        await runContractFunction({
            params: _approveOptionsForLike,
            onError: (error) => {
                setDidWeLike(true)
                setLikeCount(existedLikeCount)
                console.error(error)
            },
            onSuccess: (results) => handleApproveSuccess(results, "unLike"),
        })
    }

    async function getLikeStatus(tokenIdForRequest, _contractAddress) {
        if (!_contractAddress) {
            console.log("not today")
            return
        }

        const activeAccountAddress = account

        const _approveOptionsForLikeStatus = { ...approveOptions }

        _approveOptionsForLikeStatus.abi = blockSocialAbi
        _approveOptionsForLikeStatus.contractAddress = _contractAddress
        _approveOptionsForLikeStatus.functionName =
            "getIsThisPersonLikedThisPost"
        _approveOptionsForLikeStatus.params = {
            _tokenId: tokenIdForRequest,
            _personAddress: activeAccountAddress,
        }

        const likeStatus = await runContractFunction({
            params: _approveOptionsForLikeStatus,
            onError: (error) => {
                console.error(error)
            },
        })

        setDidWeLike(likeStatus)

        const _approveOptionsForLikeCount = { ...approveOptions }

        _approveOptionsForLikeCount.abi = blockSocialAbi
        _approveOptionsForLikeCount.contractAddress = _contractAddress
        _approveOptionsForLikeCount.functionName = "getLikeCount"
        _approveOptionsForLikeCount.params = {
            _tokenId: tokenIdForRequest,
        }

        const likeCount = await runContractFunction({
            params: _approveOptionsForLikeCount,
            onError: (error) => {
                console.error(error)
            },
        })

        setLikeCount(likeCount.toString())
    }

    async function getProfilePhoto() {
        const accountAddress = account

        const numberVersionOfAccount = await addressToNumbers(accountAddress)

        const photoCountInServer = 1000

        // I don't understand why but when I put "1" after photoCount... It throws out :(
        const scaledNumber = (numberVersionOfAccount % photoCountInServer) + 1

        const urlForImage = `${loremPicsumPrefix}${scaledNumber}/200`

        setProfilePhoto(urlForImage)
    }

    async function handleCommentButtonClick(_tokenId) {
        const old = { ..._showPanel }
        old[_tokenId] = true
        const updated = old
        _setShowPanel(updated)

        const {
            data: dataFromQuery,
            error,
            loading,
        } = await apolloClient.query({
            query: gqlCreatorForDesiredTokenIdToComment(_tokenId),
        })

        if (loading) {
            await waitUntil(() => loading == false)
        }

        if (error) {
            console.error(
                "There is an error or errors when fetching data from theGraph"
            )
        }

        if (Object.keys(dataFromQuery["commentMinteds"]).length == 0) {
            console.log("Data is empty, ...aborting")
            return
        }

        const commentMinteds = dataFromQuery["commentMinteds"]

        const sortedCommentMinteds = [...commentMinteds]

        sortedCommentMinteds.sort((a, b) => {
            return a["commentTokenId"] - b["commentTokenId"]
        })

        const _comments = sortedCommentMinteds.map(async function (
            commentMinted
        ) {
            const sender = commentMinted.from
            let senderFiltered
            if (sender == account) {
                senderFiltered = "You"
            } else {
                senderFiltered = sender
            }

            const commentTokenId = commentMinted.commentTokenId

            const metadataUri = await getTokenURI(commentTokenId)

            let metadata
            try {
                metadata = await (await fetch(metadataUri)).json()
            } catch (error) {
                console.error("Error while resolving comment metadata-URI")
                return undefined
            }

            const commentContent = metadata.description.toString()

            const commentInformation = { ...commentInformationTemplate }

            commentInformation.sender = senderFiltered
            commentInformation.content = commentContent
            commentInformation.tokenId = commentTokenId

            return commentInformation
        })

        const resolvedComments = await Promise.all(_comments)
        const filteredComments = resolvedComments.filter((_comment) => _comment)

        setComments(filteredComments)
    }

    async function getTokenURI(_tokenId) {
        const _approveOptionsForGettingUri = { ...approveOptions }
        _approveOptionsForGettingUri.abi = blockSocialAbi

        _approveOptionsForGettingUri.contractAddress = smartContractAddress

        _approveOptionsForGettingUri.functionName = "tokenURI"
        _approveOptionsForGettingUri.params = {
            tokenId: _tokenId,
        }

        const _tokenUri = await runContractFunction({
            params: _approveOptionsForGettingUri,
            onError: (error) => {
                console.error(error)
            },
        })

        return _tokenUri
    }

    async function handleSendCommentButtonClick(_tokenId) {
        const _approveOptionsForComment = { ...approveOptions }

        _approveOptionsForComment.abi = blockSocialAbi
        _approveOptionsForComment.contractAddress = smartContractAddress
        _approveOptionsForComment.functionName = "mintComment"

        const uri = await generateMetdataUriForTextBased(
            `Comment for : #${_tokenId}`,
            comment,
            comment
        )

        const prefixedUri = `${urlPrefixForIPFS}${uri}`

        _approveOptionsForComment.params = {
            _tokenIdToComment: _tokenId,
            _uri: prefixedUri,
        }

        /** FAKE FOR USER TO SEE ITS COMMENT ON SCREEN */

        const fakeCommentSender = "You"
        const fakeTokenId = "-1"
        const fakeCommentContent = comment

        const fakeCommentInformation = { ...commentInformationTemplate }

        fakeCommentInformation.sender = fakeCommentSender
        fakeCommentInformation.content = fakeCommentContent
        fakeCommentInformation.tokenId = fakeTokenId

        const existedComments = comments
        existedComments.push(fakeCommentInformation)
        const updatedFakeComments = existedComments

        const resolvedFakeComments = await Promise.all(updatedFakeComments)

        setComments(resolvedFakeComments)
        /** FAKE FOR USER TO SEE ITS COMMENT ON SCREEN */

        await runContractFunction({
            params: _approveOptionsForComment,
            onError: (error) => {
                const fakeExistedFinalComments = resolvedFakeComments
                fakeExistedFinalComments.pop()
                const updatedFinalComments = fakeExistedFinalComments
                setComments(updatedFinalComments)

                console.error(error)
            },
            onSuccess: (results) => {
                handleApproveSuccess(
                    results,
                    "sendingComment",
                    resolvedFakeComments
                )
            },
        })
    }

    return (
        <>
            {console.log("hello")}
            {console.log(comments)}
            {_directShowPanel == false ? (
                <>
                    <div className="flex p-4 justify-between">
                        <div className="flex items-center space-x-2">
                            <img
                                className="w-10 rounded-full"
                                src={profilePhoto}
                                alt="sara"
                            />
                            <h2 className="text-gray-800 font-bold cursor-pointer overflow-hidden overflow-ellipsis w-14">
                                {_postSender}
                            </h2>
                        </div>
                        <div className="flex space-x-2">
                            <div className="flex space-x-1 items-center">
                                <button
                                    onClick={async () => {
                                        await handleCommentButtonClick(_tokenId)
                                    }}
                                >
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-7 w-7 text-gray-600 cursor-pointer"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </span>
                                </button>

                                <span>{commentCount}</span>
                            </div>
                            <div className="flex space-x-1 items-center">
                                <button
                                    onClick={async () => {
                                        if (didWeLike) {
                                            await handleUnLikeClick(_tokenId)
                                        } else {
                                            await handleLikeClick(_tokenId)
                                        }
                                    }}
                                >
                                    {didWeLike == true ? (
                                        <>
                                            <FcLike size="27" />
                                        </>
                                    ) : (
                                        <>
                                            <FcLikePlaceholder size="27" />
                                        </>
                                    )}
                                </button>

                                <span>{likeCount}</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col my-5" style={{ height: "500px" }}>
                    <div className="container w-11/12 mx-auto p-4 bg-gray-100 rounded-t-xl flex">
                        <div className="container flex justify-start">
                            <div>Comments</div>
                        </div>
                        <div className="container flex justify-end">
                            <button
                                onClick={() => {
                                    const existed = { ..._showPanel }
                                    existed[_tokenId] = false
                                    const updated = existed
                                    _setShowPanel(updated)
                                }}
                            >
                                <AiFillCloseCircle size="20" />
                            </button>
                        </div>
                    </div>

                    <div className="container w-11/12 mx-auto p-4 space-y-4 bg-gray-100 overflow-y-scroll">
                        <div className="text-blue-500">
                            {Object.keys(comments).length > 0 ? (
                                <ul className="space-y-4">
                                    {comments.map(
                                        (commentInformation, index) => {
                                            const sender =
                                                commentInformation.sender

                                            let shortSender
                                            if (sender == "You") {
                                                shortSender = "You"
                                            } else {
                                                shortSender = `${sender.slice(
                                                    0,
                                                    3
                                                )}..${sender.slice(
                                                    sender.length - 3,
                                                    sender.length
                                                )}`
                                            }

                                            const tokenId =
                                                commentInformation.tokenId

                                            const comment =
                                                commentInformation.content

                                            return (
                                                <>
                                                    {tokenId != "-1" ? (
                                                        <>
                                                            <li
                                                                key={index}
                                                                className="flex space-x-2"
                                                            >
                                                                <a
                                                                    href={`https://testnets.opensea.io/assets/goerli/${smartContractAddress}/${tokenId}`}
                                                                    target="_blank"
                                                                >
                                                                    <img
                                                                        className="w-8 h-8 rounded-full bg-gray-200"
                                                                        src={
                                                                            profilePhoto
                                                                        }
                                                                    />
                                                                    <div>
                                                                        <span className="text-sm font-medium text-gray-900">
                                                                            {
                                                                                shortSender
                                                                            }
                                                                        </span>
                                                                        <p className="text-sm text-gray-800">
                                                                            {
                                                                                comment
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <li
                                                                key={index}
                                                                className="flex space-x-2"
                                                            >
                                                                <img
                                                                    className="w-8 h-8 rounded-full bg-gray-200"
                                                                    src={
                                                                        profilePhoto
                                                                    }
                                                                ></img>
                                                                <div>
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            shortSender
                                                                        }
                                                                    </span>
                                                                    <p className="text-sm text-gray-800">
                                                                        {
                                                                            comment
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </li>
                                                        </>
                                                    )}
                                                </>
                                            )
                                        }
                                    )}
                                </ul>
                            ) : (
                                <>
                                    {console.log(comments)}
                                    <p className="text-sm text-gray-400">
                                        No comments yet.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="container w-11/12 mx-auto p-4 space-y-4 bg-gray-100 rounded-b-xl">
                        <div className="flex space-x-2">
                            <img
                                className="w-10 h-10 rounded-full"
                                src={profilePhoto}
                            ></img>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                onChange={(e) => {
                                    setComment(e.target.value)
                                }}
                                className="flex-grow bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 px-3 py-2 outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                className="text-blue-500 font-semibold"
                                onClick={async () => {
                                    await handleSendCommentButtonClick(_tokenId)
                                }}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
