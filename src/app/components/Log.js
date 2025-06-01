// import "./Log.scss";
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
        if (globalData.username) {
            commentInputContainerRef.current.classList.toggle("hidden");
            setCommentVisible(true);
        } else {
            alert("Please log in first");
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

    return (
        <article className="log-container bg-white rounded-lg shadow-md overflow-hidden w-full max-w-4xl mx-auto">
            <div className="p-4 sm:p-6 md:p-8">
                <div className="relative">
                    {author === globalData.username && (
                        <button
                            className="log-delete-button absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors duration-200 flex-shrink-0"
                            onClick={deleteOnClickHandler}
                            title="Delete post"
                        >
                            ×
                        </button>
                    )}
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4 pt-10 sm:pt-0">
                        <div className="flex-grow w-full">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words pr-8">
                                {title || "[No Title]"}
                            </h2>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm text-gray-600 mb-4 gap-2 sm:gap-4">
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    {author}
                                </span>
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    {date}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="content prose max-w-none text-gray-700 mb-6 p-3 sm:p-4 rounded-lg bg-gray-50 text-sm sm:text-base">
                        {content}
                    </div>

                    <div className="comment-header border-t pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <button
                                className="new-commment-button bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center sm:justify-start order-first sm:order-last"
                                onClick={newCommentOnClickHandler}
                                ref={newCommentButtonRef}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                New Comment
                            </button>
                            <button
                                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 order-last sm:order-first"
                                onClick={toggleHandler}
                            >
                                <span 
                                    className="transform transition-transform duration-200 inline-flex items-center" 
                                    style={{ transform: commentVisible ? 'rotate(180deg)' : 'none' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span className="ml-2 font-medium">Comments ({comment.length})</span>
                            </button>
                        </div>
                    </div>

                    <ul 
                        className="comment-container space-y-4 transition-all duration-300 ease-in-out overflow-hidden"
                        ref={commentContainerRef}
                        style={{ 
                            maxHeight: commentVisible ? '2000px' : '0',
                            opacity: commentVisible ? 1 : 0,
                            marginTop: commentVisible ? '1rem' : '0',
                            marginBottom: commentVisible ? '1rem' : '0'
                        }}
                    >
                        {commentList}
                    </ul>

                    <div
                        className="new-comment-input-container hidden mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                        ref={commentInputContainerRef}
                    >
                        <input
                            className="new-comment-input flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                            ref={commentInputRef}
                            placeholder="Write your comment..."
                        />
                        <button
                            className="new-comment-input-button bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex-shrink-0 w-full sm:w-auto"
                            onClick={commentSubmitOnClickHandler}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
