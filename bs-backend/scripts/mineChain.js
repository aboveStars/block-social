const { network } = require("hardhat")

async function main() {
    console.log("Blockchain will go 1 block with 53 seconds...!")
    await network.provider.send("evm_increaseTime", [53])
    await network.provider.send("evm_mine", [])
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
