"use client";

import "./page.scss";
import Header from "./components/Header";
import Log from "./components/Log";
import { useEffect, useState } from "react";
import React from "react";

type Post = {
    logId: number;
    username: string;
    title: string;
    date: string;
    content: string;
};

export default function Home() {
    const GET = async function (url: string) {
        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    const [allPost, setAllPost] = useState<Array<Post>>([]);

    const postList: React.JSX.Element[] = allPost.map(
        ({ logId, username, title, date, content }: Post, index: number) => (
            <Log
                key={index}
                logId={logId}
                title={title}
                date={date}
                author={username}
                content={content}
            />
        )
    );

    async function fetchPost() {
        const res = await GET(process.env.NEXT_PUBLIC_SERVER_URL + "/logs");
        const r = await res.json();
        setAllPost(r);
    }

    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <div>
            <Header />
            <div className="blog-container">
                {postList}
                {/* <Log
                    title="test1"
                    author="chris"
                    date="2025.1.1 08:00"
                    content="ababasdfsfasdfdf sdfsdf dsdf sdfsdf sdfsdfsdf sdfds sdfsdf dsfsdfsdf dsfsdfsd dfdfsd sdf dsf dsf d dsff sdf sdfsdfsd fsd sdfsdfsdfsd sdfsd fsdfsdfsdfsdf "
                />
                <Log
                    title="test1"
                    author="chris"
                    date="2025.1.1 08:00"
                    content="ababasdfsfasdfdf sdfsdf dsdf sdfsdf sdfsdfsdf sdfds sdfsdf dsfsdfsdf dsfsdfsd dfdfsd sdf dsf dsf d dsff sdf sdfsdfsd fsd sdfsdfsdfsd sdfsd fsdfsdfsdfsdf "
                />
                <Log
                    title="test1"
                    author="chris"
                    date="2025.1.1 08:00"
                    content="ababasdfsfasdfdf sdfsdf dsdf sdfsdf sdfsdfsdf sdfds sdfsdf dsfsdfsdf dsfsdfsd dfdfsd sdf dsf dsf d dsff sdf sdfsdfsd fsd sdfsdfsdfsd sdfsd fsdfsdfsdfsdf "
                /> */}
            </div>
        </div>
    );
}
