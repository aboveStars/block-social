import getPostQuery from "@/subgraphQueries/graphQueries"
import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"

var blockSocialAbi = require("../contractInformations/BlockSocial_ABI.json")
var contractNetworkInformations = require("../contractInformations/BlockSocial_Network.json")

export default function GetPosts() {
    const { chainId } = useMoralis()
    const { loading, error, data: dataFromQuery } = useQuery(getPostQuery)

    // if (!chainId) {
    //     return (
    //         <div>
    //             Fetching chainId......
    //             {console.log("Fetching ChainId")}
    //         </div>
    //     )
    // }

    // if (!dataFromQuery) {
    //     return (
    //         <div>
    //             Fetching "data" from "theGraph"
    //             {console.log("Fetching ChainId")}
    //         </div>
    //     )
    // }

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

    const getTokenURI = async (_tokenId) => {
        const _approveOptionsForSendNft = { ...approveOptions }
        _approveOptionsForSendNft.abi = blockSocialAbi
        if (chainId != "undefined") {
            _approveOptionsForSendNft.contractAddress =
                contractNetworkInformations["BlockSocial"][
                    Web3.utils.hexToNumberString(chainId)
                ]
        } else {
            console.error("ChainID not approprite")
        }
        _approveOptionsForSendNft.functionName = "tokenURI"
        _approveOptionsForSendNft.params = {
            tokenId: _tokenId,
        }

        const resultTokenId = await runContractFunction({
            params: _approveOptionsForSendNft,
        })

        return resultTokenId
    }

    const [imageSource, setImageSource] = useState("")
    const [message, setMessage] = useState("")
    const [neededTokenId, setNeededTokenId] = useState("")

    async function handleClick() {
        setNeededTokenId(
            dataFromQuery["mintingFinisheds"][0]["tokenId"].toString()
        )
        console.log(`TokenId from graph: ${neededTokenId}`)

        const tokenUriOfMeta = (await getTokenURI(neededTokenId)).toString()
        console.log(`metaURI: ${tokenUriOfMeta}`)

        const jsonFormattedMeta = await (await fetch(tokenUriOfMeta)).json()
        console.log(jsonFormattedMeta)

        setImageSource(jsonFormattedMeta.image.toString())
        console.log(imageSource)

        setMessage(jsonFormattedMeta.description)
    }

    return (
        <div>
            <div class="flex flex-col">
                <div>
                    <button
                        class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-all duration-300"
                        onClick={async () => {
                            await handleClick()
                        }}
                    >
                        Get Posts
                    </button>
                </div>
                <div class="my-5">
                    <div class="flex">
                        <div>
                            {imageSource && (
                                <>
                                    <img
                                        src={imageSource}
                                        title={message}
                                        width="100"
                                        height="100"
                                    />
                                </>
                            )}
                        </div>

                        <div>
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
