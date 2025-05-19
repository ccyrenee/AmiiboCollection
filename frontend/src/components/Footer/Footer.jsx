import {NavLink} from "react-router-dom";
import style from "./Footer.module.css";
import disco from "../../assets/images/disco.png";
import unimib from "../../assets/images/unimib.png";

function Footer(props) {
    const { courseName, courseLink, navItems } = props;
    const itemList = navItems.map((item) => {
        return (
            <li key={item.link} className="nav-item">
                <NavLink exact={item.exact} className={style.active} to={item.link}>
                    {item.label}
                </NavLink>
            </li>
        )
    });
    return (
        <footer className={style.footer}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <nav className={style.footerNav}>
                            <ul className="nav flex-column">
                                {itemList}
                            </ul>
                        </nav>
                    </div>
                    <div className="col-md-auto">
                        <div className={`d-flex ${style.line}`}>
                            <div>
                                <a href={courseLink} target="_blank" className={style.link}>
                                    {courseName}
                                </a>
                            </div>
                            <div id={style.disco} className={style.logo}>
                                <a href="https://www.disco.unimib.it/it" target="_blank">
                                    <img src={disco} alt="disco"/>
                                </a>
                            </div>
                            <div id={style.unimib} className={style.logo}>
                                <a href="https://www.unimib.it/" target="_blank">
                                    <img src={unimib} alt="unimib"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div>&copy; 2025 Amiibo Collection. All rights reserved.</div>
            </div>
        </footer>
    );
};

export default Footer;