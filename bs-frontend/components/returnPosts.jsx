import PostBottomPart from "./postsBottomPart"

export default function ReturnPosts({ _imagesArray, _tokenIdImageUriArray, _smartContractAddressForOpenSea }) {
    return (
        <div className="overflow-y-scroll h-96 my-5">
            {console.log("we should see photos")}

            {_imagesArray.map((imageSrc) => {
                {
                    {
                        const tokenIdOfImage = _tokenIdImageUriArray[imageSrc]

                        const openSeaUrlForImage = `https://testnets.opensea.io/assets/goerli/${_smartContractAddressForOpenSea}/${tokenIdOfImage}`
                        if (
                            typeof imageSrc !== "undefined" &&
                            imageSrc != null
                        ) {
                            return (
                                <div
                                    key={imageSrc}
                                    className="border border-gray-500"
                                >
                                    <img src={imageSrc} />

                                    <PostBottomPart
                                        _openSeaUrlForImage={openSeaUrlForImage}
                                        _tokenId={tokenIdOfImage}
                                    />
                                </div>
                            )
                        }
                    }
                }
            })}
        </div>
    )
}
