import { sendFileToIpfs, sendJSONToIpfs } from "@/scripts/pinataOperations"
import {
    approveOptions,
    blockSocialAbi,
    contractNetworkInformations,
} from "@/utils/approveOptions"
import { metaDataTemplate } from "@/utils/metadataTemplate"
import { useState } from "react"
import { BsPlusCircle } from "react-icons/bs"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"
import { useNotification } from "web3uikit"
import { Bounce, toast, Zoom } from "react-toastify"

export default function SendPost() {
    const [currentPostCreationData, setCurrentPostCreationData] = useState({
        title: "title",
        image: File,
        description: "description",
    })
    const [showPanel, setShowPanel] = useState(false)

    const { chainId } = useMoralis()

    const { runContractFunction } = useWeb3Contract({})

    const dispatch = useNotification()

    async function handleSubmit() {
        setShowPanel((a) => false)
        const file = currentPostCreationData.image
        const imageURI = await sendFileToIpfs(file)

        const imageMetadata = { ...metaDataTemplate }
        imageMetadata.name = currentPostCreationData.title
        imageMetadata.description = currentPostCreationData.description
        imageMetadata.attributes[0] = {
            trait_Type: "Green",
            value: "53",
        }
        imageMetadata.image = imageURI
        const json = imageMetadata

        const metadataURI = await sendJSONToIpfs(json)

        const _approveOptionsForSendNft = { ...approveOptions }
        _approveOptionsForSendNft.abi = blockSocialAbi
        _approveOptionsForSendNft.contractAddress =
            contractNetworkInformations["BlockSocial"][
                Web3.utils.hexToNumberString(chainId)
            ]

        _approveOptionsForSendNft.functionName = "mintingPost"
        _approveOptionsForSendNft.params = {
            _uri: metadataURI,
        }

        await runContractFunction({
            params: _approveOptionsForSendNft,
            onSuccess: (results) => handleApproveSuccess(results),
            onError: (error) => {
                console.error(error)
            },
        })
    }

    async function handleApproveSuccess(tx) {
        toast.info(`View "🌃" transaction on Etherscan`, {
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
        })
        handleNewNotification(
            "warning",
            `Transaction in Progress 🚀`,
            `"🌃" Waiting for Confirmations`
        )

        console.log(
            `%cWaiting Confirmaitons ==> %c${"Sending Post"} ==> %chttps://goerli.etherscan.io/tx/${tx.hash.toString()}`,
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

            toast.error(`"🌃" Transaction Failed`, {
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
            })

            console.error(error)
            return
        }

        handleNewNotification(
            "success",
            `Transaction Confirmed! 🥳`,
            `"🌃" Action Successfully Sent!`
        )

        console.log(
            `%cConfirmed ==> %c${"Sending Post"}`,
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
            <div className="flex flex-col gap-7">
                <button
                    className="text-white"
                    onClick={() => {
                        setShowPanel((prev) => !prev)
                    }}
                >
                    <div className="flex gap-2">
                        <BsPlusCircle color="white" size="25" />
                        Create
                    </div>
                </button>
                {showPanel == true ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmit()
                        }}
                    >
                        <div className="rounded-2xl bg-gray-900 shadow-lg p-6 text-gray-100 w-2/3 flex flex-col gap-2">
                            <div className="mb-4">
                                <label
                                    htmlFor="title"
                                    className="block font-bold mb-2"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="appearance-none border rounded-xl w-full py-2 px-3 leading-tight bg-gray-700 focus:outline-none focus:shadow-outline text-gray-100"
                                    placeholder="Enter title here"
                                    onChange={(e) => {
                                        setCurrentPostCreationData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }}
                                    required
                                />
                            </div>

                            <div className="max-w-2xl mx-auto">
                                <div className="flex gap-2">
                                    <label
                                        className="block mb-2 text-md font-extrabold text-gray-900 dark:text-gray-300"
                                        for="file_input"
                                    >
                                        Photo
                                    </label>
                                    <div className="text-white font-thin">
                                        (Optional)
                                    </div>
                                </div>

                                <input
                                    className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    id="file_input"
                                    type="file"
                                    onChange={(e) => {
                                        setCurrentPostCreationData((prev) => ({
                                            ...prev,
                                            image: e.target.files[0],
                                        }))
                                    }}
                                />
                            </div>
                            <div className="mb-4 mt-4">
                                <label
                                    htmlFor="description"
                                    className="block font-bold mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    className="appearance-none border rounded-xl w-full py-2 px-3 leading-tight bg-gray-700 focus:outline-none focus:shadow-outline text-gray-100"
                                    rows="4"
                                    placeholder="Enter description here"
                                    onChange={(e) => {
                                        setCurrentPostCreationData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }}
                                    required
                                />
                            </div>

                            <button
                                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Send Post
                            </button>
                        </div>
                    </form>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}
