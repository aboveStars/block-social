import { MdSell } from "react-icons/md"
import { AiFillLike, AiOutlineLike, AiFillCloseCircle } from "react-icons/ai"
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

export default function PostBottomPart({ _openSeaUrlForImage, _tokenId }) {
    const { runContractFunction } = useWeb3Contract({})
    const [didWeLike, setDidWeLike] = useState(false)
    const dispatch = useNotification()
    const { chainId, account } = useMoralis()

    const [showCommentPanel, setShowCommentPanel] = useState(false)

    const [comment, setComment] = useState("")

    const [finalComments, setFinalComments] = useState([])

    const [smartContractAddress, setSmartContractAddress] = useState("")

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

            setShowCommentPanel(false)
        }
    }, [chainId, account])

    async function handleApproveSuccess(
        tx,
        isForWhat,
        _fakeExistedFinalComments
    ) {
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
            } else if (isForWhat == "unLike") {
                setDidWeLike(true)
            } else if (isForWhat == "sendingComment") {
                const fakeExistedFinalComments = _fakeExistedFinalComments
                fakeExistedFinalComments.pop()
                const updatedFinalComments = fakeExistedFinalComments
                setFinalComments(updatedFinalComments)
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
                console.error(error)
            },
            onSuccess: (results) => handleApproveSuccess(results, "like"),
        })
    }

    async function handleUnClick(_tokenId) {
        console.log("Unliked Botton !")
        setDidWeLike(false)

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
    }

    async function handleCommentButtonClick(_tokenId) {
        setShowCommentPanel(!showCommentPanel)

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

        const finalCommentsWithCommentTokenIdArray = sortedCommentMinteds.map(
            async function (commentMinted) {
                const sender = commentMinted["from"]
                let commentSender

                if (sender == account) {
                    commentSender = "You"
                } else {
                    commentSender = `${sender.slice(0, 3)}...${sender.slice(
                        sender.length - 3,
                        sender.length
                    )}`
                }

                const commentTokenId = commentMinted["commentTokenId"]

                const uriOfComment = await getTokenURI(commentTokenId)
                const jsonMeta = await (await fetch(uriOfComment)).json()
                const comment = jsonMeta.description.toString()

                const finalCommentWithTokenId = [
                    `${commentSender}: ${comment}`,
                    commentTokenId.toString(),
                ]
                return finalCommentWithTokenId // ["1. 0x0..000 = Great!", "1"]
            }
        )

        const resolvedFinalCommentsWithCommentTokenIdArray = await Promise.all(
            finalCommentsWithCommentTokenIdArray
        )

        setFinalComments(resolvedFinalCommentsWithCommentTokenIdArray)
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
            comment
        )

        _approveOptionsForComment.params = {
            _tokenIdToComment: _tokenId,
            _uri: uri,
        }

        /** FAKE FOR USER TO SEE ITS COMMENT ON SCREEN */

        const commentSender = "You"

        const notVerifedComment = `${commentSender}:${comment}`

        const existedFinalComments = finalComments
        existedFinalComments.push([notVerifedComment, null])
        const fakeExistedComments = existedFinalComments

        const resolvedFakeExistedComments = await Promise.all(
            fakeExistedComments
        )

        setFinalComments(resolvedFakeExistedComments)
        /** FAKE FOR USER TO SEE ITS COMMENT ON SCREEN */

        await runContractFunction({
            params: _approveOptionsForComment,
            onError: (error) => {
                const fakeExistedFinalComments = resolvedFakeExistedComments
                fakeExistedFinalComments.pop()
                const updatedFinalComments = fakeExistedFinalComments
                setFinalComments(updatedFinalComments)

                console.error(error)
            },
            onSuccess: (results) => {
                handleApproveSuccess(
                    results,
                    "sendingComment",
                    resolvedFakeExistedComments
                )
            },
        })
    }

    return (
        <div>
            {showCommentPanel == false ? (
                <div className="flex gap-5 justify-center">
                    <button className="dark:text-white">
                        <a href={_openSeaUrlForImage} target="_blank">
                            <MdSell size="50" />
                        </a>
                    </button>

                    {didWeLike == true ? (
                        <button
                            className="dark:text-white"
                            onClick={async () => {
                                await handleUnClick(_tokenId)
                            }}
                        >
                            <a>
                                <AiFillLike size="50" />
                            </a>
                        </button>
                    ) : (
                        <button
                            className="dark:text-white"
                            onClick={async () => {
                                await handleLikeClick(_tokenId)
                            }}
                        >
                            <a>
                                <AiOutlineLike size="50" />
                            </a>
                        </button>
                    )}

                    <button
                        className="dark:text-white"
                        onClick={async () => {
                            await handleCommentButtonClick(_tokenId)
                        }}
                    >
                        <FaCommentAlt size="50" />
                    </button>
                </div>
            ) : (
                <div className="">
                    <div className="flex justify-center items-center">
                        <div className=" flex flex-col bg-white shadow-md rounded w-full">
                            <div className="flex flex-col">
                                <div className="flex justify-center">
                                    <div className="font-extrabold">
                                        Comments
                                    </div>
                                </div>
                                {finalComments == false ? (
                                    <></>
                                ) : (
                                    <>
                                        {finalComments.map(
                                            (finalComment, _index) => {
                                                const tokenIdOfComment =
                                                    finalComment[1]
                                                const comment = finalComment[0]

                                                return (
                                                    <div key={_index}>
                                                        {tokenIdOfComment ==
                                                        null ? (
                                                            <>
                                                                <div className="dark:text-black">
                                                                    {`${_index}.${comment}`}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <a
                                                                    href={`https://testnets.opensea.io/assets/goerli/${smartContractAddress}/${tokenIdOfComment}`}
                                                                    target="_blank"
                                                                >
                                                                    <div className="dark:text-black">
                                                                        {`${_index}.${comment}`}
                                                                    </div>
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="message"
                                    className="block mb-2 text-gray-900 dark:text-black font-extrabold text-xl"
                                >
                                    Your Comment:
                                </label>
                                <textarea
                                    id="message"
                                    rows="3"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(evt) => {
                                        setComment(evt.target.value)
                                    }}
                                ></textarea>
                                <div className="flex ml-auto">
                                    <button
                                        onClick={async () => {
                                            await handleSendCommentButtonClick(
                                                _tokenId
                                            )
                                        }}
                                    >
                                        <RiSendPlaneFill size="50" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCommentPanel(false)
                                        }}
                                    >
                                        <AiFillCloseCircle size="50" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
