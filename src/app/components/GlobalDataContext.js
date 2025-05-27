"use client"; // if used in App Router

import { createContext, useContext, useState } from "react";

const GlobalDataContext = createContext(null);

export function GlobalDataProvider({ children }) {
    const [globalData, setGlobalData] = useState({ username: "test" });

    return (
        <GlobalDataContext.Provider value={{ globalData, setGlobalData }}>
            {children}
        </GlobalDataContext.Provider>
    );
}

export function useGlobalData() {
    const context = useContext(GlobalDataContext);
    if (!context)
        throw new Error(
            "useGlobalData must be used within a GlobalDataProvider"
        );
    return context;
}
