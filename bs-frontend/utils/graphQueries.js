import { gql } from "@apollo/client"

export const getPostQuery = gql`
    {
        mintingFinisheds(where: { tokenId: 4 }) {
            nftAddress
            tokenId
        }
    }
`

export function gqlCreatorForDesiredNftAddress(_desiredNftAddress) {
    return gql`
        {
            mintingFinisheds(where: { nftAddress: "${_desiredNftAddress}" }) {
                nftAddress
                tokenId
            }
        }
    `
}

export function gqlCreatorForDesiredSenderAddress(_desiredSenderAddress) {
    return gql`
        {
            mintingFinisheds(where: { from: "${_desiredSenderAddress}" }) {
                nftAddress
                tokenId
                from
            }
        }
    `
}

export function gqlCreatorForDesiredTokenIdToComment(_desiredTokenId) {
    return gql`
        {
            commentMinteds(where: { commentToTokenId: "${_desiredTokenId}" }) {
                commentTokenId
                from
                
            }
        }
    `
}
