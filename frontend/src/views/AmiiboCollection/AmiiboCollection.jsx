import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AmiiboGrid from "../../components/AmiiboGrid/AmiiboGrid.jsx";
import AmiiboTable from "../../components/AmiiboTable/AmiiboTable.jsx";
import style from "./AmiiboCollection.module.css";
import clsx from "clsx";
import NotFound from "../../assets/images/notfound.png";
import axios from "axios";

function AmiiboCollection() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const [filterType, setFilterType] = useState(params.get("type") || "All");
    const [filterSeries, setFilterSeries] = useState(params.get("amiiboSeries") || "All");
    const [amiiboList, setAmiiboList] = useState([]);
    const [allSeries, setAllSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayGrid, setDisplayGrid] = useState(true);

    // Funzione per aggiornare l'URL
    const updateURL = () => {
        const queryParams = new URLSearchParams();
        if (filterSeries !== "All") queryParams.append("amiiboSeries", filterSeries);
        if (filterType !== "All") queryParams.append("type", filterType);
        navigate(`/collection/?${queryParams.toString()}`, { replace: true });
    };

    // Caricamento di tutte le serie disponibili
    useEffect(() => {
        axios
            .get("http://localhost:3000/collection")
            .then((response) => {
                const seriesList = Array.from(new Set(response.data.map((amiibo) => amiibo.amiiboSeries)));
                setAllSeries(seriesList);
            })
            .catch((error) => console.error("Error in loading unique amiiboSeries", error));
    }, []);

    // Caricamento degli amiibo filtrati
    useEffect(() => {
        if (loading) setLoading(true);
        const queryParams = new URLSearchParams();
        if (filterSeries !== "All") queryParams.append("amiiboSeries", filterSeries);
        if (filterType !== "All") queryParams.append("type", filterType);
        const url = `http://localhost:3000/collection/?${queryParams.toString()}`;

        axios
            .get(url)
            .then((response) => {
                setAmiiboList(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("Error in fetching amiibos");
                setLoading(false);
            });
        navigate(`/collection/?${queryParams.toString()}`, { replace: true });
    }, [filterType, filterSeries, navigate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col">
                    <h1>Amiibo Collection</h1>
                    <div className={style.filters}>
                        <div>
                            {["All", "Band", "Card", "Figure", "Yarn"].map((type) => (
                                <div
                                    key={type}
                                    className={clsx(style.option, { [style.active]: filterType === type })}
                                    onClick={() => {
                                        setFilterType(type);
                                        updateURL();
                                    }}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                        <div className={style.series}>
                            <select
                                className={style.option}
                                onChange={(e) => {
                                    setFilterSeries(e.target.value);
                                    updateURL();
                                }}
                                value={filterSeries}
                            >
                                <option value="All">All Series</option>
                                {allSeries.map((series, index) => (
                                    <option key={index} value={series}>{series}</option>
                                ))}
                            </select>
                        </div>
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
            </div>
            <div className="row justify-content-center">
                <div className="col">
                    {amiiboList.length > 0 ? (
                        displayGrid ? (
                            <AmiiboGrid amiiboList={amiiboList} col={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 3 }} />
                        ) : (
                            <AmiiboTable amiiboList={amiiboList} />
                        )
                    ) : (
                        <div className="text-center">
                            <p>No results found</p>
                            <img src={NotFound} alt="Not Found" width={110} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AmiiboCollection;