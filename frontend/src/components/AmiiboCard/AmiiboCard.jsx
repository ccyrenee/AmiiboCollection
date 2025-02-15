import { useState } from "react";
import { Card, CardBody, CardImg, CardTitle } from "reactstrap";
import { NavLink } from "react-router-dom";
import { amiiboDefaultImage } from "../../utility/utility";
import SaveAmiiboButton from "../SaveAmiiboButton/SaveAmiiboButton.jsx";
import style from "./AmiiboCard.module.css";

const AmiiboCard = (props) => {
    const { name, image, amiiboSeries, tail } = props;
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
                <SaveAmiiboButton tail={tail}/>
            </div>
        </div>
    );
}

export default AmiiboCard;