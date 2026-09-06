import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { api } from "../components/api";

const AuthContext = createContext();

const toPlayerSessionUser = (player) => ({
    id: player?._id || player?.id,
    role: "player",
    fullName: player?.fullName || "",
    event: player?.event || "",
    photoURL: player?.photoURL || "",
    faiId: player?.faiId || "",
    mfaId: player?.mfaId || "",
    hasFaiRegistration: player?.hasFaiRegistration ?? true,
    hasMfaRegistration: player?.hasMfaRegistration ?? true,
    requestStatus: player?.requestStatus || "",
    rejectionReason: player?.rejectionReason || "",
    identityLoaded: true,
});

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
                if (
                    error.response?.status !== 401 &&
                    error.response?.status !== 403
                ) {
                    console.error(error);
                }
            }

            try {
                const playerResponse = await api.get("/player/profile");

                if (playerResponse.data.success) {
                    setUser(toPlayerSessionUser(playerResponse.data.player));
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
            throw error
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
