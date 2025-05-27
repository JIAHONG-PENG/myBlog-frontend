"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useGlobalData } from "../components/GlobalDataContext";
import { getDateTime } from "../util";

import "./newPost.scss";

export default function NewPostPage() {
    const titleRef = useRef();
    const contentRef = useRef();

    const { globalData } = useGlobalData();

    const router = useRouter();

    const POST = async function (url, body) {
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    };

    const newLogSubmitButtonOnClick = async function () {
        if (contentRef.current.value == "") {
            console.log("content cant be empty");
        } else {
            const res = await POST(
                process.env.NEXT_PUBLIC_SERVER_URL + "/logs",
                {
                    username: globalData.username,
                    title: titleRef.current.value,
                    date: getDateTime(),
                    content: contentRef.current.value,
                }
            );
            const r = await res.json();
            console.log(r);
            router.push("/");
        }
    };

    return (
        <div className="container">
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
