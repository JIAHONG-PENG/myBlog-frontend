import "./Comment.scss";
import { DELETE } from "../util";
import { useGlobalData } from "./GlobalDataContext";
import { useEffect, useState } from "react";

export default function Comment({
    logId,
    commentId,
    date,
    author,
    content,
    fetchCommment,
    // setPopUpVisible,
    // setPopUpPosition,
    // setPopUpInElementMeta,
    subComment,
    commentInputRef,
    commentInputContainerRef,
    setReplyingTo,
}) {
    const { globalData } = useGlobalData();
    const [subCommentVisible, setSubCommentVisible] = useState(false);
    // sub-comment of this comment
    // const [subCommentOfThisComment, setSubCommentOfThisComment] = useState(subComment?.get(commentId));

    // function commentOnClickHandler(event) {
    //     setPopUpPosition({x: event.clientX, y: event.clientY});
    //     setPopUpVisible(true);
    //     setPopUpInElementMeta({commentId, author})
    // }

    function replyOnClickHandler() {
        if (globalData.username === null) {
            alert("Please login to reply");
            return;
        }

        commentInputRef.current.placeholder = `Reply to [${author} ${date}]:`;
        commentInputContainerRef.current.classList.remove("hidden");
        setReplyingTo(commentId);
    }

    async function deleteOnClickHandler() {
        const res = await DELETE("/comment", {
            commentId,
            logId,
        });
        if (res.ok) {
            await fetchCommment();
        }
    }

    function subCommentToggleOnClickHandler() {
        setSubCommentVisible(!subCommentVisible);
    }

    function subCommentOnClickHandler(commentId) {
        const targetComment = subComment.find(c => c[0].commentId === commentId);
        commentInputRef.current.placeholder = `Reply to [${targetComment[0].username} ${targetComment[0].date}]:`;
        commentInputContainerRef.current.classList.remove("hidden");
        setReplyingTo(targetComment[0].commentId);
    }

    // const subCommentLi = subCommentOfThisComment?.flatMap((c) => { 
    //     let res = [<li key={c.commentId} onClick={() => subCommentOnClickHandler(c.commentId)}>{c.date} {c.username} : {c.content}</li>];
    //     let subComment_of_subComment = subComment.get(c.commentId);

    //     if (subComment_of_subComment) {
    //         let stack = [];
    //         for (const c1 of subComment_of_subComment) { 
    //             stack.push(c1);
    //         }

    //         let c2;
    //         while (c2 = stack.pop()) {
    //             res.push(<li key={c2.commentId} onClick={() => subCommentOnClickHandler(c2.commentId)}>{c2.date} {c2.username} {"▶"} {c.username} : {c2.content}</li>);
                
    //             for (const c3 of subComment.get(c2.commentId) || []) {
    //                 stack.push(c3);
    //             }
    //         }
    //     }

    //     return res;
    //    }
    // );
    
    const subCommentLi = subComment.map((c) => { 
        return <li key={c[0].commentId} onClick={() => subCommentOnClickHandler(c[0].commentId)}>{c[0].date} {c[0].username} {c[1] && "▶"} {c[1]?.username} : {c[0].content}</li>;
    });
    
    useEffect(() => {
        // console.log(subComment_new)
    }, [])

    return (
        <>
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
            {!subCommentVisible && subComment.length > 0 && <div className="single-comment-subComment-button" onClick={subCommentToggleOnClickHandler}>See {subComment.length} comments</div>}
            {subCommentVisible && <ul className="single-comment-subComment">{subCommentLi}</ul>}
            {subCommentVisible && subComment.length > 0 && <div className="single-comment-subComment-button" onClick={subCommentToggleOnClickHandler}>Collapse</div>}
            <div className="reply-button" onClick={replyOnClickHandler}>Reply</div>
        </div>
        </>
    );
}
