import "./Comment.scss";
import { DELETE } from "../util";

export default function Comment({
    logId,
    commentId,
    date,
    author,
    content,
    fetchCommment,
}) {
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
            <div className="delete-button" onClick={deleteOnClickHandler}>
                x
            </div>
        </div>
    );
}
