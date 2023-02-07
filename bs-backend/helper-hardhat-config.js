const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        vrfCoordinatorV2Address: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "8573",
        callbackGasLimit: "2500000",
        mintFee: ethers.utils.parseEther("0.1"),
        ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },

    31337: {
        name: "hardhat",
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        mintFee: ethers.utils.parseEther("1"),
    },
}

const developmentChains = ["hardhat", "localhost"]

const metaDataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_Type: "",
            value: 0,
        },
    ],
}

const svgPrefixForBase64 = "data:image/svg+xml;base64,"



module.exports = {
    networkConfig,
    developmentChains,
    metaDataTemplate,
    svgPrefixForBase64,
}
