import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  CommentMinted as CommentMintedEvent,
  Liked as LikedEvent,
  PostMinted as PostMintedEvent,
  Transfer as TransferEvent,
  UnLiked as UnLikedEvent
} from "../generated/BlockSocial/BlockSocial"
import {
  Approval,
  ApprovalForAll,
  CommentMinted,
  Liked,
  PostMinted,
  Transfer,
  UnLiked
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCommentMinted(event: CommentMintedEvent): void {
  let entity = new CommentMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.commentToTokenId = event.params.commentToTokenId
  entity.from = event.params.from
  entity.commentTokenId = event.params.commentTokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLiked(event: LikedEvent): void {
  let entity = new Liked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.whoDidLike = event.params.whoDidLike
  entity.whichPostLiked = event.params.whichPostLiked
  entity.overallLikeCountOfPost = event.params.overallLikeCountOfPost

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePostMinted(event: PostMintedEvent): void {
  let entity = new PostMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.tokenId = event.params.tokenId
  entity.postNumber = event.params.postNumber

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnLiked(event: UnLikedEvent): void {
  let entity = new UnLiked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.whoDidUnLike = event.params.whoDidUnLike
  entity.whichPostUnLiked = event.params.whichPostUnLiked
  entity.overallLikeCountOfPost = event.params.overallLikeCountOfPost

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
