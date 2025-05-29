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
        <div>
            <h3>Log in</h3>
            <form>
                <div>Username:</div>
                <input ref={usernameRef} />
                <div>Password:</div>
                <input ref={passwordRef} />
                <br />
                <br />
                <button onClick={submitOnClickHandler}>Log in</button>
            </form>
            <br />
            <div>
                Don&apos;t have account?{" "}
                <b>
                    <a href="/signup">Sign up</a>
                </b>
            </div>
        </div>
    );
}
