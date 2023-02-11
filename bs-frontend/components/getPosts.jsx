import { apolloClient } from "@/pages/_app"
import { approveOptions } from "@/utils/approveOptions"
import { gqlCreatorForDesiredSenderAddress } from "@/utils/graphQueries"
import waitUntil from "@/utils/waitUntil"
import { useEffect, useMemo, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Web3 from "web3"
import ReturnPosts from "./returnPosts"
import ReturnSkeletons from "./returnSkeletons"

var blockSocialAbi = require("../contractInformations/BlockSocial_ABI.json")
var contractNetworkInformations = require("../contractInformations/BlockSocial_Network.json")

export default function GetPosts() {
    const { chainId } = useMoralis()

    const [desiredSenderAddress, setDesiredSenderAddress] = useState(null)
    const [imagesArray, setImagesArray] = useState(null)

    const [chainIdOk, setChainIdOk] = useState(false)
    const [showPosts, setShowPosts] = useState(false)

    const [tokenIdImageUriArray, setTokenIdImageUriArray] = useState([])

    const memoReturnPosts = useMemo(
        () => (
            <ReturnPosts
                _imagesArray={imagesArray}
                _tokenIdImageUriArray={tokenIdImageUriArray}
            />
        ),
        [imagesArray, tokenIdImageUriArray]
    )

    const memoReturnSkeletons = useMemo(
        () => <ReturnSkeletons _length={4} />,
        []
    )

    useEffect(() => {
        if ((typeof chainId).toString() !== "undefined" || chainId != null) {
            setChainIdOk(true)
            console.log(
                "ChainID changed: " + Web3.utils.hexToNumberString(chainId)
            )
        }
    }, [chainId])

    const { runContractFunction } = useWeb3Contract({})

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
            onError: (error) => {
                console.error(error)
            },
        })

        return resultTokenId
    }

    async function arrayCreatorForOpenSea(tokenId, fetchedMetaUri) {
        const resolvedMetaUri = await Promise.resolve(fetchedMetaUri)
        const jsonFormattedMeta = await (await fetch(resolvedMetaUri)).json()
        const imageUri = jsonFormattedMeta.image.toString()

        const existedArray = tokenIdImageUriArray
        existedArray[imageUri] = tokenId
        const updatedArray = existedArray
        setTokenIdImageUriArray(updatedArray)
    }

    async function handleClick() {
        console.log(
            "We are in 'handleClick' function \n WE will first check if chainId fetched..... "
        )

        if (chainIdOk == false) {
            console.error("ChainId is not fetched correctly")
            return
        } else {
            console.log("ChainId fetched correctly")
        }

        console.log("Now we will test 'theGraph' ")

        const {
            data: dataFromQuery,
            error,
            loading,
        } = await apolloClient.query({
            query: gqlCreatorForDesiredSenderAddress(desiredSenderAddress),
        })

        if (loading) {
            console.log("Query is in loading..... We will wait to finish")
            await waitUntil(() => loading == false)
            console.log("Waiting finished... Now we debug.... !")
        }

        console.log("We are checking if any error happened !")
        if (error) {
            console.error(
                "There is an error or errors when fetching data from theGraph"
            )
            return
        } else {
            console.log("No error happened.")
        }

        console.log("We waited and checked for errors. \n We are good to go!")

        console.log(dataFromQuery)

        const allMintingFinishedsArray = dataFromQuery["mintingFinisheds"] // 1.data 2.data 3.data 4.data ....

        const orderedByTokenIdAllMintingFinishedArrays = [
            ...allMintingFinishedsArray,
        ]

        orderedByTokenIdAllMintingFinishedArrays.sort((a, b) => {
            return b.tokenId - a.tokenId //
        })

        console.log(orderedByTokenIdAllMintingFinishedArrays)

        const tokenIds = orderedByTokenIdAllMintingFinishedArrays.map(function (
            mintingFinished
        ) {
            return mintingFinished["tokenId"].toString()
        })

        const metaUriArray = tokenIds.map(async function (tokenId) {
            const fetchedMetaUri = await getTokenURI(tokenId)

            if ((typeof fetchedMetaUri).toString() !== "undefined") {
                const finalFetchedMetaUri = fetchedMetaUri.toString()

                await arrayCreatorForOpenSea(tokenId, finalFetchedMetaUri)

                return finalFetchedMetaUri
            }
        })

        const imagesArrayF = (await Promise.all(metaUriArray)).map(
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

        if (
            imagesArrayF != null &&
            (typeof imagesArrayF).toString() !== "undefined"
        ) {
            setImagesArray(await Promise.all(imagesArrayF))
            setShowPosts(true)
        }
    }

    return (
        <div>
            <>
                <div className="flex flex-col">
                    <div className="relative mb-4">
                        <textarea
                            id="address-input"
                            className="bg-white text-gray-900 rounded-lg py-2 px-4 block w-full appearance-none focus:outline-none focus:shadow-outline"
                            placeholder="Please provide a sender address for posts..."
                            rows="3"
                            onChange={(evt) => {
                                setDesiredSenderAddress(evt.target.value)
                            }}
                        />
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

                    <div className="my-3">
                        <div className="text-center">
                            <h1>Posts</h1>
                        </div>
                        {showPosts == true
                            ? memoReturnPosts
                            : memoReturnSkeletons}
                    </div>
                </div>
            </>
        </div>
    )
}
