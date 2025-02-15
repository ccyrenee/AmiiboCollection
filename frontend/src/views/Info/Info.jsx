import InfosData from '../../assets/data/infos.json';

function Info() {

    return (
        <div>
            <h1>About Amiibo</h1>
            <p>Amiibo are interactive figures and cards that work with your favorite Nintendo games!</p>
            <p>{InfosData.description} <br/> </p>
            <p>{InfosData.conclusion} <br/> </p>
            <p>Learn more at <a href="https://www.nintendo.com/amiibo/" target="_blank">Nintendo's official site</a>.</p>
        </div>
    )
}

export default Info;
