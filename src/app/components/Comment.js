import "./Comment.scss";

export default function Comment({ date, author, content }) {
    return (
        <div className="container">
            <div>
                <div>{author}</div>
                <div>{date}</div>
            </div>
            <div>{content}</div>
        </div>
    );
}
