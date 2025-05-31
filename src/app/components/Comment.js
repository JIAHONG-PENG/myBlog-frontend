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
        <div className="container">
            <div>
                <div>{author}</div>
                <div>{date}</div>
            </div>
            <div>{content}</div>
            {author == globalData.username && (
                <div
                    className="comment-delete-button"
                    onClick={deleteOnClickHandler}
                >
                    x
                </div>
            )}
        </div>
    );
}
