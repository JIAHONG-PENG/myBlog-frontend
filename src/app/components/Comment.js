import "./Comment.scss";
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
        <div className="single-comment">
            <div className="single-comment-header">
                <div className="single-comment-author">
                    {author}
                </div>
                <div className="single-comment-date">{date}</div>
            </div>
            <div className="single-comment-content">
                {content}
            </div>
            {author === globalData.username && (
                <button
                    className="single-comment-delete"
                    onClick={deleteOnClickHandler}
                    title="Delete comment"
                    aria-label="Delete comment"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
