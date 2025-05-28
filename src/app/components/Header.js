"use client";

import "./Header.scss";
import { useRouter } from "next/navigation";
import { useGlobalData } from "../components/GlobalDataContext";
import { GET } from "../util";

export default function Headers() {
    const router = useRouter();
    const { globalData, setGlobalData } = useGlobalData();

    function loginOnClickHandler() {
        router.push("/login");
    }

    async function logoutOnClickHandler() {
        await GET(`${process.env.NEXT_PUBLIC_SERVER_URL}/logout`);
        setGlobalData({ username: null, login: false });
    }

    function newPostOnClickHandler() {
        router.push("/newPost");
    }

    return (
        <section id="header-section">
            <h2 className="title">My Blog</h2>
            <div className="username">
                {globalData.login ? (
                    <div
                        className="log-out-button"
                        onClick={logoutOnClickHandler}
                    >
                        Log out
                    </div>
                ) : (
                    <div
                        className="log-in-button"
                        onClick={loginOnClickHandler}
                    >
                        Log in
                    </div>
                )}
                {`User: ${globalData.username}`}
            </div>
            <div className="new-log-button" onClick={newPostOnClickHandler}>
                New Post
            </div>
        </section>
    );
}
