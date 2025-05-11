const jwksClient = require('jwks-rsa');
const { expressjwt: jwt } = require('express-jwt');

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,  // Controlla se viene usato correttamente
});

function getKey(header, callback) {
    console.log('Getting signing key for kid:', header.kid);

    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            console.error('Error getting signing key:', err);
            return callback(err, null);  // Passa null se c'è un errore
        }
        if (!key) {
            console.error('No key found for kid:', header.kid);
            return callback(new Error('No key found for kid'), null);
        }

        const signingKey = key.publicKey || key.rsaPublicKey;
        console.log('Signing key retrieved:', signingKey);  // Verifica la chiave ottenuta
        callback(null, signingKey);  // Passa la chiave al callback
    });
}

const authMiddleware = jwt({
    secret: getKey,
    audience: process.env.AUTH0_API_IDENTIFIER,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
}, (err, decoded) => {
    if (err) {
        console.log('JWT error:', err);  // Aggiungi log per errore JWT
    } else {
        console.log('Decoded JWT:', decoded);  // Aggiungi log per JWT decodificato
    }
});


module.exports = { authMiddleware };
