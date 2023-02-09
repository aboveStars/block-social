import { generateFinalURI } from "@/scripts/generateUri"
import { useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"

var blockSocialAbi = require("../contractInformations/BlockSocial_ABI.json")
var contractNetworkInformations = require("../contractInformations/BlockSocial_Network.json")

export default function SendPostWorks() {
    const [input, setInput] = useState("")

    const { chainId } = useMoralis()

    async function handleApproveSuccess(tx) {
        console.log(`Waiting for : Confirmation`)
        await tx.wait(1)
        console.log("Confirmed")

        // Give notification...
    }

    const { runContractFunction } = useWeb3Contract({
        onSuccess: (results) => handleApproveSuccess(results),
        onError: (error) => {
            console.error(error)
        },
    })

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
        })
    }

    return (
        <div>
            <div className="flex flex-col">
                <div className="w-64 p-6 bg-indigo-800 text-white shadow-lg">
                    <input
                        className="bg-black rounded-lg shadow-lg py-3 px-5 text-xl border border-indigo-500 focus:outline-none focus:shadow-outline w-full"
                        type="text"
                        placeholder="type your message...."
                        onChange={(evt) => {
                            setInput(evt.target.value)
                        }}
                    />
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
        </div>
    )
}
