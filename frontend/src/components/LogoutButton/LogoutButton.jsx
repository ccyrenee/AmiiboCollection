import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();
    if (isAuthenticated) {
        return (
            <div>
                <button onClick={() => logout({ returnTo: window.location.origin })}>Log out</button>
            </div>
        );
    }
};

export default LogoutButton;