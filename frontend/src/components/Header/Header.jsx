import { useState } from 'react';
import { NavLink } from "react-router-dom";
import { Collapse, Nav, Navbar, NavbarToggler, NavItem } from 'reactstrap';
import LoginButton from '../../components/LoginButton/LoginButton.jsx';
import LogoutButton from '../../components/LogoutButton/LogoutButton.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import style from "./Header.module.css";

const Header = ({ logo, navItems }) => {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <Navbar expand="md" className={style.navBar}>
            <NavLink to="/">
                <img className={style.logo} src={logo} alt="Logo" />
            </NavLink>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar className={style.collapseMenu}>
                <Nav className="mr-auto" navbar>
                    {navItems.map((item) => (
                        <NavItem key={item.link} className={style.navItem}>
                            <NavLink exact={item.exact} to={item.link}>
                                {item.label}
                            </NavLink>
                        </NavItem>
                    ))}
                    {isAuthenticated && (
                        <NavItem className={style.navItem}>
                            <NavLink to="/profile">Profile</NavLink>
                        </NavItem>
                    )}
                </Nav>
                <div className={style.authButton}>
                    {isAuthenticated ? <LogoutButton/> : <LoginButton/>}
                </div>
            </Collapse>
        </Navbar>
    );
};

export default Header;