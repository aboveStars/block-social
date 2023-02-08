import { gql } from "@apollo/client"

const getPostQuery = gql`
    {
        mintingFinisheds(where: { tokenId: 4 }) {
            nftAddress
            tokenId
        }
    }
`

export default getPostQuery
