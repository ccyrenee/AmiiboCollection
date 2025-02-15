import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import AmiiboGrid from '../../components/AmiiboGrid/AmiiboGrid.jsx';
import Banner from '../../assets/images/banner.png';
import axios from "axios";

function Home() {
    const [amiiboData, setAmiiboData] = useState({
        latestAmiibos: [],
        animalCrossing: [],
        legendOfZelda: [],
        superMarioBros: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:3000/')
            .then((response) => {
                setAmiiboData({
                    latestAmiibos: response.data.latestAmiibo || [],
                    superMarioBros: response.data.superMarioBros || [],
                    legendOfZelda: response.data.legendOfZelda || [],
                    animalCrossing: response.data.animalCrossing || []
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error in fetching amiibos', error);
                setError("Error in fetching amiibos");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h1>Welcome to the world of Amiibo: collect, play, discover!</h1>
            <img src={Banner} alt="Banner"/>
            <div className="row justify-content-center">
                <div className="col">
                    <div className="my-5 text-center">
                        <h2>Discover the latest arrivals</h2>
                        <AmiiboGrid
                            amiiboList={amiiboData.latestAmiibos?.slice(0, 9)}
                            col={{xs: 1, sm: 1, md: 2, lg: 2, xl: 3}}
                        />
                        <NavLink className="button" to="/collection">
                            Explore more
                        </NavLink>
                    </div>
                    <div className="my-5 text-center">
                        <h2>Animal Crossing Collection</h2>
                        <AmiiboGrid
                            amiiboList={amiiboData.animalCrossing?.slice(0, 9)}
                            col={{xs: 1, sm: 1, md: 2, lg: 2, xl: 3}}
                        />
                        <NavLink className="button" to={`/collection/?amiiboSeries=Animal+Crossing`}>
                            Explore more
                        </NavLink>
                    </div>
                    <div className="my-5 text-center">
                        <h2>Legend Of Zelda Collection</h2>
                        <AmiiboGrid
                            amiiboList={amiiboData.legendOfZelda?.slice(0, 9)}
                            col={{xs: 1, sm: 1, md: 2, lg: 2, xl: 3}}
                        />
                        <NavLink className="button" to={`/collection/?amiiboSeries=Legend+Of+Zelda`}>
                            Explore more
                        </NavLink>
                    </div>
                    <div className="my-5 text-center">
                        <h2>Super Mario Bros. Collection</h2>
                        <AmiiboGrid
                            amiiboList={amiiboData.superMarioBros?.slice(0, 9)}
                            col={{xs: 1, sm: 1, md: 2, lg: 2, xl: 3}}
                        />
                        <NavLink className="button" to={`/collection/?amiiboSeries=Super+Mario+Bros.`}>
                            Explore more
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;