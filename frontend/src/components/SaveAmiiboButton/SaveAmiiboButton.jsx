import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import unsavedIcon from "../../assets/images/unsaved.png";
import savedIcon from "../../assets/images/saved.png";
import style from "./SaveAmiiboButton.module.css";
import axios from "axios";

const SaveAmiiboButton = ({ tail, name, image }) => {
    const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [isSaved, setIsSaved] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // useEffect per verificare se l'amiibo è già salvato
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
                console.error("Error checking saved amiibos:", error);  // Log per errore
                setErrorMessage(`Failed to check saved Amiibos: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        checkIfSaved();
    }, [isAuthenticated, getAccessTokenSilently, tail]);

    // Funzione per gestire il salvataggio/rimozione dell'amiibo
    const handleSave = async () => {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }

        setLoading(true);
        setErrorMessage(""); // Reset dell'errore prima di una nuova operazione
        try {
            // Recupera il token
            const token = await getAccessTokenSilently({ audience: "https://amiibo-api" });

            if (!token) {
                throw new Error("No token received");
            }

            const method = isSaved ? "DELETE" : "POST";

            // Invia la richiesta con l'intestazione di autorizzazione
            const response = await axios({
                method,
                url: `http://localhost:3000/profile/collection/${tail}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    tail,
                    name, // recuperato da props
                    image // recuperato da props
                }
            });


            if (response.status === 200) {
                setIsSaved(!isSaved);  // Cambia lo stato di salvataggio
            }
        } catch (error) {
            console.error("Error in saving/removing amiibo", error);  // Log per errore
            setErrorMessage("An error occurred while saving/removing the Amiibo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        loginWithRedirect();
        setShowModal(false);
    };

    return (
        <>
            <button
                className={style.saveButton}
                onClick={handleSave}
                disabled={loading}
            >
                <img
                    src={isSaved ? savedIcon : unsavedIcon}
                    alt={isSaved ? "Amiibo saved" : "Amiibo unsaved"}
                    className={style.img}
                />
            </button>
            {loading && <div className={style.loading}>Saving...</div>}
            {errorMessage && <div className={style.error}>{errorMessage}</div>}

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
