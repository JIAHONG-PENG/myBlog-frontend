"use client";

import "./Header.scss";

export default function Headers() {
    // const POST = async function (url, body) {
    //     return await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(body),
    //     });
    // };

    // const newLogButtonOnClick = async function () {};
    return (
        <section id="header-section">
            <h2 className="title">My Blog</h2>
            <div className="username">
                <div className="log-in-button">Log in</div>
                User: none
            </div>
            <div className="new-log-button">New Post</div>
        </section>
    );
}
