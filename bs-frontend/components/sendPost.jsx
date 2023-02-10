import { generateFinalURI } from "@/scripts/generateUri"
import { useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"
import { Loading, Stepper } from "web3uikit"

var blockSocialAbi = require("../contractInformations/BlockSocial_ABI.json")
var contractNetworkInformations = require("../contractInformations/BlockSocial_Network.json")

export default function SendPostWorks() {
    const [input, setInput] = useState("")
    const [showLoadingScreen, setShowLoadingScreen] = useState(false)
    const [transactionHash, setTransactionHash] = useState(null)

    const { chainId } = useMoralis()

    async function handleApproveSuccess(tx) {
        setTransactionHash(tx.hash.toString())
        console.log("Hash of tx: " + tx.hash.toString())
        setShowLoadingScreen(true)
        console.log("waiting for confirmaitons......")
        const rTx = await tx.wait(2)
        console.log(rTx)
        console.log("Confirmed")
        setShowLoadingScreen(false)

        // Give notification...
    }

    const { runContractFunction } = useWeb3Contract({})

    const approveOptions = {
        abi: "",
        contractAddress: "",
        functionName: "",
        params: {},
    }

    const sendPost = async (_uri) => {
        const _approveOptionsForSendNft = { ...approveOptions }
        _approveOptionsForSendNft.abi = blockSocialAbi
        if (chainId) {
            _approveOptionsForSendNft.contractAddress =
                contractNetworkInformations["BlockSocial"][
                    Web3.utils.hexToNumberString(chainId)
                ]
        } else {
            console.error("ChainID not approprite")
        }
        _approveOptionsForSendNft.functionName = "minting"
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
                    <div
                        style={{
                            backgroundColor: "#ECECFE",
                            borderRadius: "30px",
                            padding: "30px",
                        }}
                    >
                        <Loading
                            size={50}
                            spinnerColor="#2E7DAF"
                            text={`Waiting for confirmations`}
                        />
                    </div>

                    <div className="my-5 mx-10">
                        <a
                            href={`https://goerli.etherscan.io/tx/${transactionHash}`}
                            target="_blank"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            View transaction on etherscan
                        </a>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col">
                        <div className="relative mb-4">
                            <textarea
                                id="message"
                                className="bg-white text-gray-900 rounded-lg py-2 px-4 block w-full appearance-none focus:outline-none focus:shadow-outline"
                                placeholder="Enter your message here..."
                                rows="4"
                                onChange={(evt) => {
                                    setInput(evt.target.value)
                                }}
                            ></textarea>
                        </div>

                        <div className="w-64 p-6 bg-indigo-800 text-white shadow-lg">
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                                onClick={async () => {
                                    await sendPost(
                                        await generateFinalURI(
                                            input,
                                            "Korkmaz's Post #53"
                                        )
                                    )
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
