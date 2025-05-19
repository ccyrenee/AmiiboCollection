import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import AmiiboGrid from '../../components/AmiiboGrid/AmiiboGrid.jsx';
import Banner from '../../assets/images/banner.png';
import axios from "axios";
import { useSavedAmiibos } from "../../context/SavedAmiiboProvider.jsx";

function Home() {
    const [amiiboData, setAmiiboData] = useState({
        latestAmiibos: [],
        animalCrossing: [],
        legendOfZelda: [],
        superMarioBros: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { savedTails, setSavedTails } = useSavedAmiibos();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/');
                setAmiiboData({
                    latestAmiibos: res.data.latestAmiibo || [],
                    superMarioBros: res.data.superMarioBros || [],
                    legendOfZelda: res.data.legendOfZelda || [],
                    animalCrossing: res.data.animalCrossing || []
                });
            } catch (error) {
                console.error('Error fetching data', error);
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = (tail) => {
        setSavedTails(prev => (prev.includes(tail) ? prev : [...prev, tail]));
    };

    const handleUnsave = (tail) => {
        setSavedTails(prev => prev.filter(t => t !== tail));
    };

    if (loading) {
        return (
            <div className="spinnerContainer">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h1>Welcome to the world of Amiibo: collect, play, discover!</h1>
            <img src={Banner} alt="Banner" />
            <div className="row justify-content-center">
                <div className="col">
                    {[
                        { title: "Discover the latest arrivals", data: amiiboData.latestAmiibos, link: "/collection" },
                        { title: "Animal Crossing Collection", data: amiiboData.animalCrossing, link: "/collection/?amiiboSeries=Animal+Crossing" },
                        { title: "Legend Of Zelda Collection", data: amiiboData.legendOfZelda, link: "/collection/?amiiboSeries=Legend+Of+Zelda" },
                        { title: "Super Mario Bros. Collection", data: amiiboData.superMarioBros, link: "/collection/?amiiboSeries=Super+Mario+Bros." },
                    ].map((section, index) => (
                        <div key={index} className="my-5 text-center">
                            <h2>{section.title}</h2>
                            <AmiiboGrid
                                amiiboList={section.data?.slice(0, 9)}
                                col={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
                                savedTails={savedTails}
                                onSave={handleSave}
                                onUnsave={handleUnsave}
                            />
                            <NavLink className="exploreButton" to={section.link}>
                                Explore more
                            </NavLink>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;