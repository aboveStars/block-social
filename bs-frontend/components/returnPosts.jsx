import { MdSell } from "react-icons/md"

export default function ReturnPosts({ _imagesArray, _tokenIdImageUriArray }) {
    return (
        <div className="overflow-y-scroll h-96 my-5">
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
                                <div
                                    key={imageSrc}
                                    className="border border-gray-500"
                                >
                                    <img src={imageSrc} />
                                    <div className="flex justify-center">
                                        <button className="dark:text-white">
                                            <a
                                                href={openSeaUrlForImage}
                                                target="_blank"
                                            >
                                                <MdSell size="50" />
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    }
                }
            })}
        </div>
    )
}
