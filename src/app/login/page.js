"use client";

import { useRef } from "react";
import { POST } from "../util";
import { useRouter } from "next/navigation";
import { useGlobalData } from "../components/GlobalDataContext";

export default function LoginPage() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const router = useRouter();

    const { setGlobalData } = useGlobalData();

    async function submitOnClickHandler(event) {
        event.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        const res = await POST(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, {
            username,
            password,
        });

        const r = await res.json();

        if (r.found) {
            alert("Log in successful");
            setGlobalData({ username: r.username, login: true });
            router.push("/");
        } else {
            alert("Log in failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please sign in to your account
                    </p>
                </div>
                <form className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                ref={usernameRef}
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={submitOnClickHandler}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
