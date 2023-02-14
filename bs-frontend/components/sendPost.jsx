import { generateFinalURI } from "@/scripts/generateUri"
import { approveOptions } from "@/utils/approveOptions"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"
import { useNotification } from "web3uikit"

var blockSocialAbi = require("../contractInformations/BlockSocial_ABI.json")
var contractNetworkInformations = require("../contractInformations/BlockSocial_Network.json")

import { RiSendPlaneFill } from "react-icons/ri"
import ReturnLoading from "./returnLoading"

export default function SendPostWorks() {
    const [messageTitle, setMessageTitle] = useState("")
    const [message, setMesage] = useState("")
    const [showLoadingScreen, setShowLoadingScreen] = useState(false)
    const [transactionHash, setTransactionHash] = useState(null)

    const { chainId } = useMoralis()

    const [smartContractAddress, setSmartContractAddress] = useState("")

    const dispatch = useNotification()

    useEffect(() => {
        if (chainId) {
            setSmartContractAddress(
                contractNetworkInformations["BlockSocial"][
                    Web3.utils.hexToNumberString(chainId)
                ]
            )
        }
    }, [chainId])

    async function handleApproveSuccess(tx) {
        handleNewNotification(
            "warning",
            "Transaction in Progress",
            "Post Waiting for Confirmation"
        )

        setTransactionHash(tx.hash.toString())
        console.log("Hash of tx: " + tx.hash.toString())

        setShowLoadingScreen(true)

        console.log("waiting for confirmaitons......")
        const rTx = await tx.wait(2)

        handleNewNotification(
            "success",
            "Transaction Confirmed!",
            "Post Successfully Sent!"
        )

        console.log(rTx)
        console.log("Confirmed")

        setShowLoadingScreen(false)
    }

    function handleNewNotification(_type, _title, _message) {
        dispatch({
            type: _type,
            message: _message,
            title: _title,
            position: "topR",
        })
    }

    const { runContractFunction } = useWeb3Contract({})

    const sendPost = async (_uri) => {
        const _approveOptionsForSendNft = { ...approveOptions }
        _approveOptionsForSendNft.abi = blockSocialAbi
        if (chainId) {
            _approveOptionsForSendNft.contractAddress = smartContractAddress
        } else {
            console.error("ChainID not approprite")
        }
        _approveOptionsForSendNft.functionName = "mintingPost"
        _approveOptionsForSendNft.params = {
            _uri: _uri,
        }

        await runContractFunction({
            params: _approveOptionsForSendNft,
            onSuccess: (results) => handleApproveSuccess(results),
            onError: (error) => {
                console.error(error)
            },
        })
    }

    return (
        <div>
            {showLoadingScreen == true ? (
                <>
                    <ReturnLoading
                        _transactionHash={transactionHash}
                        _forSendPost={true}
                    />
                </>
            ) : (
                <>
                    <div className="flex-col">
                        <div className="w-64  text-white shadow-lg">
                            <div>
                                <label
                                    htmlFor="small-input"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Title
                                </label>

                                <input
                                    type="text"
                                    id="small-input"
                                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(evt) => {
                                        setMessageTitle(evt.target.value)
                                    }}
                                />
                            </div>
                            <div className="my-4">
                                <label
                                    htmlFor="message"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(evt) => {
                                        setMesage(evt.target.value)
                                    }}
                                ></textarea>
                            </div>

                            <button
                                onClick={async () => {
                                    await sendPost(
                                        await generateFinalURI(
                                            messageTitle,
                                            message
                                        )
                                    )
                                }}
                                className="flex text-white gap-1 ml-auto"
                            >
                                <RiSendPlaneFill size="25" />
                                Send
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
