"use client";

import "./page.scss";
import Header from "./components/Header";
import Log from "./components/Log";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { GET } from "./util";
import { useGlobalData } from "./components/GlobalDataContext";
// import { useRouter } from "next/navigation";

type Post = {
    logId: number;
    username: string;
    title: string;
    date: string;
    content: string;
};

export default function Home() {
    const [allPost, setAllPost] = useState<Array<Post>>([]);
    const hasFetched = useRef(false);

    const { setGlobalData } = useGlobalData();
    // const router = useRouter();

    const postList: React.JSX.Element[] = allPost.map(
        ({ logId, username, title, date, content }: Post, index: number) => (
            <Log
                key={index}
                logId={logId}
                title={title}
                date={date}
                author={username}
                content={content}
                fetchPost={fetchPost}
            />
        )
    );

    async function fetchPost() {
        const res = await GET(process.env.NEXT_PUBLIC_SERVER_URL + "/logs");
        const r = await res.json();
        setAllPost(r);
    }

    async function whoami() {
        const res = await GET(`${process.env.NEXT_PUBLIC_SERVER_URL}/me`);
        const r = await res.json();
        setGlobalData({ username: r.username, login: r.login });
        // if (!r.login) {
        //     alert("You aren't logged in. To make a post, please log in first");
        //     // router.push("/login");
        // }
    }

    useEffect(() => {
        if (!hasFetched.current) {
            whoami();
            fetchPost();
            hasFetched.current = true;
        }
    }, []);

    return (
        <div>
            <Header />
            <div className="blog-container">
                {postList.length == 0 ? "No post yet" : postList}
            </div>
        </div>
    );
}
