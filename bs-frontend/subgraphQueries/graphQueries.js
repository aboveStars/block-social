import { gql } from "@apollo/client"

const getPostQuery = gql`
    {
        mintingFinisheds(where: { tokenId: 4 }) {
            nftAddress
            tokenId
        }
    }
`

function gqlCreatorForDesiredNftAddress(_desiredNftAddress) {
    return gql`
        {
            mintingFinisheds(where: { nftAddress: "${_desiredNftAddress}" }) {
                nftAddress
                tokenId
            }
        }
    `
}

function gqlCreatorForDesiredSenderAddress(_desiredSenderAddress) {
    return gql`
        {
            mintingFinisheds(where: { from: "${_desiredSenderAddress}" }) {
                nftAddress
                tokenId
            }
        }
    `
}

module.exports = {
    getPostQuery,
    gqlCreatorForDesiredNftAddress,
    gqlCreatorForDesiredSenderAddress,
}
