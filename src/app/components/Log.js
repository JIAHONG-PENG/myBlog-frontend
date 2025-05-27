import "./Log.scss";
import Comment from "./Comment";
import { GET } from "../util";
import { useEffect, useState, useRef } from "react";

export default function Log({ logId, date, title, author, content }) {
    const [comment, setComment] = useState([]);
    const hasFetched = useRef(false);

    async function fetchCommment() {
        const res = await GET(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/comment?logId=${logId}`
        );
        const r = await res.json();
        // console.log(r);
        setComment(r);
    }

    const commentList = comment.map((c, index) => (
        <Comment
            key={index}
            date={c.date}
            author={c.username}
            content={c.content}
        />
    ));

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchCommment();
        }
    }, []);

    return (
        <div className="log-container">
            <h3>Title: </h3>
            <div>{title == "" ? "[No Title]" : title}</div>
            <h4>Author: </h4>
            <div>{author}</div>
            <div>{date}</div>
            <div className="content">{content}</div>

            <h3>
                <u>Comment</u>
            </h3>
            <ul className="comment-container">{commentList}</ul>
        </div>
    );
}
