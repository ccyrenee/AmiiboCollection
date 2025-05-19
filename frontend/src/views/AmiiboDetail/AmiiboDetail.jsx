import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { amiiboDefaultImage } from "../../utility/utility";
import style from "./AmiiboDetail.module.css";
import axios from "axios";
import AmiiboGrid from "../../components/AmiiboGrid/AmiiboGrid.jsx";
import SaveAmiiboButton from "../../components/SaveAmiiboButton/SaveAmiiboButton.jsx";
import { useSavedAmiibos } from "../../context/SavedAmiiboProvider.jsx";

function AmiiboDetail() {
    const { tail } = useParams();
    const [amiiboData, setAmiiboData] = useState(null);
    const [relatedAmiibo, setRelatedAmiibo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { savedTails, setSavedTails } = useSavedAmiibos();

    useEffect(() => {
        const fetchData = async () => {
            try {
                //Recupero dei dettagli amiibo dato il suo tail
                const res = await axios.get(`http://localhost:3000/collection/${tail}`);
                setAmiiboData(res.data);
                const amiiboSeries = res.data?.amiiboSeries;

                //Recupero degli amiibo correlati rispetto amiiboSeries
                if (amiiboSeries) {
                    const relatedRes = await axios.get(
                        `http://localhost:3000/collection?amiiboSeries=${encodeURIComponent(amiiboSeries)}`
                    );
                    setRelatedAmiibo(relatedRes.data.slice(0, 6));
                }
            } catch (error) {
                console.error("Errore durante il fetch dei dati", error);
                setError("Error in fetching amiibo's details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tail]);

    const isSaved = savedTails.includes(tail);

    const handleSave = (tail) => {
        setSavedTails((prev) => (prev.includes(tail) ? prev : [...prev, tail]));
    };

    const handleUnsave = (tail) => {
        setSavedTails((prev) => prev.filter((t) => t !== tail));
    };

    if (loading) {
        return (
            <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="col d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <NavLink to={`/collection`} className={style.link}>
                            &lt; Back to Collection
                        </NavLink>
                        <SaveAmiiboButton
                            tail={tail}
                            isSaved={isSaved}
                            onSave={handleSave}
                            onUnsave={handleUnsave}
                        />
                    </div>
                    {/* Informazioni */}
                    <div className={style.heading}>
                        <h1>{amiiboData?.name}</h1>
                        <div className={style.tail}>#{tail}</div>
                    </div>
                    <div className={style.gallery}>
                        <img
                            className={style.image}
                            onError={amiiboDefaultImage}
                            src={amiiboData?.image}
                            alt={amiiboData?.name}
                        />
                        <div className={style.series}>
                            {amiiboData?.amiiboSeries} - {amiiboData?.type}
                        </div>
                    </div>
                    <div className={style.info}>
                        {amiiboData?.release && (
                            <div className={style.releases}>
                                <strong className={style.label}>Release in</strong>
                                <ul>
                                    <li>Australia: {amiiboData?.release.au || "N/A"}</li>
                                    <li>Europe: {amiiboData?.release.eu || "N/A"}</li>
                                    <li>Japan: {amiiboData?.release.jp || "N/A"}</li>
                                    <li>North America: {amiiboData?.release.na || "N/A"}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    {/* Amiibo correlati */}
                    <div className="my-5 text-center">
                        <h2>Discover {amiiboData?.amiiboSeries} Collection</h2>
                        {relatedAmiibo.length > 0 ? (
                            <AmiiboGrid
                                amiiboList={relatedAmiibo}
                                col={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
                                savedTails={savedTails}
                                onSave={handleSave}
                                onUnsave={handleUnsave}
                            />
                        ) : (
                            <p>No related amiibo found.</p>
                        )}
                        <NavLink
                            className="exploreButton"
                            to={`/collection/?amiiboSeries=${encodeURIComponent(amiiboData?.amiiboSeries || "")}`}
                        >
                            Explore more
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AmiiboDetail;