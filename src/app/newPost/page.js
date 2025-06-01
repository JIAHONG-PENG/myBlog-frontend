"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useGlobalData } from "../components/GlobalDataContext";
import { getDateTime, POST } from "../util";

// import "./newPost.scss";

export default function NewPostPage() {
    const titleRef = useRef();
    const contentRef = useRef();
    const { globalData } = useGlobalData();
    const router = useRouter();

    const newLogSubmitButtonOnClick = async function () {
        if (contentRef.current.value == "") {
            alert("Content can't be empty");
        } else {
            const res = await POST(process.env.NEXT_PUBLIC_SERVER_URL + "/logs", {
                username: globalData.username,
                title: titleRef.current.value,
                date: getDateTime(),
                content: contentRef.current.value,
            });

            if (res.ok) {
                router.push("/");
            } else {
                alert("Failed to create post");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
                                Create New Post
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 text-center">
                                Share your thoughts with the community
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <div className="mt-1">
                                    <input
                                        ref={titleRef}
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base sm:text-lg border-gray-300 rounded-md py-3 px-4"
                                        placeholder="Enter your post title"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                    Content
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        ref={contentRef}
                                        id="content"
                                        name="content"
                                        rows="8"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base sm:text-lg border-gray-300 rounded-md py-3 px-4"
                                        placeholder="Write your post content here..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => router.push('/')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={newLogSubmitButtonOnClick}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Publish Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
