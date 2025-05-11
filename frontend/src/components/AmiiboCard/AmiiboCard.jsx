import { useState, useEffect } from "react";
import { Card, CardBody, CardImg, CardTitle } from "reactstrap";
import { NavLink } from "react-router-dom";
import { amiiboDefaultImage } from "../../utility/utility";
import SaveAmiiboButton from "../SaveAmiiboButton/SaveAmiiboButton.jsx";
import style from "./AmiiboCard.module.css";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const AmiiboCard = (props) => {
    const { name, image, amiiboSeries, tail } = props;
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkIfSaved = async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                const token = await getAccessTokenSilently({ audience: "https://amiibo-api" });
                const response = await axios.get('http://localhost:3000/profile/collection', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const savedAmiibos = response?.data?.savedAmiibos || [];
                setIsSaved(savedAmiibos.some(a => a.tail === tail));
            } catch (error) {
                console.error("Error checking saved amiibos:", error);
            } finally {
                setLoading(false);
            }
        };

        checkIfSaved();
    }, [isAuthenticated, getAccessTokenSilently, tail]);

    const handleSaveButtonClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div className={style.cardContainer}>
            <NavLink to={`/collection/${tail}`} className={style.link}>
                <Card className={style.card}>
                    <div className={style.imageContainer}>
                        <CardImg
                            onError={(event) => amiiboDefaultImage(event)}
                            loading="lazy"
                            className={style.image}
                            src={image}
                            alt={name}
                        />
                    </div>
                    <CardBody className={style.cardBody}>
                        <CardTitle className={style.title}>{name}</CardTitle>
                        <div className={style.text}>{amiiboSeries}</div>
                    </CardBody>
                </Card>
            </NavLink>
            <div className={style.saveButtonContainer}>
                <SaveAmiiboButton
                    tail={tail}
                    name={name}
                    image={image}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                />
            </div>
        </div>
    );
}

export default AmiiboCard;
