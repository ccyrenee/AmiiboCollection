import AmiiboCard from "../AmiiboCard/AmiiboCard";
import { combineHeadTail } from "../../utility/utility.jsx";

function AmiiboGrid(props) {
    const { amiiboList, col } = props;
    const amiiboCardsCol = amiiboList.map((amiibo) => {
        return (
            <div key={`${amiibo.tail}`} className="col">
                <AmiiboCard
                    name={amiibo.name}
                    tail={amiibo.tail}
                    image={amiibo.image}
                    amiiboSeries={amiibo.amiiboSeries}
                />
            </div>
        );id
    });

    return (
        <div className={`row 
                row-cols-${col.xs}
                row-cols-sm-${col.sm}
                row-cols-md-${col.md}
                row-cols-lg-${col.lg}
                row-cols-xl-${col.xl}
        `}>
            {amiiboCardsCol}
        </div>
    );
}

export default AmiiboGrid;