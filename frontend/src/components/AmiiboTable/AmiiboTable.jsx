import { NavLink } from "react-router-dom";
import style from "./AmiiboTable.module.css";
import SaveAmiiboButton from "../SaveAmiiboButton/SaveAmiiboButton";

function AmiiboTable(props) {
    const { amiiboList, savedTails = [], onSave, onUnsave } = props;

    const amiiboTable = (amiiboList || []).map((amiibo) => {
        const isSaved = savedTails.includes(amiibo.tail);

        return (
            <tr key={amiibo.tail}>
                <td>{amiibo.name}</td>
                <td>{amiibo.amiiboSeries}</td>
                <td>{amiibo.tail}</td>
                <td>{amiibo.type}</td>
                <td>
                    <NavLink to={`/collection/${amiibo.tail}`} className={style.action}>
                        Info
                    </NavLink>
                </td>
                <td>
                    <SaveAmiiboButton
                        tail={amiibo.tail}
                        isSaved={isSaved}
                        onSave={onSave}
                        onUnsave={onUnsave}
                    />
                </td>
            </tr>
        );
    });

    return (
        <div className={style.tableWrapper}>
            <table className={`table ${style.table}`}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Series</th>
                    <th>Tail</th>
                    <th>Type</th>
                    <th>Info</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>{amiiboTable}</tbody>
            </table>
        </div>
    );
};

export default AmiiboTable;