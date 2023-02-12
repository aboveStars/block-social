import { Skeleton } from "web3uikit"

export default function ReturnSkeletons({ _length }) {
    return (
        <>
            {Array.from({ length: _length }, (_, index) => (
                <div
                    className="shadow rounded-md border border-gray-900 p-4 max-w-sm w-full mx-auto my-2"
                    key={index}
                >
                    <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                            <div className="h-2 bg-slate-700 rounded"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                                </div>
                                <div className="h-2 bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
