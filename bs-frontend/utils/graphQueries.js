import { gql } from "@apollo/client"

export function gqlCreatorForDesiredSenderAddress(_desiredSenderAddress) {
    return gql`
        {
            mintingFinisheds(where: { from: "${_desiredSenderAddress}" tokenId_gt:80 }) {
                nftAddress
                tokenId
                from
            }
        }
    `
}

/**
 * @param _senderAddress Desired Address To Get Post From
 * @param _fromPostNumber Parameter for paging
 */
export function postGettingQuery(_senderAddress, _fromPostNumber) {
    return gql`{
        postMinteds(first:1 where:{from : "${_senderAddress}" tokenId_gte:${_fromPostNumber}}){
            from
            tokenId
            postNumber
        }
    }`
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
