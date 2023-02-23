import Post from "./Post"
import { useWeb3Contract, useMoralis } from "react-moralis"
import {
    approveOptions,
    blockSocialAbi,
    contractNetworkInformations,
} from "@/utils/approveOptions"
import Web3 from "web3"

export default function ContractFunctionHandler() {
    const { runContractFunction } = useWeb3Contract({})
    const { chainId } = useMoralis()

    async function handleContractFunctions(action) {
        console.log("Contract Function request received")

        switch (action) {
            case "like":
                const approveOptionsForLike = { ...approveOptions }
                approveOptionsForLike.abi = blockSocialAbi

                approveOptionsForLike.contractAddress =
                    contractNetworkInformations["BlockSocial"][
                        Web3.utils.hexToNumberString(chainId)
                    ]
                approveOptionsForLike.functionName = "like"
                approveOptionsForLike.params = {
                    _tokenId: "0",
                }
                console.log(approveOptionsForLike)
                await runContractFunction({
                    params: approveOptionsForLike,
                    onError: (error) => {
                        console.error(error)
                    },
                    onSuccess: () => {
                        console.log("You approved")
                    },
                })
                break
            case "unLike":
                const approveOptionsForUnLike = { ...approveOptions }
                approveOptionsForUnLike.abi = blockSocialAbi

                approveOptionsForUnLike.contractAddress =
                    contractNetworkInformations["BlockSocial"][
                        Web3.utils.hexToNumberString(chainId)
                    ]
                approveOptionsForUnLike.functionName = "unLike"
                approveOptionsForUnLike.params = {
                    _tokenId: "0",
                }
                console.log(approveOptionsForUnLike)
                await runContractFunction({
                    params: approveOptionsForUnLike,
                    onError: (error) => {
                        console.error(error)
                    },
                    onSuccess: () => {
                        console.log("You approved")
                    },
                })

                break
            default:
                break
        }
    }

    return <Post contraactFunctionCaller={handleContractFunctions} />
}
