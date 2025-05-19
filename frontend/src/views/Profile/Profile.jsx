import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useSavedAmiibos } from "../../context/SavedAmiiboProvider.jsx";
import AmiiboGrid from "../../components/AmiiboGrid/AmiiboGrid";
import AmiiboTable from "../../components/AmiiboTable/AmiiboTable";
import NotFound from "../../assets/images/notfound.png";
import clsx from "clsx";
import style from "../AmiiboCollection/AmiiboCollection.module.css";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { savedTails } = useSavedAmiibos();
    const [amiiboDetails, setAmiiboDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayGrid, setDisplayGrid] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!isAuthenticated || savedTails.length === 0) {
                setAmiiboDetails([]);
                setLoading(false);
                return;
            }
            //Se utente autenticato allora recupero dei dettagli degli amiibo salvati dati loro tail
            try {
                const detailPromises = savedTails.map((tail) =>
                    axios.get(`http://localhost:3000/collection/${tail}`)
                );
                const responses = await Promise.all(detailPromises);
                const amiibos = responses.map(res => res.data);
                setAmiiboDetails(amiibos);
            } catch (err) {
                console.error("Errore fetching saved amiibos' deatils:", err);
                setError("Could not load your collection.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [savedTails, isAuthenticated]);


    if (loading || isLoading) {
        return (
            <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container">
            <h1>Welcome to your collection</h1>
            {/* Modalità di visualizzazione */}
            <div className="row align-items-center mb-4">
                <div className="col d-flex justify-content-between align-items-center flex-wrap gap-3">
                    {user && <p className="mb-0">Email: {user.email}</p>}
                    <div className={style.filter}>
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
            {/* Lista amiibo salvati */}
            <div className="row justify-content-center">
                <div className="col">
                    {amiiboDetails.length > 0 ? (
                        displayGrid ? (
                            <AmiiboGrid
                                amiiboList={amiiboDetails}
                                savedTails={savedTails}
                                onSave={() => {}}
                                onUnsave={() => {}}
                            />
                        ) : (
                            <AmiiboTable
                                amiiboList={amiiboDetails}
                                savedTails={savedTails}
                                onSave={() => {}}
                                onUnsave={() => {}}
                            />
                        )
                    ) : (
                        <div className="noResultsContainer">
                            <img src={NotFound} alt="Not Found" width={110} />
                            <p>No amiibos saved yet!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;