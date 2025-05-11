import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            loginWithRedirect();
        }
    }, [isAuthenticated, isLoading, loginWithRedirect]);

    if (isLoading) {
        return <div>Checking authentication...</div>;
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
