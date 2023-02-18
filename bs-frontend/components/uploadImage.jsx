import { useEffect, useState } from "react"
import { BsCloudUploadFill } from "react-icons/bs"
import { AiOutlineSend } from "react-icons/ai"
import { sendFileToIpfs, sendJSONToIpfs } from "@/scripts/pinataOperations"
import { metaDataTemplate } from "@/utils/metadataTemplate"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import {
    approveOptions,
    blockSocialAbi,
    contractNetworkInformations,
} from "@/utils/approveOptions"
import Web3 from "web3"
import { urlPrefixForIPFS } from "@/utils/ipfsStuffs"

export default function UploadButton() {
    const [showUploadPanel, setShowUploadPanel] = useState(false)
    const [image, setImage] = useState(null)

    const [smartContractAddress, setSmartContractAddress] = useState("")

    const [postDescription, setPostDescription] = useState("")

    const { runContractFunction } = useWeb3Contract({})
    const { chainId } = useMoralis()

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

    async function sendPhotoToIpfs() {
        const file = image
        const imageURI = await sendFileToIpfs(file)

        const imageURIPrefixed = `${urlPrefixForIPFS}${imageURI}`
        console.log("IMAGE-URI-PREFIXED: " + imageURIPrefixed)

        const imageMetadata = { ...metaDataTemplate }
        imageMetadata.name = "Very Interesting NFT"
        imageMetadata.description = postDescription
        imageMetadata.attributes[0] = {
            trait_Type: "Green",
            value: "53",
        }
        imageMetadata.image = imageURIPrefixed
        const json = imageMetadata

        const metadataURI = await sendJSONToIpfs(json)
        const metadaraURIPrefixed = `${urlPrefixForIPFS}${metadataURI}`
        console.log("MetadataURI PREFIXED:  " + metadaraURIPrefixed)

        const _approveOptionsForSendNft = { ...approveOptions }
        _approveOptionsForSendNft.abi = blockSocialAbi
        if (chainId) {
            _approveOptionsForSendNft.contractAddress = smartContractAddress
        } else {
            console.error("ChainID not approprite")
        }
        _approveOptionsForSendNft.functionName = "mintingPost"
        _approveOptionsForSendNft.params = {
            _uri: metadaraURIPrefixed,
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
        handleNewNotification(
            "warning",
            "Transaction in Progress 🚀",
            "Post Waiting for Confirmation"
        )

        console.log(
            `%cWaiting Confirmaitons ==> %c${"Posting"} ==> %chttps://goerli.etherscan.io/tx/${tx.hash.toString()}`,
            `color : #19EEEE`,
            `color : #FF8B00 `,
            `color : #EC5AE7`
        )

        try {
            await tx.wait(2)
        } catch (error) {
            handleNewNotification(
                "error",
                "Transaction Couldn't Confirmed!",
                "Error While Post Confirming"
            )
            console.error(error)
        }

        handleNewNotification(
            "success",
            "Transaction Confirmed! 🥳",
            "Post Successfully Sent!"
        )

        console.log(
            `%cConfirmed ==> %c${"Posting"}`,
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
            <div className="dark: text-white">
                <button
                    onClick={() => {
                        setShowUploadPanel(!showUploadPanel)
                    }}
                >
                    <div className="flex ">
                        <BsCloudUploadFill color="white" size="25" />
                        <div className="ml-2">Upload</div>
                    </div>
                </button>
                {showUploadPanel == true ? (
                    <div className="flex flex-col gap-3 my-3 p-3">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="file_input"
                        >
                            Upload file
                        </label>
                        <input
                            className="block w-1/2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="file_input"
                            type="file"
                            onChange={(evt) => {
                                setImage(evt.target.files[0])
                            }}
                        ></input>
                        <div>
                            <label
                                htmlFor="small-input"
                                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                            >
                                Description
                            </label>

                            <input
                                type="text"
                                id="small-input"
                                className="block w-1/2 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(evt) => {
                                    setPostDescription(evt.target.value)
                                }}
                            />
                        </div>
                        <div>
                            <button
                                onClick={async () => {
                                    await sendPhotoToIpfs()
                                }}
                            >
                                <AiOutlineSend size="20" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}
