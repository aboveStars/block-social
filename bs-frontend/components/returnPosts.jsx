export default function ReturnPosts({ _imagesArray, _tokenIdImageUriArray }) {
    return (
        <>
            {console.log("we should see photos")}
            {_imagesArray.map((imageSrc) => {
                {
                    {
                        const tokenIdOfImage = _tokenIdImageUriArray[imageSrc]

                        const openSeaUrlForImage = `https://testnets.opensea.io/assets/goerli/0x6000c8c0c0e149a33ba62463b01134d9617269f6/${tokenIdOfImage}`
                        if (
                            typeof imageSrc !== "undefined" &&
                            imageSrc != null
                        ) {
                            return (
                                <div key={imageSrc}>
                                    <a
                                        href={openSeaUrlForImage}
                                        target="_blank"
                                    >
                                        <figure>
                                            <img
                                                className="my-5"
                                                src={imageSrc}
                                                width="200"
                                                height="200"
                                            />
                                            <figcaption>{`#${tokenIdOfImage}`}</figcaption>
                                        </figure>
                                    </a>
                                    <hr />
                                </div>
                            )
                        }
                    }
                }
            })}
        </>
    )
}
