"use client";

import { useRouter } from "next/navigation";
import { useGlobalData } from "../components/GlobalDataContext";
import { GET } from "../util";
import { useState } from "react";

export default function Headers() {
    const router = useRouter();
    const { globalData, setGlobalData } = useGlobalData();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function loginOnClickHandler() {
        router.push("/login");
        setIsMobileMenuOpen(false);
    }

    async function logoutOnClickHandler() {
        await GET(`${process.env.NEXT_PUBLIC_SERVER_URL}/logout`);
        setGlobalData({ username: null, login: false });
        setIsMobileMenuOpen(false);
    }

    function newPostOnClickHandler() {
        if (globalData.username) {
            router.push("/newPost");
            setIsMobileMenuOpen(false);
        } else {
            alert("Please log in first");
        }
    }

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - New Post button */}
                    <div className="hidden md:block">
                        <button 
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
                            onClick={newPostOnClickHandler}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span>New Post</span>
                        </button>
                    </div>

                    {/* Center - Title */}
                    <div className="flex-1 flex justify-center">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">My Blog</h2>
                    </div>

                    {/* Right side - User info and login/logout for desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {globalData.login ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600">Welcome, {globalData.username}</span>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                                    onClick={logoutOnClickHandler}
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                onClick={loginOnClickHandler}
                            >
                                Log in
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                    {globalData.login ? (
                        <>
                            <div className="px-3 py-2 text-sm text-gray-600">
                                Welcome, {globalData.username}
                            </div>
                            <button
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                onClick={newPostOnClickHandler}
                            >
                                New Post
                            </button>
                            <button
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={logoutOnClickHandler}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                onClick={newPostOnClickHandler}
                            >
                                New Post
                            </button>
                            <button
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                onClick={loginOnClickHandler}
                            >
                                Log in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
