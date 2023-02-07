import { generateFinalURI } from "@/scripts/generateUri"
import { useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"
import { Button, Input } from "web3uikit"

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
        <div className="container">
            <div>
                <Input
                    placeholder="type your message...."
                    onChange={(evt) => {
                        setInput(evt.target.value)
                    }}
                />
            </div>

            <div style={{ marginTop: 20, marginLeft: 110 }}>
                <Button
                    color="blue"
                    onClick={() => {
                        sendPost(generateFinalURI(input))
                    }}
                    text="Send Post"
                    theme="colored"
                    size="l"
                />
            </div>
        </div>
    )
}
