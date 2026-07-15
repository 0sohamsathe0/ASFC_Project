import {
createContext,
useContext,
useEffect,
useState,
} from "react";

import { api } from "../components/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const restoreSession = async () => {
        try {
            const adminResponse = await api.get("/admin/verify");

            if (adminResponse.data.success) {
                setUser({
                    role: "admin",
                });

                setLoading(false);
                return;
            }
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error(error);
            }
        }

        try {
            const playerResponse = await api.get("/player/profile");

            if (playerResponse.data.success) {
                setUser({
                    role: "player",
                    ...playerResponse.data.player,
                });
            }
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    restoreSession();
}, []);

const login = (userData) => {
    setUser(userData);
};

const logout = async () => {
    try {
        await api.post("/player/logout");
        setUser(null);
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        setUser(null);
    }
};

return (
    <AuthContext.Provider
        value={{
            user,
            login,
            logout,
            loading,
        }}
    >
        {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);