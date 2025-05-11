import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import AmiiboGrid from "../../components/AmiiboGrid/AmiiboGrid";
import style from "../AmiiboCollection/AmiiboCollection.module.css";
import AmiiboTable from "../../components/AmiiboTable/AmiiboTable";
import NotFound from "../../assets/images/notfound.png";
import clsx from "clsx";

const Profile = () => {
    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
    const [savedAmiibos, setSavedAmiibos] = useState([]);
    const [displayGrid, setDisplayGrid] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!isAuthenticated) return;

            try {
                // Ottieni il token di accesso
                const token = await getAccessTokenSilently({
                    audience: "https://amiibo-api", // Assicurati che l'audience sia corretta
                });

                // Richiesta per ottenere la collezione di amiibo salvati
                const response = await axios.get("/profile/collection", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Assicurati che 'savedAmiibos' sia un array
                setSavedAmiibos(response.data.savedAmiibos || []);
            } catch (err) {
                console.error("Error during the request", err);
                setError("Your collection could not be loaded. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    if (loading) {
        return <div className="text-center">Loading...</div>; // Potresti usare uno spinner qui
    }

    if (error) {
        return <div className="error">{error}</div>; // Gestisci il messaggio di errore
    }

    return (
        <div className="container">
            <h1>Welcome to your collection</h1>
            {user && <p>Email: {user.email}</p>} {/* Mostra l'email dell'utente */}
            <hr />
            <div className="row justify-content-center">
                <div className="col">
                    <div>
                        <div
                            className={clsx(style.option, { [style.active]: displayGrid })}
                            onClick={() => setDisplayGrid(true)}
                        >
                            Grid
                        </div>
                        <div
                            className={clsx(style.option, { [style.active]: !displayGrid })}
                            onClick={() => setDisplayGrid(false)}
                        >
                            Table
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col">
                    {savedAmiibos.length > 0 ? (
                        displayGrid ? (
                            <AmiiboGrid amiibos={savedAmiibos} />
                        ) : (
                            <AmiiboTable amiibos={savedAmiibos} />
                        )
                    ) : (
                        <div className="text-center">
                            <img src={NotFound} alt="Not found" width={110} />
                            <p>No amiibos saved yet!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
