import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import AmiiboGrid from "../../components/AmiiboGrid/AmiiboGrid.jsx";
import AmiiboTable from "../../components/AmiiboTable/AmiiboTable.jsx";
import { useSavedAmiibos } from "../../context/SavedAmiiboProvider.jsx";
import style from "./AmiiboCollection.module.css";
import NotFound from "../../assets/images/notfound.png";

const ITEMS_PER_PAGE = 12;

const AmiiboCollection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const [filterType, setFilterType] = useState(params.get("type") || "All");
    const [filterSeries, setFilterSeries] = useState(params.get("amiiboSeries") || "All");
    const [amiiboList, setAmiiboList] = useState([]);
    const [allSeries, setAllSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayGrid, setDisplayGrid] = useState(true);
    const { savedTails, setSavedTails } = useSavedAmiibos();

    const updateURL = () => {
        const queryParams = new URLSearchParams();
        if (filterSeries !== "All") queryParams.append("amiiboSeries", filterSeries);
        if (filterType !== "All") queryParams.append("type", filterType);
        navigate(`/collection/?${queryParams.toString()}`, { replace: true });
    };

    //Recupero della lista di tutte le amiiboSeries univoche
    useEffect(() => {
        axios
            .get("http://localhost:3000/collection")
            .then((response) => {
                const seriesList = Array.from(new Set(response.data.map((amiibo) => amiibo.amiiboSeries)));
                setAllSeries(seriesList);
            })
            .catch((error) => console.error("Error in loading unique amiiboSeries", error));
    }, []);

    //Recupero degli amiibo filtrati per amiiboSerie e/o type
    useEffect(() => {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (filterSeries !== "All") queryParams.append("amiiboSeries", filterSeries);
        if (filterType !== "All") queryParams.append("type", filterType);
        const url = `http://localhost:3000/collection/?${queryParams.toString()}`;

        axios
            .get(url)
            .then((response) => {
                setAmiiboList(response.data);
                setCurrentPage(1);
                setLoading(false);
            })
            .catch((error) => {
                setError("Error in fetching amiibos");
                setLoading(false);
            });

        navigate(`/collection/?${queryParams.toString()}`, { replace: true });
    }, [filterType, filterSeries, navigate]);

    //Visualizzazione di 12 amiibo per pagina
    const totalPages = Math.ceil(amiiboList.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedAmiibos = amiiboList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleSave = (tail) => {
        setSavedTails(prev => (prev.includes(tail) ? prev : [...prev, tail]));
    };

    const handleUnsave = (tail) => {
        setSavedTails(prev => prev.filter(t => t !== tail));
    };

    if (loading)
        return (
            <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>
        );

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col">
                    <h1>Amiibo Collection</h1>
                    <div className={style.filters}>
                        {/* Filtri per type */}
                        <div className={style.filtersLeft}>
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
                            {/* Filtri per amiiboSeries */}
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
                                        <option key={index} value={series}>
                                            {series}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Modalità di visualizzazione */}
                        <div className={style.filtersRight}>
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
                    {/* Lista amiibo */}
                    {paginatedAmiibos.length > 0 ? (
                        displayGrid ? (
                            <AmiiboGrid
                                amiiboList={paginatedAmiibos}
                                savedTails={savedTails}
                                onSave={handleSave}
                                onUnsave={handleUnsave}
                            />
                        ) : (
                            <AmiiboTable
                                amiiboList={paginatedAmiibos}
                                savedTails={savedTails}
                                onSave={handleSave}
                                onUnsave={handleUnsave}
                            />
                        )
                    ) : (
                        <div className="noResultsContainer">
                            <img src={NotFound} alt="Not Found" width={110} />
                            <p>No results found</p>
                        </div>
                    )}

                    {/* Navigazione pagine */}
                    {totalPages > 1 && (
                        <div className={style.paginationContainer}>
                            <div className={style.paginationControls}>
                                <button
                                    className="button"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    ←
                                </button>
                                <span className={style.paginationText}>
                                    {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="button"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AmiiboCollection;