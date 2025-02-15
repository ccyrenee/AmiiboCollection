import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { amiiboDefaultImage } from "../../utility/utility";
import style from "./AmiiboDetail.module.css";
import axios from "axios";
import AmiiboGrid from "../../components/AmiiboGrid/AmiiboGrid.jsx";

function AmiiboDetail() {
    const { tail } = useParams();
    const [amiiboData, setAmiiboData] = useState(null);
    const [relatedAmiibo, setRelatedAmiibo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:3000/collection/${tail}`)
            .then((response) => {
                setAmiiboData(response.data);
                return response.data.amiiboSeries;
                setLoading(false);
            })
            .then((amiiboSeries) => {
                if (amiiboSeries) {
                    axios
                        .get(`http://localhost:3000/collection?amiiboSeries=${amiiboSeries}`)
                        .then((response) => {
                            setRelatedAmiibo(response.data.slice(0, 6));
                        })
                        .catch(() => {
                            setRelatedAmiibo([]);
                        });
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Error in fetching amiibo's details");
                setLoading(false);
            });
    }, [tail]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div>
                        <NavLink to={`/collection`} className={style.link}>
                            &lt; Torna alla Collezione
                        </NavLink>
                    </div>
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
                    <div className="my-5 text-center">
                        <h2>Discover {amiiboData?.amiiboSeries} Collection</h2>
                        {relatedAmiibo.length > 0 ? (
                            <AmiiboGrid
                                amiiboList={relatedAmiibo}
                                col={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
                            />
                        ) : (
                            <p>No related amiibo found.</p>
                        )}
                        <NavLink className="button" to={`/collection/?amiiboSeries=${amiiboData?.amiiboSeries}`}>
                            Explore more
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AmiiboDetail;