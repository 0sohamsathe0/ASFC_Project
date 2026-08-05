import { createContext, useContext, useState } from "react";

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }) => {
    const [isServerDown, setIsServerDown] = useState(false);

    return (
        <ServerStatusContext.Provider
            value={{
                isServerDown,
                setIsServerDown
            }}
        >
            {children}
        </ServerStatusContext.Provider>
    );
};

export const useServerStatus = () => useContext(ServerStatusContext);