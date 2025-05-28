"use client"; // if used in App Router

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";

type GlobalData = {
    username: string | null;
    login: boolean;
};

type GlobalDataProviderProps = {
    children: ReactNode;
};

type GlobalDataContextType = {
    globalData: GlobalData;
    setGlobalData: Dispatch<SetStateAction<GlobalData>>;
};

const GlobalDataContext = createContext<GlobalDataContextType | null>(null);

export function GlobalDataProvider({ children }: GlobalDataProviderProps) {
    const [globalData, setGlobalData] = useState<GlobalData>({
        username: null,
        login: false,
    });

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
