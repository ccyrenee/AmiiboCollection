import { NavLink } from "react-router-dom";
import style from "./AmiiboTable.module.css";

function AmiiboTable(props) {
    const { amiiboList } = props;
    const amiiboTable = amiiboList.map((amiibo) => {
        return (
            <tr key={`${amiibo.tail}`}>
                <td>{amiibo.name}</td>
                <td>{amiibo.amiiboSeries}</td>
                <td>{amiibo.tail}</td>
                <td>{amiibo.type}</td>
                <td><NavLink to={`/collection/${amiibo.tail}`} className={style.action}>Info</NavLink></td>
            </tr>
        )
    });

    return (
        <table className={`table ${style.table}`}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Series</th>
                <th>Tail</th>
                <th>Type</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {amiiboTable}
            </tbody>
        </table>
    )
}

export default AmiiboTable;