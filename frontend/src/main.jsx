import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <Auth0Provider
        domain="dev-pve8xh78avyp18rn.us.auth0.com"
        clientId="H4qp5wis3Z5iPxX3yoNf9qA6tuUFsk97"
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://amiibo-api",
        }}
    >
        <App />
    </Auth0Provider>
)