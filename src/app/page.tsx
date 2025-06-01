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
    const [isLoading, setIsLoading] = useState(true);
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
        try {
            const res = await GET(process.env.NEXT_PUBLIC_SERVER_URL + "/logs");
            const r = await res.json();
            setAllPost(r);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function whoami() {
        try {
            const res = await GET(`${process.env.NEXT_PUBLIC_SERVER_URL}/me`);
            const r = await res.json();
            setGlobalData({ username: r.username, login: r.login });
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }

    useEffect(() => {
        if (!hasFetched.current) {
            whoami();
            fetchPost();
            hasFetched.current = true;
        }
    }, []);

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="blog-container bg-white rounded-lg shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : postList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                            </svg>
                            <p className="text-xl font-medium">No posts yet</p>
                            <p className="mt-2 text-sm">Be the first to create a post!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {postList}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
