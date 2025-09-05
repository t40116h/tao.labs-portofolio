"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type AppContextValue = {
    ready: boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [ready] = useState(true);
    const value = useMemo(() => ({ ready }), [ready]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}


