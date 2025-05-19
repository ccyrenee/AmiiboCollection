import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const SavedAmiiboContext = createContext();

export const SavedAmiiboProvider = ({ children }) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [savedTails, setSavedTails] = useState([]);

    const fetchSavedTails = async () => {
        if (!isAuthenticated) return;
        //Se utente autenticato allora recupera gli amiibo salvati
        try {
            const token = await getAccessTokenSilently({ audience: "https://amiibo-api" });
            const res = await axios.get("http://localhost:3000/profile/collection", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const tails = res.data?.savedAmiibos.map(t => typeof t === 'string' ? t : t.tail) || [];
            setSavedTails(tails);
        } catch (error) {
            console.error("Error fetching saved tails:", error);
        }
    };

    useEffect(() => {
        fetchSavedTails();
    }, [isAuthenticated]);

    return (
        <SavedAmiiboContext.Provider value={{ savedTails, setSavedTails, fetchSavedTails }}>
            {children}
        </SavedAmiiboContext.Provider>
    );
};

export const useSavedAmiibos = () => useContext(SavedAmiiboContext);