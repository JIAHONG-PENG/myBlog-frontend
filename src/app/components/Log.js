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
    const commentContainerRef = useRef();
    const newCommentButtonRef = useRef();

    const [commentVisible, setCommentVisible] = useState(false);
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
            logId={c.logId}
            commentId={c.commentId}
            date={c.date}
            author={c.username}
            content={c.content}
            fetchCommment={fetchCommment}
        />
    ));

    // add new comment
    function newCommentOnClickHandler() {
        commentInputContainerRef.current.classList.toggle("hidden");
        setCommentMaxHeight();
        setCommentVisible(true);
    }

    // show or hide comment
    function toggleHandler() {
        if (commentVisible) {
            commentContainerRef.current.style.maxHeight = "0px";
            commentInputContainerRef.current.classList.add("hidden");
        } else {
            setCommentMaxHeight();
        }
        setCommentVisible(!commentVisible);
    }

    async function commentSubmitOnClickHandler() {
        if (commentInputRef.current.value == "") {
            alert("Comment can't be empty.");
        } else {
            // hide comment input
            commentInputContainerRef.current.classList.add("hidden");
            const c = commentInputRef.current.value;
            // empty comment input
            commentInputRef.current.value = "";

            const res = await POST(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/comment`,
                {
                    logId,
                    username: globalData.username,
                    date: getDateTime(),
                    content: c,
                }
            );

            if (res.ok) {
                await fetchCommment().then(() => {
                    requestAnimationFrame(() => {
                        setCommentMaxHeight();
                    });
                });
            }
        }
    }

    function setCommentMaxHeight() {
        if (commentContainerRef.current) {
            commentContainerRef.current.style.maxHeight = "400px";
        }
    }

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchCommment().then(() => {
                requestAnimationFrame(() => {
                    commentContainerRef.current.style.maxHeight = "0px";
                    // setCommentMaxHeight();
                });
            });
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
                    <div
                        style={{ display: "inline", cursor: "pointer" }}
                        onClick={toggleHandler}
                    >
                        {commentVisible ? "▲" : "▼"}{" "}
                    </div>
                    <u>Comment ({comment.length})</u>
                </h3>
                <div
                    className="new-commment-button"
                    onClick={newCommentOnClickHandler}
                    ref={newCommentButtonRef}
                >
                    + New Commment
                </div>
            </div>
            <ul className="comment-container" ref={commentContainerRef}>
                {commentList}
            </ul>
            <div
                className="new-comment-input-container hidden"
                ref={commentInputContainerRef}
            >
                <input className="new-comment-input" ref={commentInputRef} />
                <div
                    className="new-comment-input-button"
                    onClick={commentSubmitOnClickHandler}
                >
                    Send
                </div>
            </div>
        </div>
    );
}
