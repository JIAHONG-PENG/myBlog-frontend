import "./Log.scss";
import Comment from "./Comment";
import { GET, POST, getDateTime } from "../util";
import { useEffect, useState, useRef } from "react";
import { useGlobalData } from "./GlobalDataContext";

export default function Log({ logId, date, title, author, content }) {
    const [comment, setComment] = useState([]);
    const hasFetched = useRef(false);
    const commentInputRef = useRef();
    const commentInputContainerRef = useRef();
    const { globalData } = useGlobalData();

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

    function newCommentOnClickHandler() {
        commentInputContainerRef.current.classList.remove("hidden");
    }

    async function commentSubmitOnClickHandler() {
        if (commentInputRef.current.value == "") {
            alert("Comment can't be empty.");
        } else {
            const res = await POST(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/comment`,
                {
                    logId,
                    username: globalData.username,
                    date: getDateTime(),
                    content: commentInputRef.current.value,
                }
            );
            const r = await res.json();
            console.log(r);
        }
    }

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

            <div className="comment-header">
                <h3>
                    <u>Comment</u>
                </h3>
                <div
                    className="new-commment-button"
                    onClick={newCommentOnClickHandler}
                >
                    {" "}
                    + New Commment
                </div>
            </div>
            <ul className="comment-container">
                {commentList}
                <div
                    className="new-comment-input-container hidden"
                    ref={commentInputContainerRef}
                >
                    <input
                        className="new-comment-input"
                        ref={commentInputRef}
                    />
                    <div className="new-comment-input-button">Send</div>
                </div>
            </ul>
        </div>
    );
}
