const { network, ethers } = require("hardhat")
const fs = require("fs")

const locationOfNetworkConstants =
    "../bs-frontend/contractInformations/BlockSocial_Network.json"

const locationOfContractAbi =
    "../bs-frontend/contractInformations/BlockSocial_ABI.json"

async function updateContractNetworkInformations(_contractName, _chainId) {
    const contractName = _contractName
    const chainId = _chainId.toString()
    const contractAddress = (
        await ethers.getContract(_contractName)
    ).address.toString()

    const existingFile = JSON.parse(
        fs.readFileSync(locationOfNetworkConstants, "utf-8")
    )

    const workingFile = existingFile

    if (workingFile.hasOwnProperty(contractName)) {
        workingFile[contractName][chainId] = contractAddress
    } else {
        workingFile[contractName] = {
            [chainId]: contractAddress,
        }
    }

    const resultFile = workingFile

    fs.writeFileSync(locationOfNetworkConstants, JSON.stringify(resultFile))
}
async function updateContractAbi(_contractName) {
    const abi = (await ethers.getContract(_contractName)).interface.format(
        ethers.utils.FormatTypes.json
    )

    fs.writeFileSync(locationOfContractAbi, abi)
}
module.exports = { updateContractNetworkInformations, updateContractAbi }
