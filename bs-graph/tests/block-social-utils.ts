import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  CommentMinted,
  Liked,
  PostMinted,
  Transfer,
  UnLiked
} from "../generated/BlockSocial/BlockSocial"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createCommentMintedEvent(
  commentToTokenId: BigInt,
  from: Address,
  commentTokenId: BigInt
): CommentMinted {
  let commentMintedEvent = changetype<CommentMinted>(newMockEvent())

  commentMintedEvent.parameters = new Array()

  commentMintedEvent.parameters.push(
    new ethereum.EventParam(
      "commentToTokenId",
      ethereum.Value.fromUnsignedBigInt(commentToTokenId)
    )
  )
  commentMintedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  commentMintedEvent.parameters.push(
    new ethereum.EventParam(
      "commentTokenId",
      ethereum.Value.fromUnsignedBigInt(commentTokenId)
    )
  )

  return commentMintedEvent
}

export function createLikedEvent(
  whoDidLike: Address,
  whichPostLiked: BigInt,
  overallLikeCountOfPost: BigInt
): Liked {
  let likedEvent = changetype<Liked>(newMockEvent())

  likedEvent.parameters = new Array()

  likedEvent.parameters.push(
    new ethereum.EventParam(
      "whoDidLike",
      ethereum.Value.fromAddress(whoDidLike)
    )
  )
  likedEvent.parameters.push(
    new ethereum.EventParam(
      "whichPostLiked",
      ethereum.Value.fromUnsignedBigInt(whichPostLiked)
    )
  )
  likedEvent.parameters.push(
    new ethereum.EventParam(
      "overallLikeCountOfPost",
      ethereum.Value.fromUnsignedBigInt(overallLikeCountOfPost)
    )
  )

  return likedEvent
}

export function createPostMintedEvent(
  from: Address,
  tokenId: BigInt,
  postNumber: BigInt
): PostMinted {
  let postMintedEvent = changetype<PostMinted>(newMockEvent())

  postMintedEvent.parameters = new Array()

  postMintedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  postMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  postMintedEvent.parameters.push(
    new ethereum.EventParam(
      "postNumber",
      ethereum.Value.fromUnsignedBigInt(postNumber)
    )
  )

  return postMintedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createUnLikedEvent(
  whoDidUnLike: Address,
  whichPostUnLiked: BigInt,
  overallLikeCountOfPost: BigInt
): UnLiked {
  let unLikedEvent = changetype<UnLiked>(newMockEvent())

  unLikedEvent.parameters = new Array()

  unLikedEvent.parameters.push(
    new ethereum.EventParam(
      "whoDidUnLike",
      ethereum.Value.fromAddress(whoDidUnLike)
    )
  )
  unLikedEvent.parameters.push(
    new ethereum.EventParam(
      "whichPostUnLiked",
      ethereum.Value.fromUnsignedBigInt(whichPostUnLiked)
    )
  )
  unLikedEvent.parameters.push(
    new ethereum.EventParam(
      "overallLikeCountOfPost",
      ethereum.Value.fromUnsignedBigInt(overallLikeCountOfPost)
    )
  )

  return unLikedEvent
}
