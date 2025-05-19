import AmiiboCard from "../AmiiboCard/AmiiboCard";

function AmiiboGrid(props) {
    const { amiiboList, col = { xs: 1, sm: 1, md: 1, lg: 2, xl: 3 }, onSave, onUnsave, savedTails = [] } = props;

    const amiiboCardsCol = (amiiboList || []).map((amiibo, index) => {
        const isSaved = savedTails.includes(amiibo.tail);
        return (
            <div key={amiibo.tail} className="col">
                <AmiiboCard
                    amiibo={amiibo}
                    isSaved={isSaved}
                    onSave={onSave}
                    onUnsave={onUnsave}
                />
            </div>
        );
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
};

export default AmiiboGrid;