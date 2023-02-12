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
                    <form
                        className="flex items-center"
                        onSubmit={async (evt) => {
                            evt.preventDefault()
                            await handleClick()
                        }}
                    >
                        <label htmlFor="simple-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-auto">
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search for addresses"
                                onChange={(evt) => {
                                    setDesiredSenderAddress(evt.target.value)
                                }}
                                required
                            />
                        </div>
                        <button
                            onClick={async () => {
                                await handleClick()
                            }}
                            type="button"
                            className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </form>

                    <div className="my-3">
                        <h1 className="text-white">Posts</h1>

                        {showPosts == true
                            ? memoReturnPosts
                            : memoReturnSkeletons}
                    </div>
                </div>
            </>
        </div>
    )
}
