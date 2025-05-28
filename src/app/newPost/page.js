"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useGlobalData } from "../components/GlobalDataContext";
import { getDateTime, POST } from "../util";

import "./newPost.scss";

export default function NewPostPage() {
    const titleRef = useRef();
    const contentRef = useRef();

    const { globalData } = useGlobalData();

    const router = useRouter();

    const newLogSubmitButtonOnClick = async function () {
        if (contentRef.current.value == "") {
            alert("Content cant be empty");
        } else {
            await POST(process.env.NEXT_PUBLIC_SERVER_URL + "/logs", {
                username: globalData.username,
                title: titleRef.current.value,
                date: getDateTime(),
                content: contentRef.current.value,
            });

            router.push("/");
        }
    };

    return (
        <div className="new-post-container">
            <div>
                <h4>Title</h4>
                <input className="title" ref={titleRef} />
            </div>
            <div>
                <h4>Content</h4>
                <textarea className="content" ref={contentRef}></textarea>
            </div>
            <div className="submit-button" onClick={newLogSubmitButtonOnClick}>
                Submit
            </div>
        </div>
    );
}
