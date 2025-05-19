import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import axios from "axios";
import savedIcon from "../../assets/images/saved.png";
import unsavedIcon from "../../assets/images/unsaved.png";
import style from "./SaveAmiiboButton.module.css";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

function SaveAmiiboButton(props) {
    const { tail, isSaved, onSave, onUnsave } = props;
    const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleClick = async () => {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }

        setLoading(true);
        try {
            const token = await getAccessTokenSilently({ audience: "https://amiibo-api" });
            if (isSaved) {
                //Se salvato allora rimuove amiibo dal backend
                await axios.delete(`http://localhost:3000/profile/collection/${tail}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                onUnsave?.(tail);
            } else {
                //Se non è savalto allora aggiunge amiibo nel backend
                const res = await axios.post(
                    "http://localhost:3000/profile/collection",
                    { tail },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                //Se risposta contiene il tail, chiama onSave
                if (res.data?.savedAmiibos?.includes(tail)) {
                    onSave?.(tail);
                }
            }
        } catch (error) {
            console.error("Error saving or removing an amiibo", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button onClick={handleClick} disabled={loading} className={style.saveButton}>
                <img
                    src={isSaved ? savedIcon : unsavedIcon}
                    alt={isSaved ? "Amiibo saved" : "Amiibo unsaved"}
                    className={style.img}
                />
            </button>

            <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
                <ModalHeader toggle={() => setShowModal(false)} className={style.modalHeader}>
                    Authentication Required
                </ModalHeader>
                <ModalBody>
                    <p>To save an Amiibo to your collection, you must log in.</p>
                    <Button onClick={loginWithRedirect} className={style.modalButton}>
                        Login or Sign up
                    </Button>
                </ModalBody>
            </Modal>
        </>
    );
};

export default SaveAmiiboButton;