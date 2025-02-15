import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import AmiiboGrid from "../../components/AmiiboGrid/AmiiboGrid";
import style from "../AmiiboCollection/AmiiboCollection.module.css";
import AmiiboTable from "../../components/AmiiboTable/AmiiboTable";
import NotFound from "../../assets/images/notfound.png";

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
                const token = await getAccessTokenSilently({
                    audience: "amiiboapi.collection.com",
                });
                const response = await axios.get("/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSavedAmiibos(response.data.savedAmiibos);
            } catch (err) {
                console.error("Error during the request", err);
                setError("Your collection could not be loaded");
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(() => fetchUserProfile(), 300);
        return () => clearTimeout(timeout);
    }, [isAuthenticated, getAccessTokenSilently]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Benvenuto nella tua collezione</h1>
            {user && <p>Email: {user.email}</p>}
            <hr/>
            <div className="row justify-content-center">
                <div className="col">
                    <div>
                        <div
                            className={clsx(style.option, {[style.active]: displayGrid})}
                            onClick={() => setDisplayGrid(true)}
                        >
                            Grid
                        </div>
                        <div
                            className={clsx(style.option, {[style.active]: !displayGrid})}
                            onClick={() => setDisplayGrid(false)}
                        >
                            Table
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col">
                        {savedAmiibos.length > 0 ? (
                            displayGrid ? (
                                <AmiiboGrid savedAmiibos={savedAmiibos} col={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3}}/>
                            ) : (
                                <AmiiboTable savedAmiibos={savedAmiibos}/>
                            )
                        ) : (
                            <div className="text-center">
                                <p>Your collections is empty</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;