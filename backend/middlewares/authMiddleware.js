const { expressjwt: jwt } = require("express-jwt");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

// Funzione per estrarre la chiave pubblica dal token usando Promise
function getKey(header) {
    return new Promise((resolve, reject) => {
        client.getSigningKey(header.kid, function (err, key) {
            if (err) {
                reject(err);
            } else {
                const signingKey = key.publicKey || key.rsaPublicKey;
                resolve(signingKey);
            }
        });
    });
}

// Middleware di autenticazione con JWT tramite Auth0
const authMiddleware = jwt({
    secret: getKey,
    audience: process.env.AUTH0_API_IDENTIFIER,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"], // Algoritmo utilizzato da Auth0 per firmare i token
});

module.exports = authMiddleware;