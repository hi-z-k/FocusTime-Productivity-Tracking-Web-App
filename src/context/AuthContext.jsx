import React, { createContext } from "react";
import useAuth from "../hooks/useAuth";

export const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>
        {children}
        </AuthContext.Provider>;
};