const approveOptions = {
    abi: "",
    contractAddress: "",
    functionName: "",
    params: {},
}

const blockSocialAbi = require("../contractInformations/BlockSocial_ABI.json")
const contractNetworkInformations = require("../contractInformations/BlockSocial_Network.json")

module.exports = {
    approveOptions,
    blockSocialAbi,
    contractNetworkInformations,
}
