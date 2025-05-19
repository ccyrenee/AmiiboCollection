const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const dotenv = require("dotenv");
dotenv.config();

//Middleware base per la verifica della validità di JST
const baseJwtMiddleware = jwt({
    //Recupera in modo dinamico la chiave pubblica di Auth0 da JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
    requestProperty: "user", //Agiunge il payload del token a req.user
});

// Middleware personalizzato che utilizza il baseJwtMiddleware e assegna auth0Id
const authMiddleware = (req, res, next) => {
    baseJwtMiddleware(req, res, (err) => {
        if (err) {
            // Se il token non è valido, lo passa al middleware di gestione errori
            return next(err);
        }
        // Se il token è valido, estrae l'ID utente (sub) e lo salva come auth0Id
        if (req.user && req.user.sub) {
            req.user.auth0Id = req.user.sub;
        } else {
            console.warn("Token exists but 'sub' is missing in req.user");
        }
        next();
    });
};

module.exports = authMiddleware;
