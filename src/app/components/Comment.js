// import "./Comment.scss";
import { DELETE } from "../util";
import { useGlobalData } from "./GlobalDataContext";

export default function Comment({
    logId,
    commentId,
    date,
    author,
    content,
    fetchCommment,
}) {
    const { globalData } = useGlobalData();

    async function deleteOnClickHandler() {
        const res = await DELETE("/comment", {
            commentId,
            logId,
        });
        if (res.ok) {
            await fetchCommment();
        }
    }

    return (
        <div className="container bg-gray-50 rounded-lg p-3 sm:p-4 md:p-5 relative group transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-xs sm:text-sm text-gray-600">
                <div className="font-medium text-gray-900 text-sm sm:text-base">{author}</div>
                <div className="text-xs sm:text-sm opacity-75">{date}</div>
            </div>
            <div className="flex-grow text-gray-700 mt-2 sm:mt-3 break-words text-sm sm:text-base">
                {content}
            </div>
            {author === globalData.username && (
                <button
                    className="comment-delete-button absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 bg-red-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={deleteOnClickHandler}
                    title="Delete comment"
                    aria-label="Delete comment"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
}
