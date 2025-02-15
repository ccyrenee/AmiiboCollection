import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import unsavedIcon from "../../assets/images/unsaved.png";
import savedIcon from "../../assets/images/saved.png";
import style from "./SaveAmiiboButton.module.css";
import axios from "axios";

const SaveAmiiboButton = ({ tail }) => {
    const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [isSaved, setIsSaved] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const checkIfSaved = async () => {
            if (!isAuthenticated) return;

            try {
                const token = await getAccessTokenSilently({ audience: "amiiboapi.collection.com" });
                const response = await axios.get('/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const savedAmiibos = response.data.savedAmiibos;
                setIsSaved(savedAmiibos.includes(tail));
            } catch (error) {
                console.error("Error in checking saved amiibos:", error);
            }
        };

        checkIfSaved();
    }, [isAuthenticated, getAccessTokenSilently, tail]);

    const handleSave = async () => {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }

        try {
            const token = await getAccessTokenSilently({ audience: "amiiboapi.collection.com" });
            const method = isSaved ? "DELETE" : "POST";

            await axios({
                method,
                url: "/profile",
                headers: { Authorization: `Bearer ${token}` },
                data: { amiiboId: tail },  // `amiiboId` coerente con il backend
            });

            setIsSaved(!isSaved);
        } catch (error) {
            console.error("Error in saving/removing amiibo", error);
            alert("An error occurred. Please try again later");
        }
    };

    const handleLogin = () => {
        loginWithRedirect();
        setShowModal(false);
    };

    return (
        <>
            <button className={style.saveButton} onClick={handleSave}>
                <img
                    src={isSaved ? savedIcon : unsavedIcon}
                    alt={isSaved ? "Amiibo saved" : "Amiibo unsaved"}
                    className={style.img}
                />
            </button>
            <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
                <ModalHeader toggle={() => setShowModal(false)}>Authentication Required</ModalHeader>
                <ModalBody>
                    <p>To save an Amiibo to your collection, you must log in.</p>
                    <Button onClick={handleLogin}>Login or Sign up</Button>
                </ModalBody>
            </Modal>
        </>
    );
};

export default SaveAmiiboButton;