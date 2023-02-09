import getPostQuery from "@/subgraphQueries/graphQueries"
import { useQuery } from "@apollo/client"
import { data } from "autoprefixer"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"

var blockSocialAbi = require("../contractInformations/BlockSocial_ABI.json")
var contractNetworkInformations = require("../contractInformations/BlockSocial_Network.json")

export default function GetPosts() {
    const { chainId } = useMoralis()
    const { loading, error, data: dataFromQuery } = useQuery(getPostQuery)

    const [imageSource, setImageSource] = useState(null)
    const [messageText, setMessageText] = useState(null)

    var neededTokenId

    var networkNeedsSatisfied

    useEffect(() => {
        if (chainId && dataFromQuery) {
            networkNeedsSatisfied = true
            console.log("Network needs satisfied")
        }
    }, [chainId, dataFromQuery])

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
        if (chainId === "undefined" || chainId === null) {
            console.error("ChainID not approprite")
            return
        } else {
            _approveOptionsForSendNft.contractAddress =
                contractNetworkInformations["BlockSocial"][
                    Web3.utils.hexToNumberString(chainId)
                ]
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

    async function handleClick() {
        if (
            networkNeedsSatisfied === null ||
            networkNeedsSatisfied === "undefined"
        ) {
            console.error(`Is networkNeedsSatisfied: ${networkNeedsSatisfied}`)
        }

        const tokenIdReceived =
            dataFromQuery["mintingFinisheds"][0]["tokenId"].toString()

        neededTokenId = tokenIdReceived
        console.log(`TokenId from graph: ${neededTokenId}`)

        const tokenUriOfMeta = (await getTokenURI(neededTokenId)).toString()
        console.log(`metaURI: ${tokenUriOfMeta}`)

        const jsonFormattedMeta = await (await fetch(tokenUriOfMeta)).json()

        console.log(jsonFormattedMeta)

        const imageSourceR = jsonFormattedMeta.image.toString()
        setImageSource(imageSourceR)

        console.log(`IMAGE SOURCE: ${imageSourceR}`)

        const descriptionR = jsonFormattedMeta.description
        setMessageText(descriptionR)
    }

    return (
        <div>
            <div className="flex flex-col">
                <div>
                    <button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-all duration-300"
                        onClick={async () => {
                            await handleClick()
                        }}
                    >
                        Get Posts
                    </button>
                </div>
                <div className="my-5">
                    <div className="flex">
                        <div>
                            {typeof imageSource !== "undefined" &&
                            imageSource != null ? (
                                <img
                                    src={imageSource}
                                    title={messageText}
                                    width="100"
                                    height="100"
                                />
                            ) : (
                                <>"Image source is undefined..."</>
                            )}
                        </div>

                        <div>
                            <p>{messageText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
