import { MdSell } from "react-icons/md"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import { useEffect, useState } from "react"
import {
    approveOptions,
    blockSocialAbi,
    contractNetworkInformations,
} from "@/utils/approveOptions"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import Web3 from "web3"

export default function PostBottomPart({ _openSeaUrlForImage, _tokenId }) {
    var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")

    const { runContractFunction } = useWeb3Contract({})
    const [didWeLike, setDidWeLike] = useState(false)
    const dispatch = useNotification()
    const { chainId } = useMoralis()

    useEffect(() => {
        getLikeStatus(_tokenId)
    })

    function handleNewNotification(_type, _title, _message) {
        dispatch({
            type: _type,
            message: _message,
            title: _title,
            position: "topR",
        })
    }
    async function handleApproveSuccess(tx, isForLike) {
        handleNewNotification(
            "warning",
            "Transaction in Progress",
            "Action Waiting for Confirmation"
        )

        console.log("Hash of tx: " + tx.hash.toString())

        console.log("waiting for confirmaitons......")
        const rTx = await tx.wait(1)

        handleNewNotification(
            "success",
            "Transaction Confirmed!",
            "Action Successfully Sent!"
        )

        console.log(rTx)
        console.log("Confirmed")

        setDidWeLike(isForLike)
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
        console.log("Liked Button!")

        const _approveOptionsForLike = { ...approveOptions }

        _approveOptionsForLike.abi = blockSocialAbi
        _approveOptionsForLike.contractAddress =
            contractNetworkInformations["BlockSocial"][
                Web3.utils.hexToNumberString(chainId)
            ]
        _approveOptionsForLike.functionName = "like"
        _approveOptionsForLike.params = {
            _tokenId: _tokenId,
        }

        await runContractFunction({
            params: _approveOptionsForLike,
            onError: (error) => {
                console.error(error)
            },
            onSuccess: (results) => handleApproveSuccess(results, true),
        })
    }

    async function handleUnClick(_tokenId) {
        console.log("Unliked Botton !")

        const _approveOptionsForLike = { ...approveOptions }

        _approveOptionsForLike.abi = blockSocialAbi
        _approveOptionsForLike.contractAddress =
            contractNetworkInformations["BlockSocial"][
                Web3.utils.hexToNumberString(chainId)
            ]
        _approveOptionsForLike.functionName = "unLike"
        _approveOptionsForLike.params = {
            _tokenId: _tokenId,
        }

        await runContractFunction({
            params: _approveOptionsForLike,
            onError: (error) => {
                console.error(error)
            },
            onSuccess: (results) => handleApproveSuccess(results, false),
        })
    }

    async function getLikeStatus(tokenIdForRequest) {
        console.log("Getting Like Status....")
        const activeAccountAddress = (await web3.eth.requestAccounts())[0]
        console.log(activeAccountAddress)

        const _approveOptionsForLikeStatus = { ...approveOptions }

        _approveOptionsForLikeStatus.abi = blockSocialAbi
        _approveOptionsForLikeStatus.contractAddress =
            contractNetworkInformations["BlockSocial"][
                Web3.utils.hexToNumberString(chainId)
            ]
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

        console.log()

        setDidWeLike(likeStatus)
    }

    return (
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
        </div>
    )
}
