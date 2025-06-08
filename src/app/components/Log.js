import "./Log.scss";
import Comment from "./Comment";
import { GET, POST, getDateTime, DELETE } from "../util";
import { useEffect, useState, useRef } from "react";
import { useGlobalData } from "./GlobalDataContext";

export default function Log({
    fetchPost,
    logId,
    date,
    title,
    author,
    content,
}) {
    const [comment, setComment] = useState([]);
    const [subComment, setSubComment] = useState(null);
    const hasFetched = useRef(false);
    const commentInputRef = useRef();
    const commentInputContainerRef = useRef();
    const commentContainerRef = useRef();
    const newCommentButtonRef = useRef();

    const [replyingTo, setReplyingTo] = useState(null);
    // const [popUpVisible, setPopUpVisible] = useState(false);
    // const [popUpPosition, setPopUpPosition] = useState({x: 0, y: 0});
    // const [popUpInElementMeta, setPopUpInElementMeta] = useState({commentId: null, author: null})

    const [commentVisible, setCommentVisible] = useState(false);
    const { globalData } = useGlobalData();

    async function fetchCommment() {
        const res = await GET(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/comment?logId=${logId}`
        );
        const r = await res.json();
        // console.log(r);

        let subComment = new Map();
        for (let c of r) {
            if (c.parent_commentId) {
                if (subComment.has(c.parent_commentId)) {
                    subComment.get(c.parent_commentId).push(c);
                } else {
                    subComment.set(c.parent_commentId, [c]);
                }
            }
        }
        // console.log(subComment);
        setSubComment(subComment);
        setComment(r.filter(c => c.parent_commentId == null));
    }

    const commentList = comment.map((c) => { 
        let res = [];
        const subCommentOfThisComment = subComment.get(c.commentId);

        if (subCommentOfThisComment) { 
            let queue = [];
            for (const c1 of subCommentOfThisComment) { 
                queue.push([c1, null]);
            }

            let c2;
            while (c2 = queue.shift()) {
                res.push([c2[0], c2[1]]);
                for (const c3 of subComment.get(c2[0].commentId) || []) {
                    queue = [[c3, c2[0]], ...queue];
                }
            }
        }
        
        return (
        <Comment
            key={c.commentId}
            logId={c.logId}
            commentId={c.commentId}
            date={c.date}
            author={c.username}
            content={c.content}
            fetchCommment={fetchCommment}
            // setPopUpPosition={setPopUpPosition}
            // setPopUpVisible={setPopUpVisible}
            // setPopUpInElementMeta={setPopUpInElementMeta}
            commentInputRef={commentInputRef}
            commentInputContainerRef={commentInputContainerRef}
            setReplyingTo={setReplyingTo}
            // subComment={subComment}
            subComment={res}
        />
    )});

    // add new comment
    function newCommentOnClickHandler() {
        if (globalData.username) {
            setReplyingTo(null);
            commentInputRef.current.placeholder = `Reply to [${author} ${date}]:`;
            commentInputContainerRef.current.classList.remove("hidden");
            setCommentVisible(true);
        } else {
            alert("Please log in to comment");
        }
    }

    // show or hide comment
    function toggleHandler() {
        setCommentVisible(!commentVisible);
        if (commentVisible) {
            // If we're hiding comments, also hide the input container
            commentInputContainerRef.current.classList.add("hidden");
        }
    }

    // function replyClickHandler() {
    //     setPopUpVisible(false);
    //     commentInputRef.current.placeholder = `Reply to [${popUpInElementMeta.author}]:`;
    //     commentInputContainerRef.current.classList.remove("hidden");
    //     console.log(popUpInElementMeta.commentId, popUpInElementMeta.author);
    // }

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
                    parent_commentId: replyingTo
                }
            );

            setReplyingTo(null);

            if (res.ok) {
                await fetchCommment();
                setCommentVisible(true);
            }
        }
    }

    async function deleteOnClickHandler() {
        const res = await DELETE("/logs", {
            logId,
        });
        if (res.ok) {
            await fetchPost();
        }
    }

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchCommment();
        }
    }, []);

    // useEffect(() => {
    //     const handleOutsideClick = (event) => {
    //         if (!event.target.className.includes("single-comment") && !event.target.className.includes("pop-up-window")) {
    //           setPopUpVisible(false);
    //           setPopUpInElementMeta({commentId: null, author: null});
    //         }
    //       };
        
    //     if (popUpVisible) {
    //         document.addEventListener("mousedown", handleOutsideClick);
    //     } else {
    //         document.removeEventListener("mousedown", handleOutsideClick);
    //     }

    //     return () => {
    //         document.removeEventListener("mousedown", handleOutsideClick);
    //     };
    // }, [popUpVisible]);

    return (
        <article className="blog-post">
            <div className="blog-post-inner">
                {/* {popUpVisible && <div className="pop-up-window" onClick={replyClickHandler} style={{top: popUpPosition.y, left: popUpPosition.x}}>Reply</div>} */}
                <div className="blog-post-content">
                    {author === globalData.username && (
                        <button
                            className="blog-post-delete"
                            onClick={deleteOnClickHandler}
                            title="Delete post"
                        >
                            ×
                        </button>
                    )}
                    <div className="blog-post-header">
                        <div className="blog-post-title-container">
                            <h2 className="blog-post-title">
                                {title || "[No Title]"}
                            </h2>
                            <div className="blog-post-meta">
                                <span className="blog-post-author">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    {author}
                                </span>
                                <span className="blog-post-date">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    {date}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="blog-post-body">
                        {content}
                    </div>

                    <div className="blog-post-comments">
                        <div className="blog-post-comments-controls">
                            <button
                                className="blog-post-new-comment"
                                onClick={newCommentOnClickHandler}
                                ref={newCommentButtonRef}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                New Comment
                            </button>
                            <button
                                className="blog-post-toggle-comments"
                                onClick={toggleHandler}
                            >
                                <span 
                                    className="blog-post-toggle-icon"
                                    style={{ transform: commentVisible ? 'rotate(180deg)' : 'none' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span className="blog-post-comments-count">Comments ({comment.length})</span>
                            </button>
                        </div>
                    </div>

                    <ul 
                        className="blog-post-comments-list"
                        ref={commentContainerRef}
                        style={{ 
                            maxHeight: commentVisible ? '300px' : '0',
                            opacity: commentVisible ? 1 : 0,
                            marginTop: commentVisible ? '1rem' : '0',
                            marginBottom: commentVisible ? '1rem' : '0'
                        }}
                    >
                        {commentList}
                    </ul>

                    <div
                        className="blog-post-comment-form hidden"
                        ref={commentInputContainerRef}
                    >
                        <input
                            className="blog-post-comment-input"
                            ref={commentInputRef}
                            placeholder="Write your comment..."
                        />
                        <button
                            className="blog-post-comment-submit"
                            onClick={commentSubmitOnClickHandler}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
