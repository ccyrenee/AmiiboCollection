import { useState } from 'react';
import { NavLink } from "react-router-dom";
import { Collapse, Nav, Navbar, NavbarToggler, NavItem } from 'reactstrap';
import { useAuth0 } from "@auth0/auth0-react";
import style from "./Header.module.css";

const Header = ({ logo, navItems }) => {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <Navbar expand="md">
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
                <button onClick={() => isAuthenticated ? logout({ returnTo: window.location.origin }) : loginWithRedirect()}>
                    {isAuthenticated ? "Logout" : "Login / Sign In"}
                </button>
            </Collapse>
        </Navbar>
    );
};

export default Header;