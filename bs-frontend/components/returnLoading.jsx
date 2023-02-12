export default function ReturnLoading({ _transactionHash, _forSendPost }) {
    return (
        <>
            {_forSendPost == true ? (
                <div className="flex-col p-5">
                    <div>
                        <div className="loader ml-8 my-5"></div>
                    </div>
                    ""
                    <div className="text-white font-bold">
                        Transaction Verifying...
                    </div>
                    <div className="ml-1 my-5">
                        <a
                            href={`https://goerli.etherscan.io/tx/${_transactionHash}`}
                            target="_blank"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            View on etherscan
                        </a>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center mt-20">
                    <div className="loader"></div>
                </div>
            )}
        </>
    )
}
