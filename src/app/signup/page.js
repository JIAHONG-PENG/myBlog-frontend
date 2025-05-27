"use client";

import { useRef } from "react";
import { POST, getDateTime } from "../util";
import { useRouter } from "next/navigation";

export default function SigninPage() {
    const usernameRef = useRef();
    const password1Ref = useRef();
    const password2Ref = useRef();
    const router = useRouter();

    async function onSubmitHandler(event) {
        event.preventDefault();
        const username = usernameRef.current.value;
        const password1 = password1Ref.current.value;
        const password2 = password2Ref.current.value;

        if (password1 != password2) {
            alert("Please enter the same password and try again.");
        } else {
            const res = await POST(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/signup`,
                {
                    username,
                    password: password1,
                    date: getDateTime(),
                }
            );
            const r = await res.json();

            if (r.status == 500) {
                alert("Username existing");
            } else {
                alert("Sign up sucessful");
                router.push("/");
            }
        }
    }

    return (
        <div>
            <form>
                <h3>Sign up</h3>
                <div>Username:</div>
                <input ref={usernameRef} />
                <div>Password:</div>
                <input ref={password1Ref} />
                <div>Enter password again:</div>
                <input ref={password2Ref} />
                <button onClick={onSubmitHandler}>Submit</button>
            </form>
        </div>
    );
}
