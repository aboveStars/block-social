export default function FailedPost() {
    return (
        <div className="flex justify-center items-center my-5">
            <div className="container bg-white rounded-xl shadow-lg transform transition duration-500 hover:shadow-2xl">
                <div>
                    <h1 className="text-2xl mt-2 ml-4 font-bold text-gray-800 hover:text-gray-900 transition duration-100 overflow-hidden overflow-ellipsis">
                        {"Rize"}
                    </h1>
                    <p className="ml-4 mt-1 mb-2 text-gray-700 overflow-hidden overflow-ellipsis">
                        {"Dünyanın En İyi Şehri"}
                    </p>
                </div>

                <img
                    id="PostImage"
                    className="object-cover"
                    src={
                        "https://i2.milimaj.com/i/milliyet/75/0x0/5f601c1a554283157896278b.jpg"
                    }
                />

                <div className="flex p-3 justify-between">
                    <button
                        className="flex items-center space-x-2"
                        onClick={() => {}}
                    >
                        <img
                            className="w-10 rounded-full"
                            src={
                                "https://www.shutterstock.com/image-vector/smiley-vector-happy-face-600w-465566966.jpg"
                            }
                        />
                        <h2 className="text-gray-800 font-bold cursor-pointer overflow-hidden overflow-ellipsis w-14">
                            {"postSender"}
                        </h2>
                    </button>

                    <div className="flex justify-center items-center mr-5">
                        <button onClick={() => {}} className="w-24">
                            <img
                                src="https://storage.googleapis.com/opensea-static/Logomark/OpenSea-Full-Logo%20(dark).svg"
                                className="object-cover"
                            />
                        </button>
                    </div>

                    <div className="flex space-x-2">
                        <div className="flex space-x-1 items-center">
                            <button>
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 text-gray-600 cursor-pointer"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </span>
                            </button>

                            <span>{"53"}</span>
                        </div>
                        <div className="flex space-x-1 items-center">
                            <button>
                                <FcLikePlaceholder size="27" />
                            </button>

                            <span>{"53"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
