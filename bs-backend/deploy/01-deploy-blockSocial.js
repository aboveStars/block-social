const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains } = require("../helper-hardhat-config.js")
const {
    updateContractNetworkInformations,
    updateContractAbi,
} = require("../scripts/updateConstantsForFrontend")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const blockSocial = await deploy("BlockSocial", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name)) {
        await verify(blockSocial.address, [])
    }

    await updateContractNetworkInformations(
        "BlockSocial",
        network.config.chainId.toString()
    )

    await updateContractAbi("BlockSocial")
}

module.exports.tags = ["all", "BlockSocial"]
