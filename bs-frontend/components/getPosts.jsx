import {
    getPostQuery,
    gqlCreatorForDesiredNftAddress,
} from "@/subgraphQueries/graphQueries"
import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"

var blockSocialAbi = require("../contractInformations/BlockSocial_ABI.json")
var contractNetworkInformations = require("../contractInformations/BlockSocial_Network.json")

export default function GetPosts({ _desiredAddress }) {
    console.log(_desiredAddress)
    const { chainId } = useMoralis()
    const {
        loading,
        error,
        data: dataFromQuery,
    } = useQuery(gqlCreatorForDesiredNftAddress(_desiredAddress))

    

    const [s_imagesArray, set_s_imagesArray] = useState(null)

    const [networkNeedsSatisfied, setNetworkNeedsSatisfied] = useState(false)

    useEffect(() => {
        if (chainId && dataFromQuery) {
            setNetworkNeedsSatisfied(true)
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

        _approveOptionsForSendNft.contractAddress =
            contractNetworkInformations["BlockSocial"][
                Web3.utils.hexToNumberString(chainId)
            ]

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
        if (networkNeedsSatisfied == false) {
            console.error(`Is networkNeedsSatisfied: ${networkNeedsSatisfied}`)
            return
        } else {
            console.log("We are good to go about graph")
            console.log(dataFromQuery)
        }

        const allMintingFinishedsArray = dataFromQuery["mintingFinisheds"] // 1.data 2.data 3.data 4.data ....

        const tokenIds = allMintingFinishedsArray.map(function (
            mintingFinished
        ) {
            return mintingFinished["tokenId"].toString()
        })

        const metaUriArray = tokenIds.map(async function (tokenId) {
            const fetchedMetaUri = await getTokenURI(tokenId)

            if ((typeof fetchedMetaUri).toString() !== "undefined") {
                const finalFetchedMetaUri = fetchedMetaUri.toString()
                return finalFetchedMetaUri
            }
        })

        const imagesArray = (await Promise.all(metaUriArray)).map(
            async function (metaUri) {
                if ((typeof metaUri).toString() !== "undefined") {
                    const jsonFormattedMeta = await (
                        await fetch(metaUri)
                    ).json()

                    const imageUri = jsonFormattedMeta.image.toString()
                    // console.log(imageUri)
                    return imageUri
                }
            }
        )

        set_s_imagesArray(await Promise.all(imagesArray))
    }

    return (
        <div>
            <div className="flex flex-col">
                
             </div>
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
                    <div className="flex flex-col">
                        <div>
                            {(typeof s_imagesArray).toString() !==
                                "undefined" && s_imagesArray != null ? (
                                <>
                                    {s_imagesArray.map((imageSrc) => {
                                        if (
                                            typeof imageSrc !== "undefined" &&
                                            imageSrc != null
                                        ) {
                                            console.log(imageSrc)
                                            return (
                                                <img
                                                    className="my-5"
                                                    key={imageSrc}
                                                    src={imageSrc}
                                                    width="200"
                                                    height="200"
                                                />
                                            )
                                        }
                                    })}

                                    {console.log("We should see photos...")}
                                </>
                            ) : (
                                <>
                                    {console.log("No....")}
                                    Heeeehhhhheehh
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    )
}
